// Rally Timer: the 5 clickable towns/castles on the map screenshot.
//
// HOW TO EDIT:
// - `marchTimeSeconds` is the fixed march time (in seconds) from that town to
//   the rally target. Change these to your real values.
// - `hotspot` positions the clickable region as a PERCENTAGE of the map
//   image's width/height (not pixels), so it stays aligned at any screen
//   size. xPercent/yPercent is the top-left corner of the tappable box,
//   widthPercent/heightPercent is its size. These were estimated by eye from
//   the screenshot -- nudge the numbers a few points if a hotspot feels
//   slightly off from its castle icon.
//
// The map image itself must be saved at public/rally/map.png (same
// screenshot used to design these coordinates).

export interface RallyTown {
  id: string;
  marchTimeSeconds: number;
  hotspot: { xPercent: number; yPercent: number; widthPercent: number; heightPercent: number };
}

export const RALLY_TOWNS: RallyTown[] = [
  {
    id: 'town-1',
    marchTimeSeconds: 37,
    hotspot: { xPercent: 22.5, yPercent: 25.5, widthPercent: 18, heightPercent: 11 },
  },
  {
    id: 'town-2',
    marchTimeSeconds: 52,
    hotspot: { xPercent: 31.7, yPercent: 29.8, widthPercent: 18, heightPercent: 11 },
  },
  {
    id: 'town-3',
    marchTimeSeconds: 68,
    hotspot: { xPercent: 46.7, yPercent: 39, widthPercent: 18, heightPercent: 11 },
  },
  {
    id: 'town-4',
    marchTimeSeconds: 85,
    hotspot: { xPercent: 57.2, yPercent: 47.4, widthPercent: 18, heightPercent: 11 },
  },
  {
    id: 'town-5',
    marchTimeSeconds: 104,
    hotspot: { xPercent: 70.2, yPercent: 52.7, widthPercent: 18, heightPercent: 11 },
  },
];

export function getRallyTown(townId: string | null): RallyTown | null {
  if (!townId) return null;
  return RALLY_TOWNS.find((t) => t.id === townId) ?? null;
}
