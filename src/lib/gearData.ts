// Governor Gear Calculator -- ALL NUMBERS BELOW ARE PLACEHOLDERS.
//
// The tier progression (Base -> Green -> Blue -> Purple -> Purple T1 ->
// Gold -> Gold T1 -> Gold T2) matches the real game's structure, but the
// exact material costs and stat bonuses per level are invented so the
// calculator has something consistent to compute with. Edit the numbers
// in `buildGearLevels()` below once you have real values -- the shape of
// the data (6 slots, ordered levels, per-step cost/stat) doesn't need to
// change, just the numbers.

export type GearSlotId = 'cap' | 'watch' | 'coat' | 'pants' | 'belt' | 'weapon';

export const GEAR_SLOTS: { id: GearSlotId; label: string }[] = [
  { id: 'cap', label: 'Cap' },
  { id: 'watch', label: 'Watch' },
  { id: 'coat', label: 'Coat' },
  { id: 'pants', label: 'Pants' },
  { id: 'belt', label: 'Belt' },
  { id: 'weapon', label: 'Weapon' },
];

export type GearTier = 'green' | 'blue' | 'purple' | 'purpleT1' | 'gold' | 'goldT1' | 'goldT2';
export type GearTierOrBase = GearTier | 'base';

export const TIER_META: Record<GearTier, { label: string; text: string; border: string; bg: string; ring: string; dot: string }> = {
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
    text: 'text-amber-200',
    border: 'border-amber-300/50',
    bg: 'bg-amber-300/10',
    ring: 'ring-amber-300/70',
    dot: 'bg-amber-300',
  },
};

export const BASE_META = { label: 'Base', text: 'text-parchment-300', border: 'border-stone-600', bg: 'bg-stone-800', ring: 'ring-stone-400/70', dot: 'bg-stone-500' };

export interface GearLevelCost {
  designId: string;
  designQty: number;
  materialId: string;
  materialQty: number;
  coins: number;
}

export interface GearStatBonus {
  attack: number;
  defense: number;
  lethality: number;
  health: number;
}

export interface GearLevel {
  id: string;
  label: string;
  tier: GearTierOrBase;
  stars: number;
  order: number;
  /** Cost to reach THIS level from the previous one. Zero for 'base'. */
  cost: GearLevelCost;
  /** Incremental % bonus THIS level grants (on top of the previous level). */
  statBonus: GearStatBonus;
}

function materialsForTier(tier: GearTier): { designId: string; materialId: string } {
  if (tier === 'green') return { designId: 'green-design', materialId: 'green-material' };
  if (tier === 'blue') return { designId: 'blue-design', materialId: 'blue-material' };
  if (tier === 'purple' || tier === 'purpleT1') return { designId: 'purple-design', materialId: 'purple-material' };
  return { designId: 'gold-design', materialId: 'gold-material' }; // gold, goldT1, goldT2
}

const TIER_SEQUENCE: { tier: GearTier; steps: number }[] = [
  { tier: 'green', steps: 2 },
  { tier: 'blue', steps: 4 },
  { tier: 'purple', steps: 4 },
  { tier: 'purpleT1', steps: 4 },
  { tier: 'gold', steps: 4 },
  { tier: 'goldT1', steps: 4 },
  { tier: 'goldT2', steps: 4 },
];

function buildGearLevels(): GearLevel[] {
  const levels: GearLevel[] = [
    {
      id: 'base',
      label: 'Base',
      tier: 'base',
      stars: 0,
      order: 0,
      cost: { designId: '', designQty: 0, materialId: '', materialQty: 0, coins: 0 },
      statBonus: { attack: 0, defense: 0, lethality: 0, health: 0 },
    },
  ];

  let order = 1;
  let tierIndex = 0;
  for (const { tier, steps } of TIER_SEQUENCE) {
    const { designId, materialId } = materialsForTier(tier);
    for (let step = 0; step < steps; step++) {
      const stars = step;
      levels.push({
        id: `${tier}-${step}`,
        label: `${TIER_META[tier].label} ${step}${stars > 0 ? ' ' + '★'.repeat(stars) : ''}`,
        tier,
        stars,
        order,
        cost: {
          designId,
          designQty: 2 + tierIndex * 3 + step,
          materialId,
          materialQty: 3 + tierIndex * 4 + step,
          coins: (5 + tierIndex * 5 + step) * 1000,
        },
        statBonus: {
          attack: Math.round((0.1 + tierIndex * 0.05) * 100) / 100,
          defense: Math.round((0.1 + tierIndex * 0.05) * 100) / 100,
          lethality: Math.round((0.05 + tierIndex * 0.03) * 100) / 100,
          health: Math.round((0.1 + tierIndex * 0.05) * 100) / 100,
        },
      });
      order++;
    }
    tierIndex++;
  }

  return levels;
}

export const GEAR_LEVELS: GearLevel[] = buildGearLevels();

export const TIER_DISPLAY_ORDER: GearTierOrBase[] = ['base', 'green', 'blue', 'purple', 'purpleT1', 'gold', 'goldT1', 'goldT2'];

export function getGearLevel(id: string): GearLevel | undefined {
  return GEAR_LEVELS.find((l) => l.id === id);
}

export function tierMeta(tier: GearTierOrBase) {
  return tier === 'base' ? BASE_META : TIER_META[tier];
}

export interface MaterialDef {
  id: string;
  label: string;
  tier: GearTier;
}

export const MATERIALS: MaterialDef[] = [
  { id: 'green-design', label: 'Green Design', tier: 'green' },
  { id: 'green-material', label: 'Green Material', tier: 'green' },
  { id: 'blue-design', label: 'Blue Design', tier: 'blue' },
  { id: 'blue-material', label: 'Blue Material', tier: 'blue' },
  { id: 'purple-design', label: 'Purple Design', tier: 'purple' },
  { id: 'purple-material', label: 'Purple Material', tier: 'purple' },
  { id: 'gold-design', label: 'Gold Design', tier: 'gold' },
  { id: 'gold-material', label: 'Gold Material', tier: 'gold' },
];
