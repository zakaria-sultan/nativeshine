import { RECENT_WORKS_ASSET_MAP } from "../config/recentWorksAssetFolders";
import { getPublicRecentWorksFallbacks } from "../data/recentWorksByService";

const norm = (p) => p.replace(/\\/g, "/");

/** Eager URL map for every image under src/assets (png/jpg/jpeg). */
const assetUrlByPath = import.meta.glob("../assets/**/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

/**
 * Find bundled URL for one slot (1–6), trying prefix{n} and prefix {n} × each extension.
 */
function urlForSlot(folder, slotIndex, prefixes) {
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

/**
 * Six image URLs for Recent Works: unique src/assets files when present, else public fallbacks (no unwanted cycling of the same 3 files when 6 exist).
 */
export function resolveRecentWorkImages(serviceSlug) {
  const cfg = RECENT_WORKS_ASSET_MAP[serviceSlug];
  const publicList = getPublicRecentWorksFallbacks(serviceSlug);

  if (!cfg) {
    return publicList;
  }

  const fromSrc = [];
  for (let i = 1; i <= 6; i++) {
    fromSrc.push(urlForSlot(cfg.folder, i, cfg.prefixes));
  }

  if (!fromSrc.some(Boolean)) {
    return publicList;
  }

  return Array.from(
    { length: 6 },
    (_, i) => fromSrc[i] ?? publicList[i],
  );
}
