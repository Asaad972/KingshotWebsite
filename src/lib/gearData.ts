// Governor Gear Calculator -- REAL data sourced from
// https://kingshotdata.com/database/governor-gear/ (fetched 2026-08-16).
//
// Per that source: all six Governor Gear pieces (Head, Armor, Legs, Staff,
// Ring, Accessory) use the same costs, power, and score at each level, and
// each level's "ATTRS" value applies identically to Attack AND Defense
// (confirmed from the site's "+X% / +X%" pairs). `attrPercent` below is
// that CUMULATIVE total at a given level (not incremental); material costs
// ARE incremental (cost to go from the previous level to this one).
//
// Piece -> troop-type mapping confirmed directly from in-game screenshots
// (2026-08-16): Cap+Watch -> Cavalry, Coat+Pants -> Infantry, Belt+Staff ->
// Archers. Each piece boosts only its troop type's Attack + Defense (not
// Lethality/Health, and not the other two troop types).

export type GearSlotId = 'cap' | 'watch' | 'coat' | 'pants' | 'belt' | 'staff';
export type TroopType = 'infantry' | 'cavalry' | 'archers';

export const TROOP_LABELS: Record<TroopType, string> = {
  infantry: 'Infantry',
  cavalry: 'Cavalry',
  archers: 'Archers',
};

export const GEAR_SLOTS: { id: GearSlotId; label: string; troopType: TroopType }[] = [
  { id: 'cap', label: 'Cap', troopType: 'cavalry' },
  { id: 'watch', label: 'Watch', troopType: 'cavalry' },
  { id: 'coat', label: 'Coat', troopType: 'infantry' },
  { id: 'pants', label: 'Pants', troopType: 'infantry' },
  { id: 'belt', label: 'Belt', troopType: 'archers' },
  { id: 'staff', label: 'Staff', troopType: 'archers' },
];

export type GearTier =
  | 'green'
  | 'blue'
  | 'purple'
  | 'purpleT1'
  | 'gold'
  | 'goldT1'
  | 'goldT2'
  | 'goldT3'
  | 'red'
  | 'redT1'
  | 'redT2'
  | 'redT3'
  | 'redT4'
  | 'redT5'
  | 'redT6';
export type GearTierOrBase = GearTier | 'base';

interface TierMeta {
  label: string;
  text: string;
  border: string;
  bg: string;
  ring: string;
  dot: string;
}

// Class names are written out in full (not built from template strings)
// because Tailwind's build-time scanner only picks up complete, literal
// class names in the source -- a dynamic `text-${color}-400` would produce
// no CSS at all.
export const TIER_META: Record<GearTier, TierMeta> = {
  green: {
    label: 'Green',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/70',
    dot: 'bg-emerald-500',
  },
  blue: {
    label: 'Blue',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/70',
    dot: 'bg-blue-500',
  },
  purple: {
    label: 'Purple',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    ring: 'ring-purple-500/70',
    dot: 'bg-purple-500',
  },
  purpleT1: {
    label: 'Purple T1',
    text: 'text-purple-300',
    border: 'border-purple-400/50',
    bg: 'bg-purple-400/10',
    ring: 'ring-purple-400/70',
    dot: 'bg-purple-400',
  },
  gold: {
    label: 'Gold',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/70',
    dot: 'bg-amber-500',
  },
  goldT1: {
    label: 'Gold T1',
    text: 'text-amber-300',
    border: 'border-amber-400/50',
    bg: 'bg-amber-400/10',
    ring: 'ring-amber-400/70',
    dot: 'bg-amber-400',
  },
  goldT2: {
    label: 'Gold T2',
    text: 'text-amber-300',
    border: 'border-amber-400/50',
    bg: 'bg-amber-400/10',
    ring: 'ring-amber-400/70',
    dot: 'bg-amber-400',
  },
  goldT3: {
    label: 'Gold T3',
    text: 'text-amber-200',
    border: 'border-amber-300/50',
    bg: 'bg-amber-300/10',
    ring: 'ring-amber-300/70',
    dot: 'bg-amber-300',
  },
  red: {
    label: 'Red',
    text: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/70',
    dot: 'bg-red-500',
  },
  redT1: {
    label: 'Red T1',
    text: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/70',
    dot: 'bg-red-500',
  },
  redT2: {
    label: 'Red T2',
    text: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/70',
    dot: 'bg-red-500',
  },
  redT3: {
    label: 'Red T3',
    text: 'text-red-300',
    border: 'border-red-400/50',
    bg: 'bg-red-400/10',
    ring: 'ring-red-400/70',
    dot: 'bg-red-400',
  },
  redT4: {
    label: 'Red T4',
    text: 'text-red-300',
    border: 'border-red-400/50',
    bg: 'bg-red-400/10',
    ring: 'ring-red-400/70',
    dot: 'bg-red-400',
  },
  redT5: {
    label: 'Red T5',
    text: 'text-red-200',
    border: 'border-red-300/50',
    bg: 'bg-red-300/10',
    ring: 'ring-red-300/70',
    dot: 'bg-red-300',
  },
  redT6: {
    label: 'Red T6',
    text: 'text-red-200',
    border: 'border-red-300/50',
    bg: 'bg-red-300/10',
    ring: 'ring-red-300/70',
    dot: 'bg-red-300',
  },
};

export const BASE_META: TierMeta = {
  label: 'Base',
  text: 'text-parchment-300',
  border: 'border-stone-600',
  bg: 'bg-stone-800',
  ring: 'ring-stone-400/70',
  dot: 'bg-stone-500',
};

export function tierMeta(tier: GearTierOrBase): TierMeta {
  return tier === 'base' ? BASE_META : TIER_META[tier];
}

export const TIER_DISPLAY_ORDER: GearTierOrBase[] = [
  'base',
  'green',
  'blue',
  'purple',
  'purpleT1',
  'gold',
  'goldT1',
  'goldT2',
  'goldT3',
  'red',
  'redT1',
  'redT2',
  'redT3',
  'redT4',
  'redT5',
  'redT6',
];

export interface GearLevel {
  id: string;
  label: string;
  tier: GearTierOrBase;
  stars: number;
  order: number;
  /** Cost to reach THIS level from the previous one. Zero for 'base'. */
  cost: { satin: number; gildedThreads: number; artisansVision: number };
  /** CUMULATIVE total attribute bonus AT this level (real data). */
  attrPercent: number;
  /** CUMULATIVE KvK "Score" stat AT this level (real data, from
   * kingshotdata.com/database/governor-gear -- raising Score by 1 earns
   * 36 KvK event points, per the site's own scoring table). */
  score: number;
}

// [tier, stars, satin, gildedThreads, artisansVision, cumulativeAttrPercent, cumulativeScore]
const RAW_LEVELS: [GearTier, number, number, number, number, number, number][] = [
  ['green', 0, 1500, 15, 0, 9.35, 1125],
  ['green', 1, 3800, 40, 0, 12.75, 3000],
  ['blue', 0, 7000, 70, 0, 17, 6000],
  ['blue', 1, 9700, 95, 0, 21.25, 10500],
  ['blue', 2, 1000, 10, 45, 25.5, 15600],
  ['blue', 3, 1000, 10, 50, 29.75, 21000],
  ['purple', 0, 1500, 15, 60, 34, 24300],
  ['purple', 1, 1500, 15, 70, 36.89, 27500],
  ['purple', 2, 6500, 65, 40, 39.78, 30700],
  ['purple', 3, 8000, 80, 50, 42.67, 34000],
  ['purpleT1', 0, 10000, 95, 60, 45.56, 37400],
  ['purpleT1', 1, 11000, 110, 70, 48.45, 40800],
  ['purpleT1', 2, 13000, 130, 85, 51.34, 44900],
  ['purpleT1', 3, 15000, 160, 100, 54.23, 49000],
  ['gold', 0, 22000, 220, 40, 56.78, 55200],
  ['gold', 1, 23000, 230, 40, 59.33, 61500],
  ['gold', 2, 25000, 250, 45, 61.88, 67800],
  ['gold', 3, 26000, 260, 45, 64.43, 74000],
  ['goldT1', 0, 28000, 280, 45, 66.98, 80200],
  ['goldT1', 1, 30000, 300, 55, 69.53, 86500],
  ['goldT1', 2, 32000, 320, 55, 72.08, 92800],
  ['goldT1', 3, 35000, 340, 55, 74.63, 99000],
  ['goldT2', 0, 38000, 360, 55, 77.18, 105200],
  ['goldT2', 1, 43000, 430, 75, 79.73, 111500],
  ['goldT2', 2, 45000, 460, 80, 82.28, 117800],
  ['goldT2', 3, 48000, 500, 85, 84.83, 124000],
  ['goldT3', 0, 60000, 600, 120, 87.38, 133000],
  ['goldT3', 1, 70000, 700, 140, 89.93, 142000],
  ['goldT3', 2, 80000, 800, 160, 92.48, 151000],
  ['goldT3', 3, 90000, 900, 180, 95, 160000],
  ['red', 0, 108000, 1080, 220, 97.5, 172000],
  ['red', 1, 114000, 1140, 230, 100, 184000],
  ['red', 2, 121000, 1210, 240, 102.5, 196000],
  ['red', 3, 128000, 1280, 250, 105, 208000],
  ['redT1', 0, 154000, 1540, 300, 107.5, 223000],
  ['redT1', 1, 163000, 1630, 320, 110, 238000],
  ['redT1', 2, 173000, 1730, 340, 112.5, 253000],
  ['redT1', 3, 183000, 1830, 360, 115, 268000],
  ['redT2', 0, 220000, 2200, 430, 117.5, 288000],
  ['redT2', 1, 233000, 2330, 460, 120, 308000],
  ['redT2', 2, 247000, 2470, 490, 122.5, 328000],
  ['redT2', 3, 262000, 2620, 520, 125, 348000],
  ['redT3', 0, 288000, 2880, 570, 127.75, 373000],
  ['redT3', 1, 302000, 3020, 600, 130.5, 398000],
  ['redT3', 2, 317000, 3170, 630, 133.25, 423000],
  ['redT3', 3, 333000, 3330, 660, 136, 448000],
  ['redT4', 0, 366000, 3660, 730, 138.75, 478000],
  ['redT4', 1, 384000, 3840, 770, 141.5, 508000],
  ['redT4', 2, 403000, 4030, 810, 144.25, 538000],
  ['redT4', 3, 423000, 4230, 850, 147, 568000],
  ['redT5', 0, 465000, 4650, 940, 150, 603000],
  ['redT5', 1, 479000, 4790, 970, 153, 638000],
  ['redT5', 2, 493000, 4930, 1000, 156, 673000],
  ['redT5', 3, 508000, 5080, 1030, 159, 708000],
  ['redT6', 0, 549000, 5490, 1110, 162, 748000],
  ['redT6', 1, 565000, 5650, 1140, 165, 788000],
  ['redT6', 2, 582000, 5820, 1170, 168, 828000],
];

function buildGearLevels(): GearLevel[] {
  const levels: GearLevel[] = [
    {
      id: 'base',
      label: 'Base',
      tier: 'base',
      stars: 0,
      order: 0,
      cost: { satin: 0, gildedThreads: 0, artisansVision: 0 },
      attrPercent: 0,
      score: 0,
    },
  ];

  RAW_LEVELS.forEach(([tier, stars, satin, gildedThreads, artisansVision, attrPercent, score], i) => {
    levels.push({
      id: `${tier}-${stars}`,
      label: `${TIER_META[tier].label}${stars > 0 ? ' ' + '★'.repeat(stars) : ''}`,
      tier,
      stars,
      order: i + 1,
      cost: { satin, gildedThreads, artisansVision },
      attrPercent,
      score,
    });
  });

  return levels;
}

export const GEAR_LEVELS: GearLevel[] = buildGearLevels();

export function getGearLevel(id: string): GearLevel | undefined {
  return GEAR_LEVELS.find((l) => l.id === id);
}

export interface MaterialDef {
  id: 'satin' | 'gildedThreads' | 'artisansVision';
  label: string;
  /** Real in-game icon (user-provided), already includes its own colored background. */
  icon: string;
}

export const MATERIALS: MaterialDef[] = [
  { id: 'satin', label: 'Satin', icon: '/gear/materials/satin.jpg' },
  { id: 'gildedThreads', label: 'Gilded Threads', icon: '/gear/materials/gilded-threads.jpg' },
  { id: 'artisansVision', label: "Artisan's Vision", icon: '/gear/materials/artisans-vision.jpg' },
];
