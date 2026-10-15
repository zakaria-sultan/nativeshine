import { supabase } from "../lib/supabase";
import { announceContentChange } from "../hooks/useContentRefresh";
import { compressImageForUpload } from "./imageUpload";

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
    .select("*, service_images(*), service_testimonials(*)")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveService(payload) {
  if (!supabase) throw new Error("Supabase is not configured");
  const title = payload.title?.trim();
  const slug = payload.slug?.trim();
  if (!title || !slug || !/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(slug)) {
    throw new Error("Enter a title and a URL slug containing only letters, numbers and hyphens.");
  }
  const row = {
    title,
    slug,
    content: payload.content ?? "",
    sort_order: payload.sort_order ?? 0,
    is_published: payload.is_published ?? true,
  };
  if (payload.id) {
    let query = supabase.from("services").update(row).eq("id", payload.id);
    if (payload.updated_at) query = query.eq("updated_at", payload.updated_at);
    const { data, error } = await query.select("*, service_images(*), service_testimonials(*)").single();
    if (error) throw error;
    announceContentChange();
    return data;
  }
  const { data, error } = await supabase
    .from("services")
    .insert(row)
    .select("*, service_images(*), service_testimonials(*)")
    .single();
  if (error) throw error;
  announceContentChange();
  return data;
}

// A homepage slide may intentionally reuse a service image URL. Preserve any
// file that still has a database reference after replacing/deleting a service.
async function cleanupServiceFiles(files) {
  const candidates = files.filter(file => file.storage_path && file.url);
  if (!candidates.length) return;
  const urls = candidates.map(file => file.url);
  const [slides, images] = await Promise.all([
    supabase.from("home_slides").select("image_url").in("image_url", urls),
    supabase.from("service_images").select("url").in("url", urls),
  ]);
  if (slides.error || images.error) {
    console.warn("File cleanup postponed: could not verify remaining image references");
    return;
  }
  const referenced = new Set([...slides.data.map(slide => slide.image_url), ...images.data.map(image => image.url)]);
  const paths = candidates.filter(file => !referenced.has(file.url)).map(file => file.storage_path);
  if (paths.length) {
    const { error } = await supabase.storage.from("service-images").remove(paths);
    if (error) console.warn("Content saved; unused image cleanup failed", error);
  }
}

export async function deleteService(id) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: images, error: readError } = await supabase.from("service_images").select("storage_path,url").eq("service_id", id);
  if (readError) throw readError;
  const { error } = await supabase.from("services").delete().eq("id", id).select("id").single();
  if (error) throw error;
  announceContentChange();
  await cleanupServiceFiles(images);
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
  if (error) {
    await supabase.storage.from("service-images").remove([storagePath]);
    throw error;
  }
  announceContentChange();

  if (existingStoragePath && existingStoragePath !== storagePath) {
    await cleanupServiceFiles([{ storage_path: existingStoragePath, url: supabase.storage.from("service-images").getPublicUrl(existingStoragePath).data.publicUrl }]);
  }

  return data;
}

export async function deleteServiceImage(imageRow) {
  if (!supabase) throw new Error("Supabase is not configured");
  // Remove the database reference first: a failed delete must not break a live image.
  const { error } = await supabase.from("service_images").delete().eq("id", imageRow.id).select("id").single();
  if (error) throw error;
  announceContentChange();
  if (imageRow.storage_path) {
    await cleanupServiceFiles([imageRow]);
  }
}

export async function saveServiceTestimonial(payload) {
  if (!supabase) throw new Error("Supabase is not configured");
  const row = {
    service_id: payload.service_id,
    quote_text: payload.quote_text?.trim() ?? "",
    client_name: payload.client_name?.trim() ?? "",
    initials: payload.initials ?? "",
    sort_order: Number(payload.sort_order) || 0,
  };
  if (!row.quote_text || !row.client_name) throw new Error("Quote and client name are required.");
  if (payload.id) {
    let query = supabase.from("service_testimonials").update(row)
      .eq("id", payload.id).eq("service_id", payload.service_id);
    if (payload.updated_at) query = query.eq("updated_at", payload.updated_at);
    const { data, error } = await query.select().single();
    if (error) throw error;
    announceContentChange();
    return data;
  }
  const { data, error } = await supabase
    .from("service_testimonials")
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  announceContentChange();
  return data;
}

export async function deleteServiceTestimonial(row) {
  if (!supabase) throw new Error("Supabase is not configured");
  let query = supabase.from("service_testimonials").delete().eq("id", row.id);
  if (row.updated_at) query = query.eq("updated_at", row.updated_at);
  const { error } = await query.select("id").single();
  if (error) throw error;
  announceContentChange();
}
