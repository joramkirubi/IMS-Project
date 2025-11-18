// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tokens"));
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on mount / tokens change
  useEffect(() => {
    const init = async () => {
      if (tokens?.access) {
        try {
          const res = await api.get("/auth/me/");
          setUser(res.data);
        } catch (err) {
          console.warn("Failed to fetch user", err);
          // If token invalid, clear tokens
          setTokens(null);
          localStorage.removeItem("tokens");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    init();
  }, [tokens]);

  // Login function
  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/token/", { username, password });

      const newTokens = {
        access: res.data.access,
        refresh: res.data.refresh,
      };

      setTokens(newTokens);
      localStorage.setItem("tokens", JSON.stringify(newTokens));

      // Fetch user profile
      const me = await api.get("/auth/me/");
      setUser(me.data);
    } catch (err) {
      // Clear tokens and user if login fails
      setTokens(null);
      setUser(null);
      localStorage.removeItem("tokens");
      throw err; // propagate error to Login.jsx
    }
  };

  // Logout - use callback to allow parent to handle navigation
  const logout = useCallback(() => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("tokens");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        loading,
        isAuthenticated: !!tokens?.access,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
