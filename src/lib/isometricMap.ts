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
    // Negated -- confirmed against a real in-game screenshot that the
    // South Turret (both x and y below the castle's) renders BELOW the
    // castle on screen, not above, so decreasing world x+y must move
    // screenY positive (down), the opposite of the untouched dx+dy sign.
    y: -(dx + dy) * (tileSize / 2),
  };
}

/** Inverse of `project` -- given a screen-space point (relative to the same
 * origin/tileSize), recover the world (x,y) grid coordinate. Used to turn a
 * map click into real coordinates. */
export function unproject(point: ScreenPoint, origin: WorldPoint, tileSize: number): WorldPoint {
  const k = tileSize / 2;
  const dx = (point.x - point.y) / (2 * k);
  const dy = -(point.x + point.y) / (2 * k);
  return { x: origin.x + dx, y: origin.y + dy };
}

/** Confirmed real turret coordinates -- castle 599,599; S Turret 594,594;
 * W Turret 594,604; E Turret 604,594; N Turret 604,604. */
export const TURRET_OFFSET = 5;

// Perimeter order (N -> E -> S -> W), not just a list -- callers connect
// these in sequence to draw the boundary diamond, and N/S or E/W being
// adjacent in the array would draw a line straight through the center
// instead of along an edge.
export const TURRETS: { label: string; dx: number; dy: number }[] = [
  { label: 'N Turret', dx: TURRET_OFFSET, dy: TURRET_OFFSET },
  { label: 'E Turret', dx: TURRET_OFFSET, dy: -TURRET_OFFSET },
  { label: 'S Turret', dx: -TURRET_OFFSET, dy: -TURRET_OFFSET },
  { label: 'W Turret', dx: -TURRET_OFFSET, dy: TURRET_OFFSET },
];

/** Picks a "nice" grid line spacing (1/2/5/10/20/50...) that keeps roughly
 * `targetLines` lines across `range` world units, so the small coordinate
 * grid stays dense enough to be legible whether you're zoomed in on the
 * castle or zoomed out to fit a distant city. */
export function niceGridStep(range: number, targetLines = 18): number {
  const raw = Math.max(1, range / targetLines);
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = [1, 2, 5, 10];
  for (const s of steps) {
    if (raw <= s * magnitude) return s * magnitude;
  }
  return 10 * magnitude;
}
