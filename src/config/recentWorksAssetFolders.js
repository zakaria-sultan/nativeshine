/**
 * Maps route slugs → physical folders under src/assets/ (spaces allowed; Vite resolves via import.meta.glob).
 * Filename pattern: {prefix}{n}.{ext} or {prefix} {n}.{ext} for n = 1…6, ext ∈ png|jpg|jpeg
 */
export const RECENT_WORKS_ASSET_MAP = {
  "front-of-house": {
    folder: "Front of House",
    prefixes: ["Front of House"],
  },
  "back-of-house": {
    folder: "Back of House",
    prefixes: ["Back of House"],
  },
  "kitchen-cleaning": {
    folder: "kitchen",
    prefixes: ["kitchen", "Kitchen", "Kitchen Cleaning"],
  },
  "spa-gymnasium": {
    folder: "Spa & Gymnasium",
    prefixes: ["Spa & Gymnasium"],
  },
  "window-cleaning": {
    folder: "Window Cleaning",
    prefixes: ["Window Cleaning"],
  },
  "carpet-cleaning": {
    folder: "Carpet Cleaning",
    prefixes: ["Carpet Cleaning"],
  },
  "public-pedestrian-areas": {
    folder: "Public & Pedestrian",
    prefixes: ["Public & Pedestrian"],
  },
  "specialist-services": {
    folder: "Specialist Services",
    prefixes: ["Specialist Services"],
  },
};
