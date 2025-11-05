// frontend/src/api/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE + "/api/", // points to /api/ endpoints
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // enable if you use cookies (we're using token/localStorage for dev)
});

// Simple token helpers (dev). We'll use them later for auth.
const ACCESS_KEY = "ims_access";
const REFRESH_KEY = "ims_refresh";

export function setTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// attach Authorization header if token present
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// optionally: auto-refresh on 401 (basic)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = getRefreshToken();
      if (!refresh) {
        clearTokens();
        return Promise.reject(err);
      }
      try {
        const r = await axios.post(`${API_BASE}/api/token/refresh/`, {
          refresh,
        });
        setTokens({ access: r.data.access, refresh });
        original.headers.Authorization = `Bearer ${r.data.access}`;
        return axios(original);
      } catch (e) {
        clearTokens();
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;

