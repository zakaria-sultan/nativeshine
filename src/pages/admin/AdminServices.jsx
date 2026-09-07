import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useServices } from "../../context/ServicesContext";
import { useToast } from "../../context/ToastContext";
import { deleteService, fetchAdminServices } from "../../lib/adminApi";

export default function AdminServices() {
  const { canEdit } = useAuth();
  const { refresh: refreshPublic } = useServices();
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchAdminServices());
    } catch (err) {
      showToast(err.message || "Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = async (row) => {
    if (!canEdit) return;
    if (!window.confirm(`Delete service “${row.title}”? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteService(row.id);
      await load();
      await refreshPublic();
      showToast(`Deleted “${row.title}”`, "success");
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Services</h2>
          <p className="mt-1 text-sm text-slate-500">
            These appear in the site menu, homepage, and service pages.
          </p>
        </div>
        {canEdit ? (
          <Link
            to="/admin/services/new"
            className="inline-flex items-center gap-2 bg-[#0ea5e9] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-900"
          >
            <Plus size={16} /> New service
          </Link>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No services yet. Run the seed script or create one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Images</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {row.sort_order}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{row.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {row.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        row.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {(row.service_images || []).length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/services/${row.id}`}
                        className="inline-flex items-center gap-1 rounded-sm border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <Link
                        to={`/admin/services/${row.id}#images`}
                        className="inline-flex items-center gap-1 rounded-sm border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
                      >
                        <ImageIcon size={14} /> Images
                      </Link>
                      {canEdit ? (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center gap-1 rounded-sm border border-rose-100 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
