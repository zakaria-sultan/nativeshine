/**
 * Prefer Supabase image renderer for faster cards/previews when available.
 */
export function optimizedImageUrl(url, { width = 800, quality = 70 } = {}) {
  if (!url || typeof url !== "string") return url;
  try {
    const marker = "/storage/v1/object/public/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const base = url.slice(0, idx);
    const path = url.slice(idx + marker.length);
    return `${base}/storage/v1/render/image/public/${path}?width=${width}&quality=${quality}&resize=contain`;
  } catch {
    return url;
  }
}
