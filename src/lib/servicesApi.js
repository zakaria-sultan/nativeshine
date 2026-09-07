/**
 * Map DB rows (+ images) into the shape the public site already expects.
 */

export function mapServiceRow(row, images = []) {
  const byKind = (kind, slot = 1) =>
    images.find((img) => img.kind === kind && img.slot === slot)?.url || null;

  const recentFilled = Array.from({ length: 6 }, (_, i) =>
    byKind("recent", i + 1),
  );
  const recentImages = recentFilled.filter(Boolean);

  const thumbnail =
    byKind("thumbnail", 1) || byKind("hero", 1) || recentImages[0] || "";
  const hero =
    byKind("hero", 1) || byKind("thumbnail", 1) || recentImages[0] || "";

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content || "",
    sort_order: row.sort_order,
    is_published: row.is_published,
    imageThumbnail: thumbnail,
    imageHero: hero,
    imageGallery: recentFilled.slice(0, 3).map((u) => u || ""),
    recentImages,
    image: thumbnail,
    _images: images,
  };
}

export async function fetchServicesFromSupabase(supabase, { includeUnpublished = false } = {}) {
  let query = supabase
    .from("services")
    .select("*, service_images(*)")
    .order("sort_order", { ascending: true });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row) => {
    const images = row.service_images || [];
    const { service_images: _omit, ...rest } = row;
    return mapServiceRow(rest, images);
  });
}

export function slugifyTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
