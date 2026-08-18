/** Standard 2:1 isometric ("diamond") projection -- rotates a square (x,y)
 * grid 45 degrees so it renders as the same diamond-shaped kingdom map
 * Kingshot's own screenshots show, with the King's Castle at the center.
 * `tileSize` controls how many screen pixels one grid unit covers. */
export interface WorldPoint {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export function project(point: WorldPoint, origin: WorldPoint, tileSize: number): ScreenPoint {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  return {
    x: (dx - dy) * (tileSize / 2),
    y: (dx + dy) * (tileSize / 2),
  };
}

/** Turret placement is a visual approximation (a few tiles out from the
 * castle along each screen-cardinal direction), not confirmed exact game
 * data -- there's no public source for the real offset, so this is styled
 * to look right rather than measured. */
const TURRET_OFFSET = 3;
export const TURRETS: { label: string; dx: number; dy: number }[] = [
  { label: 'N Turret', dx: -TURRET_OFFSET, dy: -TURRET_OFFSET },
  { label: 'S Turret', dx: TURRET_OFFSET, dy: TURRET_OFFSET },
  { label: 'E Turret', dx: TURRET_OFFSET, dy: -TURRET_OFFSET },
  { label: 'W Turret', dx: -TURRET_OFFSET, dy: TURRET_OFFSET },
];
