import { RECENT_WORKS_ASSET_MAP } from "../config/recentWorksAssetFolders";
import { getPublicRecentWorksFallbacks } from "../data/recentWorksByService";
import { urlForSlot } from "./assetImageUrls";

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
