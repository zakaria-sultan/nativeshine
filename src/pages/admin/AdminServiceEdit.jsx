import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useServices } from "../../context/ServicesContext";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabase";
import {
  deleteServiceImage,
  saveService,
  uploadServiceImage,
} from "../../lib/adminApi";
import { slugifyTitle } from "../../lib/servicesApi";
import {
  findImage,
  nextEmptyRecentSlot,
  occupiedRecentSlots,
  recentDisplayIndex,
} from "../../lib/imageSlots";
import { optimizedImageUrl } from "../../lib/imageOptimize";

const PRIMARY_SLOTS = [
  { kind: "thumbnail", slot: 1, label: "Thumbnail (homepage card)" },
  { kind: "hero", slot: 1, label: "Hero (service page)" },
];

export default function AdminServiceEdit() {
  const { id } = useParams();
  const isNew = id === "new";
  const { canEdit } = useAuth();
  const { refresh: refreshPublic } = useServices();
  const { showToast } = useToast();
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
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const load = useCallback(async () => {
    if (isNew || !supabase) return;
    setLoading(true);
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
      showToast(err.message || "Failed to load service", "error");
    } finally {
      setLoading(false);
    }
  }, [id, isNew, showToast]);

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
    try {
      const saved = await saveService({
        id: isNew ? undefined : id,
        ...form,
        sort_order: Number(form.sort_order) || 0,
      });
      await refreshPublic();
      showToast(isNew ? "Service created" : "Service updated", "success");
      if (isNew) {
        navigate(`/admin/services/${saved.id}`, { replace: true });
      } else {
        setImages(saved.service_images || []);
      }
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (kind, slot, file) => {
    if (!canEdit || !file || isNew) return;
    setUploading(true);
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
      showToast(existing ? "Image replaced" : "Image added", "success");
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const onAddRecent = async (file) => {
    if (!file) return;
    const next = nextEmptyRecentSlot(images);
    if (!next) {
      showToast("Maximum gallery images reached (16).", "error");
      return;
    }
    await onUpload(next.kind, next.slot, file);
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
      showToast("Image removed", "success");
    } catch (err) {
      showToast(err.message || "Remove failed", "error");
    }
  };

  const recentOccupied = useMemo(() => occupiedRecentSlots(images), [images]);
  const canAddMore = Boolean(nextEmptyRecentSlot(images));

  const title = useMemo(
    () => (isNew ? "New service" : form.title || "Edit service"),
    [isNew, form.title],
  );

  if (loading) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  const renderCard = (kind, slot, label) => {
    const img = findImage(images, kind, slot);
    const preview = img?.url
      ? optimizedImageUrl(img.url, { width: 480, quality: 70 })
      : "";
    return (
      <div key={`${kind}-${slot}`} className="border border-slate-200 bg-white p-4">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
          {img?.url ? (
            <img
              src={preview || img.url}
              alt={label}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (e.currentTarget.src !== img.url) {
                  e.currentTarget.src = img.url;
                }
              }}
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
                disabled={uploading}
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
  };

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
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-tight">Images</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add as many recent-work photos as you need (up to 16). New uploads
              are compressed automatically for faster loading.
            </p>
          </div>
          {!isNew && canEdit && canAddMore ? (
            <label className="inline-flex cursor-pointer items-center gap-2 bg-[#0ea5e9] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-900">
              <Plus size={16} />
              {uploading ? "Uploading…" : "Add image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onAddRecent(file);
                  e.target.value = "";
                }}
              />
            </label>
          ) : null}
        </div>

        {isNew ? (
          <p className="mt-2 text-sm text-slate-500">
            Save the service first, then upload images.
          </p>
        ) : (
          <>
            <h4 className="mt-6 text-xs font-black uppercase tracking-widest text-slate-400">
              Marketing
            </h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRIMARY_SLOTS.map(({ kind, slot, label }) =>
                renderCard(kind, slot, label),
              )}
            </div>

            <h4 className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400">
              Recent works ({recentOccupied.length})
            </h4>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentOccupied.map(({ kind, slot }) =>
                renderCard(
                  kind,
                  slot,
                  `Recent works #${recentDisplayIndex(kind, slot)}`,
                ),
              )}
              {!recentOccupied.length ? (
                <p className="text-sm text-slate-400">
                  No gallery images yet. Click “Add image”.
                </p>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
