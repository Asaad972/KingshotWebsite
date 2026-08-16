import {
  ARMOR_SLOTS,
  ARMOR_PRIMARY_STAT,
  ARMOR_THRESHOLD_VARIANT,
  THRESHOLDS,
  armorLevelStat,
  masteryMultiplier,
  armorLevelCostCumulative,
  masteryLevelCostCumulative,
  type ArmorSlotId,
  type StatId,
} from './heroGearData';

export interface ArmorSelection {
  currentLevel: number;
  targetLevel: number;
  currentMastery: number;
  targetMastery: number;
}

export type ArmorSelections = Record<ArmorSlotId, ArmorSelection>;

export interface HeroGearMaterials {
  xp: number;
  mithril: number;
  mythicGears: number;
  forgehammers: number;
}

export type StatTotals = Record<StatId, number>;

export interface HeroGearCalcResult {
  materials: HeroGearMaterials;
  statBonus: StatTotals;
}

function emptyStats(): StatTotals {
  return { attack: 0, defense: 0, lethality: 0, health: 0, heroHealthArena: 0 };
}

/** Total (level-curve x mastery-multiplier) value for one piece at a given level+mastery. */
function armorPrimaryStatTotal(level: number, mastery: number): number {
  return armorLevelStat(level) * masteryMultiplier(mastery);
}

/** Sum of threshold bonuses unlocked at or below `level` for a given variant. */
function thresholdTotals(level: number, variant: 'A' | 'B'): Partial<Record<StatId, number>> {
  const totals: Partial<Record<StatId, number>> = {};
  for (const t of THRESHOLDS[variant]) {
    if (level >= t.level) totals[t.stat] = (totals[t.stat] ?? 0) + t.value;
  }
  return totals;
}

export function calcHeroGearPlan(armor: ArmorSelections): HeroGearCalcResult {
  const materials: HeroGearMaterials = { xp: 0, mithril: 0, mythicGears: 0, forgehammers: 0 };
  const statBonus = emptyStats();

  for (const slot of ARMOR_SLOTS) {
    const sel = armor[slot.id];
    const primaryStat = ARMOR_PRIMARY_STAT[slot.id];
    const variant = ARMOR_THRESHOLD_VARIANT[slot.id];

    if (sel.targetLevel > sel.currentLevel) {
      const from = armorLevelCostCumulative(sel.currentLevel);
      const to = armorLevelCostCumulative(sel.targetLevel);
      materials.xp += to.xp - from.xp;
      materials.mithril += to.mithril - from.mithril;
      materials.mythicGears += to.mythicGears - from.mythicGears;
    }
    if (sel.targetMastery > sel.currentMastery) {
      const from = masteryLevelCostCumulative(sel.currentMastery);
      const to = masteryLevelCostCumulative(sel.targetMastery);
      materials.forgehammers += to.forgehammers - from.forgehammers;
      materials.mythicGears += to.mythicGears - from.mythicGears;
    }

    const currentTotal = armorPrimaryStatTotal(sel.currentLevel, sel.currentMastery);
    const targetTotal = armorPrimaryStatTotal(sel.targetLevel, sel.targetMastery);
    statBonus[primaryStat] += targetTotal - currentTotal;

    const currentThresholds = thresholdTotals(sel.currentLevel, variant);
    const targetThresholds = thresholdTotals(sel.targetLevel, variant);
    for (const stat of Object.keys(targetThresholds) as StatId[]) {
      statBonus[stat] += (targetThresholds[stat] ?? 0) - (currentThresholds[stat] ?? 0);
    }
  }

  return { materials, statBonus };
}
