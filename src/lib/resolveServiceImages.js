import { urlForSlot } from "./assetImageUrls";
import { RECENT_WORKS_ASSET_MAP } from "../config/recentWorksAssetFolders";

const PUB = "/images/services";

function publicOnly(slug) {
  return {
    imageThumbnail: `${PUB}/${slug}-thumbnail.png`,
    imageHero: `${PUB}/${slug}-hero.png`,
    imageGallery: [1, 2, 3].map(
      (n) => `${PUB}/galleries/${slug}/gallery-${n}.png`,
    ),
  };
}

/**
 * Thumbnail, hero, and first three gallery images from src/assets per RECENT_WORKS_ASSET_MAP
 * (slot 1 = primary marketing shot). Falls back to public/images/services when a slot is missing.
 */
export function getServiceImageSet(slug) {
  const cfg = RECENT_WORKS_ASSET_MAP[slug];
  const pub = publicOnly(slug);
  if (!cfg) {
    return pub;
  }
  const g1 = urlForSlot(cfg.folder, 1, cfg.prefixes);
  const g2 = urlForSlot(cfg.folder, 2, cfg.prefixes);
  const g3 = urlForSlot(cfg.folder, 3, cfg.prefixes);
  return {
    imageThumbnail: g1 ?? pub.imageThumbnail,
    imageHero: g1 ?? pub.imageHero,
    imageGallery: [g1, g2, g3].map((u, i) => u ?? pub.imageGallery[i]),
  };
}

/**
 * Home hero slides (floor / facade copy) use real assets: primary photo from two services.
 */
export function getHomeHeroFromAssets() {
  const floor =
    urlForSlot(
      RECENT_WORKS_ASSET_MAP["carpet-cleaning"].folder,
      1,
      RECENT_WORKS_ASSET_MAP["carpet-cleaning"].prefixes,
    ) ??
    urlForSlot(
      RECENT_WORKS_ASSET_MAP["front-of-house"].folder,
      1,
      RECENT_WORKS_ASSET_MAP["front-of-house"].prefixes,
    );
  const facade =
    urlForSlot(
      RECENT_WORKS_ASSET_MAP["window-cleaning"].folder,
      1,
      RECENT_WORKS_ASSET_MAP["window-cleaning"].prefixes,
    ) ??
    urlForSlot(
      RECENT_WORKS_ASSET_MAP["specialist-services"].folder,
      1,
      RECENT_WORKS_ASSET_MAP["specialist-services"].prefixes,
    );
  return {
    slide1: floor ?? "/images/hero/slide-1.jpg",
    slide2: facade ?? "/images/hero/slide-2.jpg",
  };
}
