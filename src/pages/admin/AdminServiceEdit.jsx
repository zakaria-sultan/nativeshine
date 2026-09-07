import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useServices } from "../../context/ServicesContext";
import { supabase } from "../../lib/supabase";
import {
  deleteServiceImage,
  saveService,
  uploadServiceImage,
} from "../../lib/adminApi";
import { slugifyTitle } from "../../lib/servicesApi";

const IMAGE_SLOTS = [
  { kind: "thumbnail", slot: 1, label: "Thumbnail (homepage card)" },
  { kind: "hero", slot: 1, label: "Hero (service page)" },
  ...[1, 2, 3, 4, 5, 6].map((slot) => ({
    kind: "recent",
    slot,
    label: `Recent works #${slot}`,
  })),
];

function findImage(images, kind, slot) {
  return (images || []).find((img) => img.kind === kind && img.slot === slot);
}

export default function AdminServiceEdit() {
  const { id } = useParams();
  const isNew = id === "new";
  const { canEdit } = useAuth();
  const { refresh: refreshPublic } = useServices();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    sort_order: 0,
    is_published: true,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const load = useCallback(async () => {
    if (isNew || !supabase) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("services")
        .select("*, service_images(*)")
        .eq("id", id)
        .single();
      if (err) throw err;
      setForm({
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        sort_order: data.sort_order ?? 0,
        is_published: data.is_published,
      });
      setImages(data.service_images || []);
      setSlugTouched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched && isNew) {
        next.slug = slugifyTitle(value);
      }
      return next;
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const saved = await saveService({
        id: isNew ? undefined : id,
        ...form,
        sort_order: Number(form.sort_order) || 0,
      });
      await refreshPublic();
      setMessage("Saved");
      if (isNew) {
        navigate(`/admin/services/${saved.id}`, { replace: true });
      } else {
        setImages(saved.service_images || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (kind, slot, file) => {
    if (!canEdit || !file || isNew) return;
    setError("");
    try {
      const existing = findImage(images, kind, slot);
      const row = await uploadServiceImage({
        serviceId: id,
        slug: form.slug,
        kind,
        slot,
        file,
        existingStoragePath: existing?.storage_path,
      });
      setImages((prev) => {
        const without = prev.filter(
          (img) => !(img.kind === kind && img.slot === slot),
        );
        return [...without, row];
      });
      await refreshPublic();
      setMessage(`Updated ${kind} image`);
    } catch (err) {
      setError(err.message);
    }
  };

  const onRemoveImage = async (kind, slot) => {
    if (!canEdit) return;
    const existing = findImage(images, kind, slot);
    if (!existing) return;
    if (!window.confirm("Remove this image?")) return;
    try {
      await deleteServiceImage(existing);
      setImages((prev) =>
        prev.filter((img) => !(img.kind === kind && img.slot === slot)),
      );
      await refreshPublic();
      setMessage("Image removed");
    } catch (err) {
      setError(err.message);
    }
  };

  const title = useMemo(
    () => (isNew ? "New service" : form.title || "Edit service"),
    [isNew, form.title],
  );

  if (loading) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div>
      <Link
        to="/admin/services"
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#0ea5e9]"
      >
        <ArrowLeft size={14} /> Back to services
      </Link>
      <h2 className="mt-4 text-2xl font-black tracking-tight">{title}</h2>
      {!canEdit ? (
        <p className="mt-2 text-sm text-amber-700">
          Your role is read-only. Ask a super/admin to make changes.
        </p>
      ) : null}

      <form onSubmit={onSave} className="mt-6 space-y-5 border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              disabled={!canEdit}
              className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Slug (URL)
            </label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value);
              }}
              required
              disabled={!canEdit}
              className="w-full border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-[#0ea5e9]"
            />
            <p className="mt-1 text-xs text-slate-400">
              Public URL: /services/{form.slug || "…"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Sort order
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setField("sort_order", e.target.value)}
              disabled={!canEdit}
              className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
            />
          </div>
          <label className="mt-6 flex items-center gap-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setField("is_published", e.target.checked)}
              disabled={!canEdit}
              className="size-4 accent-[#0ea5e9]"
            />
            Published on website
          </label>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
            Content
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
            rows={14}
            disabled={!canEdit}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-[#0ea5e9]"
          />
        </div>

        {canEdit ? (
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0ea5e9] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-900 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save service"}
          </button>
        ) : null}
      </form>

      <section id="images" className="mt-10">
        <h3 className="text-lg font-black tracking-tight">Images</h3>
        {isNew ? (
          <p className="mt-2 text-sm text-slate-500">
            Save the service first, then upload images.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGE_SLOTS.map(({ kind, slot, label }) => {
              const img = findImage(images, kind, slot);
              return (
                <div
                  key={`${kind}-${slot}`}
                  className="border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <div className="mt-3 aspect-[4/3] overflow-hidden bg-slate-100">
                    {img?.url ? (
                      <img
                        src={img.url}
                        alt={label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  {canEdit ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0ea5e9]">
                        <Upload size={14} />
                        {img ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(kind, slot, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {img ? (
                        <button
                          type="button"
                          onClick={() => onRemoveImage(kind, slot)}
                          className="inline-flex items-center gap-1.5 border border-rose-100 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {message ? (
        <p className="mt-4 rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-sm bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
