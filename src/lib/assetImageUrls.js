/**
 * Shared Vite glob + path matching for src/assets (spaces in folder names OK).
 */

const norm = (p) => p.replace(/\\/g, "/");

export const assetUrlByPath = import.meta.glob("../assets/**/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

/**
 * Bundled URL for one numbered file in a folder, or null.
 * Tries {prefix}{n} and {prefix} {n} for png / jpg / jpeg.
 */
export function urlForSlot(folder, slotIndex, prefixes) {
  const bases = [];
  for (const p of prefixes) {
    bases.push(`${p}${slotIndex}`);
    bases.push(`${p} ${slotIndex}`);
  }
  for (const base of bases) {
    for (const ext of ["png", "jpg", "jpeg"]) {
      const tail = `${folder}/${base}.${ext}`;
      const hit = Object.entries(assetUrlByPath).find(([path]) =>
        norm(path).endsWith(tail),
      );
      if (hit) return hit[1];
    }
  }
  return null;
}
