// frontend/src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setError(null);
    setLoading(true);

    try {
      await login(form.username, form.password);
      // Navigate without full page reload
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="w-full border rounded p-2 mb-3"
          required
        />

        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full border rounded p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
