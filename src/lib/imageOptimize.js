import imageCompression from "browser-image-compression";

/**
 * Compress images before upload so the live site loads faster.
 */
export async function compressImageForUpload(file) {
  if (!file || !file.type?.startsWith("image/")) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.55,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: 0.82,
    });
    const name = file.name.replace(/\.\w+$/, ".jpg");
    return new File([compressed], name, { type: "image/jpeg" });
  } catch (err) {
    console.warn("Image compression failed, uploading original", err);
    return file;
  }
}

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
