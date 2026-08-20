// PROTOTYPE ONLY -- real in-game screenshots (user-provided) for exactly one
// Governor Gear piece (the Coat, Infantry's chest slot), used to test a new
// step-by-step visual picker before rolling it out to the other 5 pieces.
// Every entry here corresponds 1:1 to a real GearLevel in gearData.ts (id
// `${tier}-${stars}`), confirmed by cross-checking the 58 screenshots the
// user captured against GEAR_LEVELS -- 57 matched exactly; the 58th
// (Red T6 3-star) has no matching entry in the current cost table, so it's
// left out here rather than guessed at.
import type { GearTier } from './gearData';

export type GearColorId = 'green' | 'blue' | 'purple' | 'gold' | 'red';

export const GEAR_COLOR_ORDER: GearColorId[] = ['green', 'blue', 'purple', 'gold', 'red'];

export const GEAR_COLOR_LABEL: Record<GearColorId, string> = {
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
  gold: 'Gold',
  red: 'Red',
};

export interface GearImageEntry {
  color: GearColorId;
  tier: GearTier;
  tierNum: number;
  stars: number;
  image: string;
}

const RAW: { color: GearColorId; tier: GearTier; stars: number; image: string }[] = [
  { color: 'green', tier: 'green', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp' },
  { color: 'green', tier: 'green', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s1.webp' },
  { color: 'blue', tier: 'blue', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s0.webp' },
  { color: 'blue', tier: 'blue', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s1.webp' },
  { color: 'blue', tier: 'blue', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s2.webp' },
  { color: 'blue', tier: 'blue', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_blue_t0_s3.webp' },
  { color: 'purple', tier: 'purple', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s0.webp' },
  { color: 'purple', tier: 'purple', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s1.webp' },
  { color: 'purple', tier: 'purple', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s2.webp' },
  { color: 'purple', tier: 'purple', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t0_s3.webp' },
  { color: 'purple', tier: 'purpleT1', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s0.webp' },
  { color: 'purple', tier: 'purpleT1', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s1.webp' },
  { color: 'purple', tier: 'purpleT1', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s2.webp' },
  { color: 'purple', tier: 'purpleT1', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_purple_t1_s3.webp' },
  { color: 'gold', tier: 'gold', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s0.webp' },
  { color: 'gold', tier: 'gold', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s1.webp' },
  { color: 'gold', tier: 'gold', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s2.webp' },
  { color: 'gold', tier: 'gold', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t0_s3.webp' },
  { color: 'gold', tier: 'goldT1', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s0.webp' },
  { color: 'gold', tier: 'goldT1', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s1.webp' },
  { color: 'gold', tier: 'goldT1', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s2.webp' },
  { color: 'gold', tier: 'goldT1', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t1_s3.webp' },
  { color: 'gold', tier: 'goldT2', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s0.webp' },
  { color: 'gold', tier: 'goldT2', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s1.webp' },
  { color: 'gold', tier: 'goldT2', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s2.webp' },
  { color: 'gold', tier: 'goldT2', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t2_s3.webp' },
  { color: 'gold', tier: 'goldT3', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s0.webp' },
  { color: 'gold', tier: 'goldT3', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s1.webp' },
  { color: 'gold', tier: 'goldT3', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s2.webp' },
  { color: 'gold', tier: 'goldT3', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_gold_t3_s3.webp' },
  { color: 'red', tier: 'red', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s0.webp' },
  { color: 'red', tier: 'red', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s1.webp' },
  { color: 'red', tier: 'red', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s2.webp' },
  { color: 'red', tier: 'red', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t0_s3.webp' },
  { color: 'red', tier: 'redT1', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s0.webp' },
  { color: 'red', tier: 'redT1', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s1.webp' },
  { color: 'red', tier: 'redT1', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s2.webp' },
  { color: 'red', tier: 'redT1', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t1_s3.webp' },
  { color: 'red', tier: 'redT2', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s0.webp' },
  { color: 'red', tier: 'redT2', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s1.webp' },
  { color: 'red', tier: 'redT2', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s2.webp' },
  { color: 'red', tier: 'redT2', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t2_s3.webp' },
  { color: 'red', tier: 'redT3', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s0.webp' },
  { color: 'red', tier: 'redT3', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s1.webp' },
  { color: 'red', tier: 'redT3', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s2.webp' },
  { color: 'red', tier: 'redT3', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t3_s3.webp' },
  { color: 'red', tier: 'redT4', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s0.webp' },
  { color: 'red', tier: 'redT4', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s1.webp' },
  { color: 'red', tier: 'redT4', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s2.webp' },
  { color: 'red', tier: 'redT4', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t4_s3.webp' },
  { color: 'red', tier: 'redT5', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s0.webp' },
  { color: 'red', tier: 'redT5', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s1.webp' },
  { color: 'red', tier: 'redT5', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s2.webp' },
  { color: 'red', tier: 'redT5', stars: 3, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t5_s3.webp' },
  { color: 'red', tier: 'redT6', stars: 0, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s0.webp' },
  { color: 'red', tier: 'redT6', stars: 1, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s1.webp' },
  { color: 'red', tier: 'redT6', stars: 2, image: '/gear/pieces/infantry-1/infantry_gear_1_red_t6_s2.webp' },
];

// tierNum = the position of `tier` within its own color (0-based) --
// derived once here instead of hand-numbered above, so it can't drift out
// of sync with TIER_DISPLAY_ORDER.
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

export const GEAR_IMAGE_ENTRIES: GearImageEntry[] = RAW.map((r) => ({ ...r, tierNum: TIER_NUM_BY_TIER[r.tier] }));

export function tiersForColor(color: GearColorId): { tier: GearTier; tierNum: number }[] {
  const seen = new Map<GearTier, number>();
  for (const e of GEAR_IMAGE_ENTRIES) {
    if (e.color === color) seen.set(e.tier, e.tierNum);
  }
  return Array.from(seen.entries())
    .map(([tier, tierNum]) => ({ tier, tierNum }))
    .sort((a, b) => a.tierNum - b.tierNum);
}

export function starsForTier(tier: GearTier): number[] {
  return GEAR_IMAGE_ENTRIES.filter((e) => e.tier === tier)
    .map((e) => e.stars)
    .sort((a, b) => a - b);
}

export function imageForTierStars(tier: GearTier, stars: number): string | undefined {
  return GEAR_IMAGE_ENTRIES.find((e) => e.tier === tier && e.stars === stars)?.image;
}

export function colorForTier(tier: GearTierOrBaseLike): GearColorId | undefined {
  return GEAR_IMAGE_ENTRIES.find((e) => e.tier === tier)?.color;
}

type GearTierOrBaseLike = GearTier | 'base';
