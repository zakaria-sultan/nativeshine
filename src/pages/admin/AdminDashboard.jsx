import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useServices } from "../../context/ServicesContext";

export default function AdminDashboard() {
  const { profile, canEdit, isSuper } = useAuth();
  const { services, source } = useServices();

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Data source: <span className="font-bold text-slate-700">{source}</span> ·{" "}
        {services.length} published services on the public site.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/services"
          className="border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#0ea5e9]"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#0ea5e9]">
            Services
          </p>
          <p className="mt-3 text-3xl font-black">{services.length}</p>
          <p className="mt-2 text-sm text-slate-500">
            {canEdit
              ? "Add, edit, or remove services and images"
              : "View services and images (read-only)"}
          </p>
        </Link>
        {isSuper ? (
          <Link
            to="/admin/users"
            className="border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#0ea5e9]"
          >
            <p className="text-xs font-black uppercase tracking-widest text-[#0ea5e9]">
              Users
            </p>
            <p className="mt-3 text-lg font-black">Manage access</p>
            <p className="mt-2 text-sm text-slate-500">
              Create users, roles, and reset passwords
            </p>
          </Link>
        ) : null}
        <Link
          to="/admin/account"
          className="border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#0ea5e9]"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#0ea5e9]">
            Account
          </p>
          <p className="mt-3 text-lg font-black">Password &amp; profile</p>
          <p className="mt-2 text-sm text-slate-500">
            Change your password securely
          </p>
        </Link>
      </div>
    </div>
  );
}
