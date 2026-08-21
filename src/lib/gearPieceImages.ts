// The Color -> Stage -> Stars structure below is driven by real data --
// gearData.ts's own comment confirms all six Governor Gear pieces share the
// exact same costs/tiers/stars at each level, so GEAR_LEVELS (scraped once,
// real) is a valid source of truth for every slot, not just the one we
// happen to have photos for. The actual PHOTOS are separate and optional
// per slot: only Coat has real user-provided screenshots (infantry_gear_1_*)
// right now -- other slots fall back to a themed placeholder tile (see
// GearTierPlaceholder) until their own screenshots arrive, at which point
// they get their own entry in SLOT_IMAGES below, same pattern as Coat's.
import { GEAR_LEVELS, type GearSlotId, type GearTier } from './gearData';

export type GearColorId = 'green' | 'blue' | 'purple' | 'gold' | 'red';

export const GEAR_COLOR_ORDER: GearColorId[] = ['green', 'blue', 'purple', 'gold', 'red'];

export const GEAR_COLOR_LABEL: Record<GearColorId, string> = {
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
  gold: 'Gold',
  red: 'Red',
};

const COLOR_BY_TIER: Record<GearTier, GearColorId> = {
  green: 'green',
  blue: 'blue',
  purple: 'purple',
  purpleT1: 'purple',
  gold: 'gold',
  goldT1: 'gold',
  goldT2: 'gold',
  goldT3: 'gold',
  red: 'red',
  redT1: 'red',
  redT2: 'red',
  redT3: 'red',
  redT4: 'red',
  redT5: 'red',
  redT6: 'red',
};

// tierNum = the position of `tier` within its own color (0-based).
const TIER_NUM_BY_TIER: Record<GearTier, number> = {
  green: 0,
  blue: 0,
  purple: 0,
  purpleT1: 1,
  gold: 0,
  goldT1: 1,
  goldT2: 2,
  goldT3: 3,
  red: 0,
  redT1: 1,
  redT2: 2,
  redT3: 3,
  redT4: 4,
  redT5: 5,
  redT6: 6,
};

interface TierStarCombo {
  tier: GearTier;
  tierNum: number;
  color: GearColorId;
  stars: number;
}

// Every real (tier, stars) combo that exists in the actual cost table,
// regardless of which slot -- this is what makes "only show stages/stars
// that actually exist" true for every piece, not just Coat.
const ALL_COMBOS: TierStarCombo[] = GEAR_LEVELS.filter((l) => l.tier !== 'base').map((l) => {
  const tier = l.tier as GearTier;
  return { tier, tierNum: TIER_NUM_BY_TIER[tier], color: COLOR_BY_TIER[tier], stars: l.stars };
});

export function tiersForColor(color: GearColorId): { tier: GearTier; tierNum: number }[] {
  const seen = new Map<GearTier, number>();
  for (const c of ALL_COMBOS) {
    if (c.color === color) seen.set(c.tier, c.tierNum);
  }
  return Array.from(seen.entries())
    .map(([tier, tierNum]) => ({ tier, tierNum }))
    .sort((a, b) => a.tierNum - b.tierNum);
}

export function starsForTier(tier: GearTier): number[] {
  return ALL_COMBOS.filter((c) => c.tier === tier)
    .map((c) => c.stars)
    .sort((a, b) => a - b);
}

export function colorForTier(tier: GearTier | 'base'): GearColorId | undefined {
  return tier === 'base' ? undefined : COLOR_BY_TIER[tier];
}

// Real in-game screenshots (user-provided). Every entry here corresponds
// 1:1 to a real GearLevel in gearData.ts, confirmed by cross-checking each
// screenshot set against GEAR_LEVELS -- "Red T6 3-star" has no matching
// cost-table entry in any set, so it's left out rather than guessed at.
// Cap/Watch (cavalry) have no photos yet -- GearTierThumb falls back to a
// themed placeholder for any slot/combo not listed below.
const SLOT_IMAGES: Partial<Record<GearSlotId, Partial<Record<string, string>>>> = {
  coat: {
    'green-0': '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp',
    'green-1': '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s1.webp',
    'blue-0': '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s0.webp',
    'blue-1': '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s1.webp',
    'blue-2': '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s2.webp',
    'blue-3': '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s3.webp',
    'purple-0': '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s0.webp',
    'purple-1': '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s1.webp',
    'purple-2': '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s2.webp',
    'purple-3': '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s3.webp',
    'purpleT1-0': '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s0.webp',
    'purpleT1-1': '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s1.webp',
    'purpleT1-2': '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s2.webp',
    'purpleT1-3': '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s3.webp',
    'gold-0': '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s0.webp',
    'gold-1': '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s1.webp',
    'gold-2': '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s2.webp',
    'gold-3': '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s3.webp',
    'goldT1-0': '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s0.webp',
    'goldT1-1': '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s1.webp',
    'goldT1-2': '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s2.webp',
    'goldT1-3': '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s3.webp',
    'goldT2-0': '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s0.webp',
    'goldT2-1': '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s1.webp',
    'goldT2-2': '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s2.webp',
    'goldT2-3': '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s3.webp',
    'goldT3-0': '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s0.webp',
    'goldT3-1': '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s1.webp',
    'goldT3-2': '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s2.webp',
    'goldT3-3': '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s3.webp',
    'red-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s0.webp',
    'red-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s1.webp',
    'red-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s2.webp',
    'red-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s3.webp',
    'redT1-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s0.webp',
    'redT1-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s1.webp',
    'redT1-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s2.webp',
    'redT1-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s3.webp',
    'redT2-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s0.webp',
    'redT2-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s1.webp',
    'redT2-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s2.webp',
    'redT2-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s3.webp',
    'redT3-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s0.webp',
    'redT3-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s1.webp',
    'redT3-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s2.webp',
    'redT3-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s3.webp',
    'redT4-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s0.webp',
    'redT4-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s1.webp',
    'redT4-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s2.webp',
    'redT4-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s3.webp',
    'redT5-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s0.webp',
    'redT5-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s1.webp',
    'redT5-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s2.webp',
    'redT5-3': '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s3.webp',
    'redT6-0': '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s0.webp',
    'redT6-1': '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s1.webp',
    'redT6-2': '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s2.webp',
  },
  pants: {
    'blue-0': '/gear/pieces/infantry-2/infantry_gear_2_blue_t0_s0.webp',
    'blue-1': '/gear/pieces/infantry-2/infantry_gear_2_blue_t0_s1.webp',
    'blue-2': '/gear/pieces/infantry-2/infantry_gear_2_blue_t0_s2.webp',
    'blue-3': '/gear/pieces/infantry-2/infantry_gear_2_blue_t0_s3.webp',
    'gold-0': '/gear/pieces/infantry-2/infantry_gear_2_gold_t0_s0.webp',
    'gold-1': '/gear/pieces/infantry-2/infantry_gear_2_gold_t0_s1.webp',
    'gold-2': '/gear/pieces/infantry-2/infantry_gear_2_gold_t0_s2.webp',
    'gold-3': '/gear/pieces/infantry-2/infantry_gear_2_gold_t0_s3.webp',
    'goldT1-0': '/gear/pieces/infantry-2/infantry_gear_2_gold_t1_s0.webp',
    'goldT1-1': '/gear/pieces/infantry-2/infantry_gear_2_gold_t1_s1.webp',
    'goldT1-2': '/gear/pieces/infantry-2/infantry_gear_2_gold_t1_s2.webp',
    'goldT1-3': '/gear/pieces/infantry-2/infantry_gear_2_gold_t1_s3.webp',
    'goldT2-0': '/gear/pieces/infantry-2/infantry_gear_2_gold_t2_s0.webp',
    'goldT2-1': '/gear/pieces/infantry-2/infantry_gear_2_gold_t2_s1.webp',
    'goldT2-2': '/gear/pieces/infantry-2/infantry_gear_2_gold_t2_s2.webp',
    'goldT2-3': '/gear/pieces/infantry-2/infantry_gear_2_gold_t2_s3.webp',
    'goldT3-0': '/gear/pieces/infantry-2/infantry_gear_2_gold_t3_s0.webp',
    'goldT3-1': '/gear/pieces/infantry-2/infantry_gear_2_gold_t3_s1.webp',
    'goldT3-2': '/gear/pieces/infantry-2/infantry_gear_2_gold_t3_s2.webp',
    'goldT3-3': '/gear/pieces/infantry-2/infantry_gear_2_gold_t3_s3.webp',
    'green-0': '/gear/pieces/infantry-2/infantry_gear_2_green_t0_s0.webp',
    'green-1': '/gear/pieces/infantry-2/infantry_gear_2_green_t0_s1.webp',
    'purple-0': '/gear/pieces/infantry-2/infantry_gear_2_purple_t0_s0.webp',
    'purple-1': '/gear/pieces/infantry-2/infantry_gear_2_purple_t0_s1.webp',
    'purple-2': '/gear/pieces/infantry-2/infantry_gear_2_purple_t0_s2.webp',
    'purple-3': '/gear/pieces/infantry-2/infantry_gear_2_purple_t0_s3.webp',
    'purpleT1-0': '/gear/pieces/infantry-2/infantry_gear_2_purple_t1_s0.webp',
    'purpleT1-1': '/gear/pieces/infantry-2/infantry_gear_2_purple_t1_s1.webp',
    'purpleT1-2': '/gear/pieces/infantry-2/infantry_gear_2_purple_t1_s2.webp',
    'purpleT1-3': '/gear/pieces/infantry-2/infantry_gear_2_purple_t1_s3.webp',
    'red-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t0_s0.webp',
    'red-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t0_s1.webp',
    'red-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t0_s2.webp',
    'red-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t0_s3.webp',
    'redT1-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t1_s0.webp',
    'redT1-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t1_s1.webp',
    'redT1-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t1_s2.webp',
    'redT1-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t1_s3.webp',
    'redT2-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t2_s0.webp',
    'redT2-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t2_s1.webp',
    'redT2-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t2_s2.webp',
    'redT2-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t2_s3.webp',
    'redT3-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t3_s0.webp',
    'redT3-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t3_s1.webp',
    'redT3-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t3_s2.webp',
    'redT3-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t3_s3.webp',
    'redT4-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t4_s0.webp',
    'redT4-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t4_s1.webp',
    'redT4-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t4_s2.webp',
    'redT4-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t4_s3.webp',
    'redT5-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t5_s0.webp',
    'redT5-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t5_s1.webp',
    'redT5-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t5_s2.webp',
    'redT5-3': '/gear/pieces/infantry-2/infantry_gear_2_red_t5_s3.webp',
    'redT6-0': '/gear/pieces/infantry-2/infantry_gear_2_red_t6_s0.webp',
    'redT6-1': '/gear/pieces/infantry-2/infantry_gear_2_red_t6_s1.webp',
    'redT6-2': '/gear/pieces/infantry-2/infantry_gear_2_red_t6_s2.webp',
  },
  // Belt's photo set is missing a few combos (Purple T1 1-star, Gold T2
  // 1-3 star, all of Gold T3) -- those specific cells fall back to the
  // placeholder tile same as any other unphotographed combo, everything
  // else here is real.
  belt: {
    'blue-0': '/gear/pieces/archery-1/archery_gear_1_blue_t0_s0.webp',
    'blue-1': '/gear/pieces/archery-1/archery_gear_1_blue_t0_s1.webp',
    'blue-2': '/gear/pieces/archery-1/archery_gear_1_blue_t0_s2.webp',
    'blue-3': '/gear/pieces/archery-1/archery_gear_1_blue_t0_s3.webp',
    'gold-0': '/gear/pieces/archery-1/archery_gear_1_gold_t0_s0.webp',
    'gold-1': '/gear/pieces/archery-1/archery_gear_1_gold_t0_s1.webp',
    'gold-2': '/gear/pieces/archery-1/archery_gear_1_gold_t0_s2.webp',
    'gold-3': '/gear/pieces/archery-1/archery_gear_1_gold_t0_s3.webp',
    'goldT1-0': '/gear/pieces/archery-1/archery_gear_1_gold_t1_s0.webp',
    'goldT1-1': '/gear/pieces/archery-1/archery_gear_1_gold_t1_s1.webp',
    'goldT1-2': '/gear/pieces/archery-1/archery_gear_1_gold_t1_s2.webp',
    'goldT1-3': '/gear/pieces/archery-1/archery_gear_1_gold_t1_s3.webp',
    'goldT2-0': '/gear/pieces/archery-1/archery_gear_1_gold_t2_s0.webp',
    'green-0': '/gear/pieces/archery-1/archery_gear_1_green_t0_s0.webp',
    'green-1': '/gear/pieces/archery-1/archery_gear_1_green_t0_s1.webp',
    'purple-0': '/gear/pieces/archery-1/archery_gear_1_purple_t0_s0.webp',
    'purple-1': '/gear/pieces/archery-1/archery_gear_1_purple_t0_s1.webp',
    'purple-2': '/gear/pieces/archery-1/archery_gear_1_purple_t0_s2.webp',
    'purple-3': '/gear/pieces/archery-1/archery_gear_1_purple_t0_s3.webp',
    'purpleT1-0': '/gear/pieces/archery-1/archery_gear_1_purple_t1_s0.webp',
    'purpleT1-2': '/gear/pieces/archery-1/archery_gear_1_purple_t1_s2.webp',
    'purpleT1-3': '/gear/pieces/archery-1/archery_gear_1_purple_t1_s3.webp',
    'red-0': '/gear/pieces/archery-1/archery_gear_1_red_t0_s0.webp',
    'red-1': '/gear/pieces/archery-1/archery_gear_1_red_t0_s1.webp',
    'red-2': '/gear/pieces/archery-1/archery_gear_1_red_t0_s2.webp',
    'red-3': '/gear/pieces/archery-1/archery_gear_1_red_t0_s3.webp',
    'redT1-0': '/gear/pieces/archery-1/archery_gear_1_red_t1_s0.webp',
    'redT1-1': '/gear/pieces/archery-1/archery_gear_1_red_t1_s1.webp',
    'redT1-2': '/gear/pieces/archery-1/archery_gear_1_red_t1_s2.webp',
    'redT1-3': '/gear/pieces/archery-1/archery_gear_1_red_t1_s3.webp',
    'redT2-0': '/gear/pieces/archery-1/archery_gear_1_red_t2_s0.webp',
    'redT2-1': '/gear/pieces/archery-1/archery_gear_1_red_t2_s1.webp',
    'redT2-2': '/gear/pieces/archery-1/archery_gear_1_red_t2_s2.webp',
    'redT2-3': '/gear/pieces/archery-1/archery_gear_1_red_t2_s3.webp',
    'redT3-0': '/gear/pieces/archery-1/archery_gear_1_red_t3_s0.webp',
    'redT3-1': '/gear/pieces/archery-1/archery_gear_1_red_t3_s1.webp',
    'redT3-2': '/gear/pieces/archery-1/archery_gear_1_red_t3_s2.webp',
    'redT3-3': '/gear/pieces/archery-1/archery_gear_1_red_t3_s3.webp',
    'redT4-0': '/gear/pieces/archery-1/archery_gear_1_red_t4_s0.webp',
    'redT4-1': '/gear/pieces/archery-1/archery_gear_1_red_t4_s1.webp',
    'redT4-2': '/gear/pieces/archery-1/archery_gear_1_red_t4_s2.webp',
    'redT4-3': '/gear/pieces/archery-1/archery_gear_1_red_t4_s3.webp',
    'redT5-0': '/gear/pieces/archery-1/archery_gear_1_red_t5_s0.webp',
    'redT5-1': '/gear/pieces/archery-1/archery_gear_1_red_t5_s1.webp',
    'redT5-2': '/gear/pieces/archery-1/archery_gear_1_red_t5_s2.webp',
    'redT5-3': '/gear/pieces/archery-1/archery_gear_1_red_t5_s3.webp',
    'redT6-0': '/gear/pieces/archery-1/archery_gear_1_red_t6_s0.webp',
    'redT6-1': '/gear/pieces/archery-1/archery_gear_1_red_t6_s1.webp',
    'redT6-2': '/gear/pieces/archery-1/archery_gear_1_red_t6_s2.webp',
  },
  staff: {
    'blue-0': '/gear/pieces/archery-2/archery_gear_2_blue_t0_s0.webp',
    'blue-1': '/gear/pieces/archery-2/archery_gear_2_blue_t0_s1.webp',
    'blue-2': '/gear/pieces/archery-2/archery_gear_2_blue_t0_s2.webp',
    'blue-3': '/gear/pieces/archery-2/archery_gear_2_blue_t0_s3.webp',
    'gold-0': '/gear/pieces/archery-2/archery_gear_2_gold_t0_s0.webp',
    'gold-1': '/gear/pieces/archery-2/archery_gear_2_gold_t0_s1.webp',
    'gold-2': '/gear/pieces/archery-2/archery_gear_2_gold_t0_s2.webp',
    'gold-3': '/gear/pieces/archery-2/archery_gear_2_gold_t0_s3.webp',
    'goldT1-0': '/gear/pieces/archery-2/archery_gear_2_gold_t1_s0.webp',
    'goldT1-1': '/gear/pieces/archery-2/archery_gear_2_gold_t1_s1.webp',
    'goldT1-2': '/gear/pieces/archery-2/archery_gear_2_gold_t1_s2.webp',
    'goldT1-3': '/gear/pieces/archery-2/archery_gear_2_gold_t1_s3.webp',
    'goldT2-0': '/gear/pieces/archery-2/archery_gear_2_gold_t2_s0.webp',
    'goldT2-1': '/gear/pieces/archery-2/archery_gear_2_gold_t2_s1.webp',
    'goldT2-2': '/gear/pieces/archery-2/archery_gear_2_gold_t2_s2.webp',
    'goldT2-3': '/gear/pieces/archery-2/archery_gear_2_gold_t2_s3.webp',
    'goldT3-0': '/gear/pieces/archery-2/archery_gear_2_gold_t3_s0.webp',
    'goldT3-1': '/gear/pieces/archery-2/archery_gear_2_gold_t3_s1.webp',
    'goldT3-2': '/gear/pieces/archery-2/archery_gear_2_gold_t3_s2.webp',
    'goldT3-3': '/gear/pieces/archery-2/archery_gear_2_gold_t3_s3.webp',
    'green-0': '/gear/pieces/archery-2/archery_gear_2_green_t0_s0.webp',
    'green-1': '/gear/pieces/archery-2/archery_gear_2_green_t0_s1.webp',
    'purple-0': '/gear/pieces/archery-2/archery_gear_2_purple_t0_s0.webp',
    'purple-1': '/gear/pieces/archery-2/archery_gear_2_purple_t0_s1.webp',
    'purple-2': '/gear/pieces/archery-2/archery_gear_2_purple_t0_s2.webp',
    'purple-3': '/gear/pieces/archery-2/archery_gear_2_purple_t0_s3.webp',
    'purpleT1-0': '/gear/pieces/archery-2/archery_gear_2_purple_t1_s0.webp',
    'purpleT1-1': '/gear/pieces/archery-2/archery_gear_2_purple_t1_s1.webp',
    'purpleT1-2': '/gear/pieces/archery-2/archery_gear_2_purple_t1_s2.webp',
    'purpleT1-3': '/gear/pieces/archery-2/archery_gear_2_purple_t1_s3.webp',
    'red-0': '/gear/pieces/archery-2/archery_gear_2_red_t0_s0.webp',
    'red-1': '/gear/pieces/archery-2/archery_gear_2_red_t0_s1.webp',
    'red-2': '/gear/pieces/archery-2/archery_gear_2_red_t0_s2.webp',
    'red-3': '/gear/pieces/archery-2/archery_gear_2_red_t0_s3.webp',
    'redT1-0': '/gear/pieces/archery-2/archery_gear_2_red_t1_s0.webp',
    'redT1-1': '/gear/pieces/archery-2/archery_gear_2_red_t1_s1.webp',
    'redT1-2': '/gear/pieces/archery-2/archery_gear_2_red_t1_s2.webp',
    'redT1-3': '/gear/pieces/archery-2/archery_gear_2_red_t1_s3.webp',
    'redT2-0': '/gear/pieces/archery-2/archery_gear_2_red_t2_s0.webp',
    'redT2-1': '/gear/pieces/archery-2/archery_gear_2_red_t2_s1.webp',
    'redT2-2': '/gear/pieces/archery-2/archery_gear_2_red_t2_s2.webp',
    'redT2-3': '/gear/pieces/archery-2/archery_gear_2_red_t2_s3.webp',
    'redT3-0': '/gear/pieces/archery-2/archery_gear_2_red_t3_s0.webp',
    'redT3-1': '/gear/pieces/archery-2/archery_gear_2_red_t3_s1.webp',
    'redT3-2': '/gear/pieces/archery-2/archery_gear_2_red_t3_s2.webp',
    'redT3-3': '/gear/pieces/archery-2/archery_gear_2_red_t3_s3.webp',
    'redT4-0': '/gear/pieces/archery-2/archery_gear_2_red_t4_s0.webp',
    'redT4-1': '/gear/pieces/archery-2/archery_gear_2_red_t4_s1.webp',
    'redT4-2': '/gear/pieces/archery-2/archery_gear_2_red_t4_s2.webp',
    'redT4-3': '/gear/pieces/archery-2/archery_gear_2_red_t4_s3.webp',
    'redT5-0': '/gear/pieces/archery-2/archery_gear_2_red_t5_s0.webp',
    'redT5-1': '/gear/pieces/archery-2/archery_gear_2_red_t5_s1.webp',
    'redT5-2': '/gear/pieces/archery-2/archery_gear_2_red_t5_s2.webp',
    'redT5-3': '/gear/pieces/archery-2/archery_gear_2_red_t5_s3.webp',
    'redT6-0': '/gear/pieces/archery-2/archery_gear_2_red_t6_s0.webp',
    'redT6-1': '/gear/pieces/archery-2/archery_gear_2_red_t6_s1.webp',
    'redT6-2': '/gear/pieces/archery-2/archery_gear_2_red_t6_s2.webp',
  },
};

export function imageForSlotTierStars(slotId: GearSlotId, tier: GearTier, stars: number): string | undefined {
  return SLOT_IMAGES[slotId]?.[`${tier}-${stars}`];
}

/** Whether this slot has any real photos at all -- used to decide whether
 * the combined Stage+Stars picker grid (fewer taps, but a busier per-color
 * screen) is worth it yet, vs. the original 3-step flow for pieces that
 * are still all placeholder tiles. */
export function hasRealPhotos(slotId: GearSlotId): boolean {
  return Object.keys(SLOT_IMAGES[slotId] ?? {}).length > 0;
}
