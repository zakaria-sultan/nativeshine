import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PasswordField from "../../components/admin/PasswordField";

export default function AdminLogin() {
  const { signIn, session, loading, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <p className="text-sm text-white/80">
          Supabase env vars are missing. Admin login is unavailable.
        </p>
      </div>
    );
  }

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ea5e9]">
          NativeShine
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage services and images for the live website.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
            />
          </div>
          <PasswordField
            id="admin-password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-sm bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full bg-[#0ea5e9] py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-slate-900 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
