import { GEAR_LEVELS, getGearLevel, type GearStatBonus, type GearSlotId } from './gearData';

export interface GearSlotSelection {
  currentId: string;
  targetId: string;
}

export type GearSelections = Record<GearSlotId, GearSlotSelection>;

export interface GearCalcResult {
  /** materialId -> total quantity required across all 6 slots. */
  materials: Record<string, number>;
  coins: number;
  statBonus: GearStatBonus;
  /** Slots where target is set below current -- nothing counted for these. */
  invalidSlots: GearSlotId[];
}

/** Sums the incremental cost/stat of every level strictly after `current`
 * up to and including `target`, for every gear slot, into one grand total. */
export function calcGearPlan(selections: GearSelections): GearCalcResult {
  const materials: Record<string, number> = {};
  let coins = 0;
  const statBonus: GearStatBonus = { attack: 0, defense: 0, lethality: 0, health: 0 };
  const invalidSlots: GearSlotId[] = [];

  for (const slotId of Object.keys(selections) as GearSlotId[]) {
    const sel = selections[slotId];
    const current = getGearLevel(sel.currentId);
    const target = getGearLevel(sel.targetId);
    if (!current || !target) continue;
    if (target.order < current.order) {
      invalidSlots.push(slotId);
      continue;
    }

    const steps = GEAR_LEVELS.filter((l) => l.order > current.order && l.order <= target.order);
    for (const step of steps) {
      if (step.cost.designId) materials[step.cost.designId] = (materials[step.cost.designId] ?? 0) + step.cost.designQty;
      if (step.cost.materialId) materials[step.cost.materialId] = (materials[step.cost.materialId] ?? 0) + step.cost.materialQty;
      coins += step.cost.coins;
      statBonus.attack += step.statBonus.attack;
      statBonus.defense += step.statBonus.defense;
      statBonus.lethality += step.statBonus.lethality;
      statBonus.health += step.statBonus.health;
    }
  }

  return { materials, coins, statBonus, invalidSlots };
}
