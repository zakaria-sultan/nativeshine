import React from "react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  KeyRound,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-bold transition-colors ${
    isActive
      ? "bg-[#0ea5e9] text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function AdminLayout() {
  const { profile, signOut, isSuper, loading, session, configured } = useAuth();
  const navigate = useNavigate();

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-sm border border-amber-200 bg-amber-50 p-8 text-center">
          <h1 className="text-lg font-black text-slate-900">Admin not configured</h1>
          <p className="mt-3 text-sm text-slate-600">
            Set <code className="text-xs">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> then redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-black uppercase tracking-widest text-slate-400">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 px-5 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0ea5e9]">
              NativeShine
            </p>
            <h1 className="mt-1 text-lg font-black tracking-tight">Admin</h1>
            <p className="mt-2 truncate text-xs text-slate-500">
              {profile?.email}
              {profile?.role ? (
                <span className="ml-2 rounded-sm bg-slate-100 px-1.5 py-0.5 font-bold uppercase tracking-wider text-slate-600">
                  {profile.role}
                </span>
              ) : null}
            </p>
          </div>
          <nav className="space-y-1 p-3">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/admin/services" className={linkClass}>
              <Briefcase size={18} /> Services
            </NavLink>
            {isSuper ? (
              <NavLink to="/admin/users" className={linkClass}>
                <Users size={18} /> Users
              </NavLink>
            ) : null}
            <NavLink to="/admin/account" className={linkClass}>
              <KeyRound size={18} /> Account
            </NavLink>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
            >
              <ExternalLink size={18} /> View site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={18} /> Sign out
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
