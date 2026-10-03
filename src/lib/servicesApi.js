import { collectRecentUrls } from "./imageSlots";
import {
  DEFAULT_TESTIMONIALS,
  mapTestimonialRow,
} from "./testimonials";

/**
 * Map DB rows (+ images + testimonials) into the shape the public site expects.
 */

export function mapServiceRow(row, images = [], testimonials = []) {
  const byKind = (kind, slot = 1) =>
    images.find((img) => img.kind === kind && img.slot === slot)?.url || null;

  const recentImages = collectRecentUrls(images);
  const thumbnail =
    byKind("thumbnail", 1) || byKind("hero", 1) || recentImages[0] || "";
  const hero =
    byKind("hero", 1) || byKind("thumbnail", 1) || recentImages[0] || "";

  const mappedTestimonials = (testimonials || [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(mapTestimonialRow);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content || "",
    sort_order: row.sort_order,
    is_published: row.is_published,
    imageThumbnail: thumbnail,
    imageHero: hero,
    imageGallery: recentImages.slice(0, 3),
    recentImages,
    image: thumbnail,
    testimonials:
      mappedTestimonials.length > 0 ? mappedTestimonials : DEFAULT_TESTIMONIALS,
    _images: images,
    _testimonials: mappedTestimonials,
  };
}

export async function fetchServicesFromSupabase(
  supabase,
  { includeUnpublished = false } = {},
) {
  let query = supabase
    .from("services")
    .select("*, service_images(*), service_testimonials(*)")
    .order("sort_order", { ascending: true });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((row) => {
    const images = row.service_images || [];
    const testimonials = row.service_testimonials || [];
    const {
      service_images: _omitImages,
      service_testimonials: _omitTestimonials,
      ...rest
    } = row;
    return mapServiceRow(rest, images, testimonials);
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
