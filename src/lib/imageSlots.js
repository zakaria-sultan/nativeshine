/**
 * Image slot helpers — recent works can grow beyond 6 by using spare
 * hero/thumbnail slots (2–6) without a DB migration.
 */

export const MAX_RECENT_DISPLAY = 16;

/** Ordered pool of (kind, slot) used as “recent works” gallery */
export function recentSlotPool() {
  const pool = [];
  for (let slot = 1; slot <= 6; slot++) {
    pool.push({ kind: "recent", slot });
  }
  // Extra capacity without raising DB check constraint (slot <= 6)
  for (let slot = 2; slot <= 6; slot++) {
    pool.push({ kind: "hero", slot });
  }
  for (let slot = 2; slot <= 6; slot++) {
    pool.push({ kind: "thumbnail", slot });
  }
  return pool;
}

export function isMarketingPrimary(kind, slot) {
  return (kind === "thumbnail" || kind === "hero") && slot === 1;
}

export function findImage(images, kind, slot) {
  return (images || []).find((img) => img.kind === kind && img.slot === slot);
}

/** Next empty gallery slot for “Add image” */
export function nextEmptyRecentSlot(images) {
  for (const cell of recentSlotPool()) {
    if (!findImage(images, cell.kind, cell.slot)) return cell;
  }
  return null;
}

/** All gallery cells that currently have an image, in display order */
export function occupiedRecentSlots(images) {
  return recentSlotPool().filter((cell) =>
    findImage(images, cell.kind, cell.slot),
  );
}

export function recentDisplayIndex(kind, slot) {
  const pool = recentSlotPool();
  const i = pool.findIndex((c) => c.kind === kind && c.slot === slot);
  return i >= 0 ? i + 1 : slot;
}

export function collectRecentUrls(images = []) {
  return recentSlotPool()
    .map((cell) => findImage(images, cell.kind, cell.slot)?.url)
    .filter(Boolean);
}
