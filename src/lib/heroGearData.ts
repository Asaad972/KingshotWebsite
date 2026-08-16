// Hero Gear Calculator -- REAL data reverse-engineered from kingshotstat.com's
// live "Hero Gear & Weapons" calculator (2026-08-16), cross-verified against
// kingshotdata.com's Hero Gear Enhancement Chart / Mastery Forging pages and
// a community Google Sheet ("Hero Gear Calculator") the user linked. Every
// number below was confirmed by setting values on the live calculator and
// reading the resulting material/stat totals -- not guessed.
//
// Per the user (2026-08-16): skip the hero's own star/tier system entirely
// ("Current/Target Star Level" in the reference UI) -- that's a hero-level
// mechanic, not gear. This file only covers the gear pieces themselves.
//
// Each of the 4 armor pieces (Helm, Chestplate, Gloves, Boots) has TWO
// independent progression axes:
//   - Level (0-200): raw enhancement level. Costs Hero Gear XP, and (every
//     20ish levels from 101+) Mithril + Mythic Gear pieces as material.
//     Grants a smooth, piecewise-linear % bonus to ONE "primary stat" that
//     differs per piece (see ARMOR_PRIMARY_STAT).
//   - Mastery (0-20): a separate multiplier system, costs Forgehammers (and,
//     past mastery 10, Mythic Gear pieces). Multiplies the piece's primary
//     stat total by 1.0-3.0x (confirmed: level 200 + mastery 20 gave exactly
//     3x the level-200-alone bonus).
// On top of that smooth curve, each piece also has 5 fixed "threshold"
// bonuses that unlock once its Level crosses 120/140/160/180/200 -- these
// are flat, one-time, and NOT affected by Mastery (confirmed via testing).
//
// Per the user (2026-08-16): the Weapon piece is not tracked at all -- only
// the 4 armor pieces (Helm, Chestplate, Gloves, Boots).
//
// There is no per-piece troop-type mapping like Governor Gear has: hero
// gear's troop type depends on which hero equips it, and per the user we
// are not modeling hero selection -- instead the UI keeps one independent
// gear plan per troop type (Infantry/Cavalry/Archers), so stat bonuses are
// computed and shown separately for each.

// One gear plan per troop type -- since we aren't tracking specific hero
// names/stars, Infantry/Cavalry/Archers act as 3 independent "slots" for
// whichever hero of that type you're gearing up. Duplicated (not imported
// from gearData.ts) so this feature stays independently removable.
export type TroopType = 'infantry' | 'cavalry' | 'archers';
export const TROOP_LABELS: Record<TroopType, string> = {
  infantry: 'Infantry',
  cavalry: 'Cavalry',
  archers: 'Archers',
};

export type ArmorSlotId = 'helm' | 'chestplate' | 'gloves' | 'boots';

// Order matches the in-game layout (Helm/Gloves on top, Chestplate/Boots below).
export const ARMOR_SLOTS: { id: ArmorSlotId; label: string; icon: string }[] = [
  { id: 'helm', label: 'Helm', icon: '/heroGear/pieces/helm.png' },
  { id: 'gloves', label: 'Gloves', icon: '/heroGear/pieces/gloves.jpg' },
  { id: 'chestplate', label: 'Chestplate', icon: '/heroGear/pieces/chestplate.png' },
  { id: 'boots', label: 'Boots', icon: '/heroGear/pieces/boots.jpg' },
];

export type PrimaryStat = 'lethality' | 'health';

// Confirmed by isolating each piece at level 200 / mastery 0 and reading
// which stat showed the +100% bonus.
export const ARMOR_PRIMARY_STAT: Record<ArmorSlotId, PrimaryStat> = {
  helm: 'lethality',
  chestplate: 'health',
  gloves: 'health',
  boots: 'lethality',
};

export type ThresholdVariant = 'A' | 'B';

// Confirmed identical threshold text between Helm/Chestplate (variant A) and
// Gloves/Boots (variant B) in the reference UI.
export const ARMOR_THRESHOLD_VARIANT: Record<ArmorSlotId, ThresholdVariant> = {
  helm: 'A',
  chestplate: 'A',
  gloves: 'B',
  boots: 'B',
};

export type StatId = 'attack' | 'defense' | 'lethality' | 'health' | 'heroHealthArena';

export const STAT_LABELS: Record<StatId, string> = {
  attack: 'Attack',
  defense: 'Defense',
  lethality: 'Lethality',
  health: 'Health',
  heroHealthArena: 'Hero Health (Arena)',
};

export interface ThresholdBonus {
  level: number;
  stat: StatId;
  value: number;
}

// [level, stat, value] -- exact text extracted from the reference site.
const THRESHOLDS_A: ThresholdBonus[] = [
  { level: 120, stat: 'attack', value: 20 },
  { level: 140, stat: 'heroHealthArena', value: 7.5 },
  { level: 160, stat: 'defense', value: 30 },
  { level: 180, stat: 'heroHealthArena', value: 15 },
  { level: 200, stat: 'attack', value: 50 },
];
const THRESHOLDS_B: ThresholdBonus[] = [
  { level: 120, stat: 'defense', value: 20 },
  { level: 140, stat: 'heroHealthArena', value: 7.5 },
  { level: 160, stat: 'attack', value: 30 },
  { level: 180, stat: 'heroHealthArena', value: 15 },
  { level: 200, stat: 'defense', value: 50 },
];
export const THRESHOLDS: Record<ThresholdVariant, ThresholdBonus[]> = { A: THRESHOLDS_A, B: THRESHOLDS_B };

export const ARMOR_MAX_LEVEL = 200;
export const MASTERY_MAX_LEVEL = 20;

/** Cumulative primary-stat % at a given armor Level (0-200), before Mastery
 * multiplier. Piecewise-linear: confirmed level 0->0 (not the raw sheet's
 * 15.00 "intercept" -- the live calculator treats level 0 as contributing
 * literal 0), 15.35 at level 1, 50.00 at level 100, 100.00 at level 200. */
export function armorLevelStat(level: number): number {
  if (level <= 0) return 0;
  if (level <= 100) return 15 + level * 0.35;
  return 50 + (level - 100) * 0.5;
}

/** Mastery Forging's stat multiplier: x1.0 at mastery 0 up to x3.0 at mastery 20. */
export function masteryMultiplier(masteryLevel: number): number {
  return 1 + masteryLevel * 0.1;
}

export interface ArmorLevelCost {
  xp: number;
  mithril: number;
  mythicGears: number;
}

/** Incremental cost to go from (level-1) to level, for level 1-200. Formula
 * verified against both kingshotdata.com's published chart and the linked
 * Google Sheet's cumulative sums (matched exactly at every checked level). */
export function armorLevelCost(level: number): ArmorLevelCost {
  if (level <= 0) return { xp: 0, mithril: 0, mythicGears: 0 };
  const overrides: Record<number, ArmorLevelCost> = {
    101: { xp: 0, mithril: 0, mythicGears: 2 },
    120: { xp: 0, mithril: 10, mythicGears: 3 },
    140: { xp: 0, mithril: 20, mythicGears: 5 },
    160: { xp: 0, mithril: 30, mythicGears: 5 },
    180: { xp: 0, mithril: 40, mythicGears: 10 },
    200: { xp: 0, mithril: 50, mythicGears: 10 },
  };
  if (overrides[level]) return overrides[level];

  const e = level - 1;
  let xp: number;
  if (level <= 29) xp = 10 + e * 5;
  else if (level <= 39) xp = 150 + (e - 28) * 10;
  else if (level <= 59) xp = 250 + (e - 38) * 20;
  else if (level <= 69) xp = 650 + (e - 58) * 30;
  else if (level <= 79) xp = 950 + (e - 68) * 40;
  else if (level <= 100) xp = 1350 + (e - 78) * 50;
  else if (level <= 119) xp = 2500 + (e - 101) * 50;
  else if (level <= 139) xp = 3500 + (e - 120) * 50;
  else if (level <= 159) xp = 4450 + (e - 140) * 50;
  else if (level <= 179) xp = 5500 + (e - 160) * 100;
  else xp = 7500 + (e - 180) * 100;

  return { xp, mithril: 0, mythicGears: 0 };
}

export interface MasteryLevelCost {
  forgehammers: number;
  mythicGears: number;
}

/** Incremental cost to go from (masteryLevel-1) to masteryLevel, for 1-20.
 * Cross-verified against kingshotdata.com's Mastery Forging table and the
 * Google Sheet's cumulative sums (2,100 hammers / 55 mythic pieces at 20). */
export function masteryLevelCost(masteryLevel: number): MasteryLevelCost {
  if (masteryLevel <= 0) return { forgehammers: 0, mythicGears: 0 };
  return {
    forgehammers: masteryLevel * 10,
    mythicGears: masteryLevel > 10 ? masteryLevel - 10 : 0,
  };
}

/** Sum of armorLevelCost from level 1 up to and including `level`. */
export function armorLevelCostCumulative(level: number): ArmorLevelCost {
  const total: ArmorLevelCost = { xp: 0, mithril: 0, mythicGears: 0 };
  for (let l = 1; l <= level; l++) {
    const c = armorLevelCost(l);
    total.xp += c.xp;
    total.mithril += c.mithril;
    total.mythicGears += c.mythicGears;
  }
  return total;
}

/** Sum of masteryLevelCost from mastery 1 up to and including `masteryLevel`. */
export function masteryLevelCostCumulative(masteryLevel: number): MasteryLevelCost {
  const total: MasteryLevelCost = { forgehammers: 0, mythicGears: 0 };
  for (let m = 1; m <= masteryLevel; m++) {
    const c = masteryLevelCost(m);
    total.forgehammers += c.forgehammers;
    total.mythicGears += c.mythicGears;
  }
  return total;
}
