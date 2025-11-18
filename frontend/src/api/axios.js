// frontend/src/api/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Use a single `tokens` JSON entry so it matches AuthProvider
const TOKENS_KEY = "tokens";

// Helpers
export function setTokens({ access, refresh }) {
  const current = (() => {
    try {
      return JSON.parse(localStorage.getItem(TOKENS_KEY)) || {};
    } catch {
      return {};
    }
  })();

  const updated = {
    ...current,
    ...(access ? { access } : {}),
    ...(refresh ? { refresh } : {}),
  };

  localStorage.setItem(TOKENS_KEY, JSON.stringify(updated));
}

export function getAccessToken() {
  try {
    const t = JSON.parse(localStorage.getItem(TOKENS_KEY));
    return t?.access || null;
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    const t = JSON.parse(localStorage.getItem(TOKENS_KEY));
    return t?.refresh || null;
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKENS_KEY);
}

// ----------------------------
// 1️⃣ Add access token to requests
// ----------------------------
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------------------------
// 2️⃣ Auto-refresh expired access token
// ----------------------------
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If 401 -> try refresh once
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = getRefreshToken();
      if (!refresh) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      }

      try {
        const r = await axios.post(`${API_BASE}/api/auth/token/refresh/`, {
          refresh,
        });

        // Store new token
        setTokens({ access: r.data.access, refresh });

        // Retry request with new access token
        original.headers.Authorization = `Bearer ${r.data.access}`;
        return axios(original);
      } catch (e) {
        // Refresh failed → logout user
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
