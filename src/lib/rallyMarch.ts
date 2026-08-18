/**
 * Approximate march time from real coordinates. Kingshot doesn't publish
 * its march-speed formula, and the community calculator sites that already
 * compute this block automated fetching -- so these constants are fit from
 * real user-submitted (origin, destination, march-speed%, observed time)
 * readings rather than the game's exact internal formula. They're accurate
 * to roughly +/-15-20%, tighter at long range than very short range (a few
 * tiles), and how march-speed% exactly factors in beyond a simple
 * proportional divide is not independently confirmed -- flagged here
 * rather than presented as exact.
 */
const BASE_SECONDS = 7;
const SECONDS_PER_TILE = 2.45;

export interface WorldPoint {
  x: number;
  y: number;
}

export function distanceTiles(a: WorldPoint, b: WorldPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** `marchSpeedPercent` is assumed to divide the whole march time
 * proportionally (e.g. +5% march speed -> time / 1.05) -- a common pattern
 * in this genre, but not verified against real data at multiple speed
 * levels for this specific formula. */
export function estimateMarchTimeSeconds(distance: number, marchSpeedPercent: number): number {
  const raw = BASE_SECONDS + distance * SECONDS_PER_TILE;
  const mult = 1 + marchSpeedPercent / 100;
  return Math.max(0, Math.round(raw / mult));
}
