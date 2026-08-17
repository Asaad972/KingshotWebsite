// Troop Training Calculator -- REAL data extracted directly from the source
// of kingshotguide.org/calculator/troops (fetched 2026-08-18), which embeds
// its full tier/cost/time table as a plain JS object in its page bundle.
// buildTime (seconds), power, and event points are identical across all 3
// troop types at a given tier -- only the 4 resource costs differ per troop
// type. Tiers t11/tg4/tg5 exist in that site's data but are excluded from
// its own selectable UI (presumably unreleased in-game), so they're left
// out here too.
//
// Two data points look like likely typos in the source (kept as-is rather
// than "corrected", since this is meant to mirror a trusted live reference
// exactly): T5 Strongest Governor points (72, versus a smooth 4->11 trend
// either side) and T7 Cavalry wood cost (2231, versus a smooth 154->461
// trend either side).

export type TroopType = 'infantry' | 'cavalry' | 'archer';

export const TROOP_TYPE_LABELS: Record<TroopType, string> = {
  infantry: 'Infantry',
  cavalry: 'Cavalry',
  archer: 'Archer',
};

export interface ResourceCost {
  bread: number;
  wood: number;
  stone: number;
  iron: number;
}

export interface TroopTier {
  id: string;
  label: string;
  order: number;
  /** CUMULATIVE seconds to train ONE troop up to this tier from scratch. */
  buildTime: number;
  /** CUMULATIVE power AT this tier. */
  power: number;
  /** CUMULATIVE KvK (Kingdom of Power) event points AT this tier. */
  kvkPoints: number;
  /** CUMULATIVE Strongest Governor event points AT this tier. */
  sgPoints: number;
  cost: Record<TroopType, ResourceCost>;
}

// [tierId, label, buildTimeSeconds, power, kvkPoints, sgPoints]
const TIER_META: [string, string, number, number, number, number][] = [
  ['t1', 'T1', 12, 3, 3, 1],
  ['t2', 'T2', 17, 4, 4, 2],
  ['t3', 'T3', 24, 6, 5, 3],
  ['t4', 'T4', 32, 9, 8, 4],
  ['t5', 'T5', 44, 13, 12, 72],
  ['t6', 'T6', 60, 20, 18, 11],
  ['t7', 'T7', 83, 28, 25, 16],
  ['t8', 'T8', 113, 38, 35, 23],
  ['t9', 'T9', 131, 50, 45, 30],
  ['t10', 'T10', 152, 66, 60, 39],
  ['tg1', 'TG1', 152, 71, 60, 39],
  ['tg2', 'TG2', 152, 76, 60, 39],
  ['tg3', 'TG3', 152, 83, 60, 39],
];

// [tierId, bread, wood, stone, iron]
const INFANTRY_COST: [string, number, number, number, number][] = [
  ['t1', 36, 27, 7, 2],
  ['t2', 58, 44, 10, 3],
  ['t3', 92, 69, 17, 4],
  ['t4', 120, 90, 21, 5],
  ['t5', 156, 117, 27, 6],
  ['t6', 186, 140, 33, 7],
  ['t7', 279, 210, 49, 11],
  ['t8', 558, 419, 98, 21],
  ['t9', 1394, 1046, 244, 51],
  ['t10', 2788, 2091, 488, 102],
  ['tg1', 2788, 2091, 488, 102],
  ['tg2', 2788, 2091, 488, 102],
  ['tg3', 2788, 2091, 488, 102],
];

const CAVALRY_COST: [string, number, number, number, number][] = [
  ['t1', 32, 30, 7, 2],
  ['t2', 51, 48, 10, 3],
  ['t3', 81, 76, 16, 4],
  ['t4', 105, 99, 21, 5],
  ['t5', 136, 129, 27, 7],
  ['t6', 163, 154, 32, 8],
  ['t7', 244, 2231, 48, 11],
  ['t8', 488, 461, 95, 22],
  ['t9', 1220, 1151, 237, 55],
  ['t10', 2440, 2301, 474, 109],
  ['tg1', 2440, 2301, 474, 109],
  ['tg2', 2440, 2301, 474, 109],
  ['tg3', 2440, 2301, 474, 109],
];

const ARCHER_COST: [string, number, number, number, number][] = [
  ['t1', 23, 34, 6, 2],
  ['t2', 36, 54, 9, 4],
  ['t3', 58, 86, 15, 5],
  ['t4', 75, 111, 19, 6],
  ['t5', 97, 144, 24, 8],
  ['t6', 117, 173, 29, 10],
  ['t7', 175, 258, 44, 14],
  ['t8', 349, 516, 87, 28],
  ['t9', 872, 1290, 217, 70],
  ['t10', 1740, 2579, 433, 140],
  ['tg1', 1740, 2579, 433, 140],
  ['tg2', 1740, 2579, 433, 140],
  ['tg3', 1740, 2579, 433, 140],
];

function costMap(rows: [string, number, number, number, number][]): Record<string, ResourceCost> {
  return Object.fromEntries(rows.map(([id, bread, wood, stone, iron]) => [id, { bread, wood, stone, iron }]));
}

const INFANTRY_COST_MAP = costMap(INFANTRY_COST);
const CAVALRY_COST_MAP = costMap(CAVALRY_COST);
const ARCHER_COST_MAP = costMap(ARCHER_COST);

export const TROOP_TIERS: TroopTier[] = TIER_META.map(([id, label, buildTime, power, kvkPoints, sgPoints], i) => ({
  id,
  label,
  order: i + 1,
  buildTime,
  power,
  kvkPoints,
  sgPoints,
  cost: {
    infantry: INFANTRY_COST_MAP[id],
    cavalry: CAVALRY_COST_MAP[id],
    archer: ARCHER_COST_MAP[id],
  },
}));

export function getTroopTier(id: string | undefined): TroopTier | undefined {
  return TROOP_TIERS.find((t) => t.id === id);
}
