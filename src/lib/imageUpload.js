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
