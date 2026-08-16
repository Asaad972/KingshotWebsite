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
}

// [level, guides, designs, cumulativeTotalPercent]
const RAW_LEVELS: [number, number, number, number][] = [
  [1, 5, 5, 9],
  [2, 40, 15, 12],
  [3, 60, 40, 16],
  [4, 80, 100, 19],
  [5, 100, 200, 25],
  [6, 120, 300, 30],
  [7, 140, 400, 35],
  [8, 200, 400, 40],
  [9, 300, 400, 45],
  [10, 420, 420, 50],
  [11, 560, 420, 55],
  [12, 580, 600, 59],
  [13, 610, 780, 63],
  [14, 645, 960, 67],
  [15, 685, 1140, 71],
  [16, 730, 1320, 75],
  [17, 780, 1500, 79],
  [18, 835, 1680, 83],
  [19, 895, 1860, 87],
  [20, 960, 2040, 91],
  [21, 1030, 2220, 95],
  [22, 1105, 2400, 99],
];

function buildCharmLevels(): CharmLevel[] {
  const levels: CharmLevel[] = [
    { id: 'base', label: 'Base', order: 0, cost: { guides: 0, designs: 0 }, totalPercent: 0 },
  ];
  RAW_LEVELS.forEach(([level, guides, designs, totalPercent], i) => {
    levels.push({
      id: `level-${level}`,
      label: `Level ${level}`,
      order: i + 1,
      cost: { guides, designs },
      totalPercent,
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
  dot: string;
}

export const CHARM_MATERIALS: CharmMaterialDef[] = [
  { id: 'guides', label: 'Charm Guides', dot: 'bg-sky-500' },
  { id: 'designs', label: 'Charm Designs', dot: 'bg-rose-500' },
];
