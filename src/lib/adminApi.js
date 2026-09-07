import { supabase } from "../lib/supabase";
import { compressImageForUpload } from "./imageOptimize";

export async function invokeAdminUsers(action, payload = {}) {
  if (!supabase) throw new Error("Supabase is not configured");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not signed in");

  // Prefer Vercel serverless API (no Edge Function deploy needed)
  const res = await fetch("/api/admin-users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    throw new Error(data?.error || `User admin failed (${res.status})`);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function fetchAdminServices() {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("services")
    .select("*, service_images(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveService(payload) {
  if (!supabase) throw new Error("Supabase is not configured");
  const row = {
    title: payload.title,
    slug: payload.slug,
    content: payload.content ?? "",
    sort_order: payload.sort_order ?? 0,
    is_published: payload.is_published ?? true,
  };
  if (payload.id) {
    const { data, error } = await supabase
      .from("services")
      .update(row)
      .eq("id", payload.id)
      .select("*, service_images(*)")
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from("services")
    .insert(row)
    .select("*, service_images(*)")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteService(id) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadServiceImage({
  serviceId,
  slug,
  kind,
  slot,
  file,
  existingStoragePath,
}) {
  if (!supabase) throw new Error("Supabase is not configured");

  const uploadFile = await compressImageForUpload(file);
  const ext = (uploadFile.name.split(".").pop() || "jpg").toLowerCase();
  const storagePath = `${slug}/${kind}-${slot}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("service-images")
    .upload(storagePath, uploadFile, {
      contentType: uploadFile.type || "image/jpeg",
      upsert: true,
      cacheControl: "31536000",
    });
  if (upErr) throw upErr;

  const {
    data: { publicUrl },
  } = supabase.storage.from("service-images").getPublicUrl(storagePath);

  const { data, error } = await supabase
    .from("service_images")
    .upsert(
      {
        service_id: serviceId,
        kind,
        slot,
        url: publicUrl,
        storage_path: storagePath,
      },
      { onConflict: "service_id,kind,slot" },
    )
    .select()
    .single();
  if (error) throw error;

  if (existingStoragePath && existingStoragePath !== storagePath) {
    await supabase.storage.from("service-images").remove([existingStoragePath]);
  }

  return data;
}

export async function deleteServiceImage(imageRow) {
  if (!supabase) throw new Error("Supabase is not configured");
  if (imageRow?.storage_path) {
    await supabase.storage
      .from("service-images")
      .remove([imageRow.storage_path]);
  }
  const { error } = await supabase
    .from("service_images")
    .delete()
    .eq("id", imageRow.id);
  if (error) throw error;
}
