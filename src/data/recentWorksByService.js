import { servicesData } from "./servicesData";

const BASE = "/images/recent-works";

/**
 * Optional: override public URLs when not using src/assets (short arrays are not cycled for “unique 6” — use only as extra fallback slots).
 */
export const recentWorksByService = {};

function defaultSixPublicPaths(slug) {
  return [1, 2, 3, 4, 5, 6].map(
    (n) => `${BASE}/${slug}/sample-${n}.png`,
  );
}

function thumbnailFallback(slug) {
  const s = servicesData.find((x) => x.slug === slug);
  return s?.imageThumbnail ?? `${BASE}/front-of-house/sample-1.png`;
}

/** Six public-folder URLs (for build-time seeded assets or when src/assets has no matches). */
export function getPublicRecentWorksFallbacks(serviceSlug) {
  const raw = recentWorksByService[serviceSlug];
  const list =
    raw && raw.length > 0 ? [...raw] : defaultSixPublicPaths(serviceSlug);
  const filtered = list.filter(Boolean);
  const fb = thumbnailFallback(serviceSlug);
  if (!filtered.length) {
    return Array.from({ length: 6 }, () => fb);
  }
  return Array.from({ length: 6 }, (_, i) => filtered[i] ?? fb);
}

/**
 * @deprecated Use resolveRecentWorkImages from src/lib/resolveRecentWorkImages.js
 */
export function getRecentWorksImages(serviceSlug) {
  return getPublicRecentWorksFallbacks(serviceSlug);
}
