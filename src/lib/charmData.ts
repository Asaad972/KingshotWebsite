// Governor Charm Calculator -- REAL data sourced from
// https://kingshot.net/database/governor-charm (fetched 2026-08-16).
//
// Each of the 6 Governor Gear pieces has 3 charm slots (18 total). All 22
// charm levels use the same cost/stat progression regardless of slot,
// mirroring how gear itself works. `totalPercent` is CUMULATIVE at a given
// level (not incremental); material costs ARE incremental (cost to go from
// the previous level to this one).
//
// Per the user (2026-08-16): charms boost Health + Lethality for their
// piece's troop type -- the gear-piece counterpart boosts Attack + Defense
// for the same troop type. The source doesn't distinguish what makes a
// piece's 3 charm slots different from each other, so all 3 are treated as
// identical/interchangeable contributors to that troop type's Health &
// Lethality (same simplification already used for gear's Attack/Defense).

import { GEAR_SLOTS, type GearSlotId, type TroopType } from './gearData';

export interface CharmSlot {
  id: string;
  gearSlotId: GearSlotId;
  slotNumber: 1 | 2 | 3;
  label: string;
  troopType: TroopType;
}

export const CHARM_SLOTS: CharmSlot[] = GEAR_SLOTS.flatMap((slot) =>
  ([1, 2, 3] as const).map((n) => ({
    id: `${slot.id}-${n}`,
    gearSlotId: slot.id,
    slotNumber: n,
    label: `Charm ${n}`,
    troopType: slot.troopType,
  }))
);

export interface CharmLevel {
  id: string;
  label: string;
  order: number;
  /** Cost to reach THIS level from the previous one. Zero for 'base'. */
  cost: { guides: number; designs: number };
  /** CUMULATIVE total % bonus AT this level (real data). */
  totalPercent: number;
  /** CUMULATIVE KvK "Score" stat AT this level (real data, from
   * kingshotdata.com/database/governor-charm -- raising Score by 1 earns
   * 70 KvK event points, per the site's own scoring table). */
  score: number;
}

// [level, guides, designs, cumulativeTotalPercent, cumulativeScore]
// Score sourced 2026-08-17 from kingshotdata.com/database/governor-charm,
// which currently lists a 21-level cap. Level 22 was already present in
// this file's cost/percent data (pre-dating that source check) but the
// live site no longer shows it, so its score is EXTRAPOLATED (not
// confirmed) by continuing the site's own delta pattern, which increases
// by a clean +3,000 per level across levels 17-21 (33k/36k/39k/42k/45k).
const RAW_LEVELS: [number, number, number, number, number][] = [
  [1, 5, 5, 9, 625],
  [2, 40, 15, 12, 1875],
  [3, 60, 40, 16, 5000],
  [4, 80, 100, 19, 13800],
  [5, 100, 200, 25, 25000],
  [6, 120, 300, 30, 37500],
  [7, 140, 400, 35, 50000],
  [8, 200, 400, 40, 63000],
  [9, 300, 400, 45, 77000],
  [10, 420, 420, 50, 92000],
  [11, 560, 420, 55, 108000],
  [12, 580, 600, 59, 126000],
  [13, 610, 780, 63, 147000],
  [14, 645, 960, 67, 171000],
  [15, 685, 1140, 71, 198000],
  [16, 730, 1320, 75, 228000],
  [17, 780, 1500, 79, 261000],
  [18, 835, 1680, 83, 297000],
  [19, 895, 1860, 87, 336000],
  [20, 960, 2040, 91, 378000],
  [21, 1030, 2220, 95, 423000],
  [22, 1105, 2400, 99, 471000], // extrapolated -- see comment above
];

function buildCharmLevels(): CharmLevel[] {
  const levels: CharmLevel[] = [
    { id: 'base', label: 'Base', order: 0, cost: { guides: 0, designs: 0 }, totalPercent: 0, score: 0 },
  ];
  RAW_LEVELS.forEach(([level, guides, designs, totalPercent, score], i) => {
    levels.push({
      id: `level-${level}`,
      label: `Level ${level}`,
      order: i + 1,
      cost: { guides, designs },
      totalPercent,
      score,
    });
  });
  return levels;
}

export const CHARM_LEVELS: CharmLevel[] = buildCharmLevels();

export function getCharmLevel(id: string): CharmLevel | undefined {
  return CHARM_LEVELS.find((l) => l.id === id);
}

export interface CharmMaterialDef {
  id: 'guides' | 'designs';
  label: string;
  /** Real in-game icon (user-provided), already includes its own colored background. */
  icon: string;
}

export const CHARM_MATERIALS: CharmMaterialDef[] = [
  { id: 'guides', label: 'Charm Guides', icon: '/charm/materials/guide.png' },
  { id: 'designs', label: 'Charm Designs', icon: '/charm/materials/design.png' },
];
