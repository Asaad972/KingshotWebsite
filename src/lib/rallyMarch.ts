/**
 * March time from real coordinates, reverse-engineered by cross-checking
 * against kingshotguide.org's march-sync-timer calculator (a community-
 * tested reference for this same game). Kingshot doesn't publish its
 * internal formula, but that tool's own numbers fit a clean model: a fixed
 * per-tile time coefficient that differs sharply depending on whether the
 * marching city sits in the map's "Forbidden Red Zone" ring around the
 * King's Castle (troops move roughly half as fast there), plus a flat
 * 1-tile equivalent added to distance before dividing (matched multiple
 * (distance, march-speed%, zone) -> observed-seconds readings pulled live
 * from that site to within 0-2s). Still an estimate, not an official
 * formula -- that site itself states +/-1s accuracy.
 */
const ZONE_COEFFICIENTS = {
  normal: 0.36,
  red: 0.185,
} as const;

export type MarchZone = keyof typeof ZONE_COEFFICIENTS;

export interface WorldPoint {
  x: number;
  y: number;
}

export function distanceTiles(a: WorldPoint, b: WorldPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function estimateMarchTimeSeconds(
  distance: number,
  marchSpeedPercent: number,
  zone: MarchZone = 'normal'
): number {
  const coefficient = ZONE_COEFFICIENTS[zone];
  const mult = 1 + marchSpeedPercent / 100;
  const raw = (distance + 1) / (coefficient * mult);
  return Math.max(0, Math.round(raw));
}
