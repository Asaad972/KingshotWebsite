import { GEAR_LEVELS, getGearLevel, type GearSlotId } from './gearData';

export interface GearSlotSelection {
  currentId: string;
  targetId: string;
}

export type GearSelections = Record<GearSlotId, GearSlotSelection>;

export interface GearCalcResult {
  /** materialId -> total quantity required across all 6 slots. */
  materials: Record<string, number>;
  /** Sum, across all 6 slots, of each slot's CURRENT cumulative %. */
  currentTotalAttrPercent: number;
  /** Sum, across all 6 slots, of each slot's TARGET cumulative %. */
  targetTotalAttrPercent: number;
  /** targetTotalAttrPercent - currentTotalAttrPercent. */
  totalAttrPercent: number;
  /** Slots where target is set below current -- nothing counted for these. */
  invalidSlots: GearSlotId[];
}

/** Materials are summed from every level strictly after `current` up to and
 * including `target` (each level's cost is the incremental cost of that one
 * step). Attribute % totals are summed directly from each slot's cumulative
 * value (current and target separately), since the source data reports
 * attrPercent as a running total, not a per-level increment. */
export function calcGearPlan(selections: GearSelections): GearCalcResult {
  const materials: Record<string, number> = {};
  let currentTotalAttrPercent = 0;
  let targetTotalAttrPercent = 0;
  const invalidSlots: GearSlotId[] = [];

  for (const slotId of Object.keys(selections) as GearSlotId[]) {
    const sel = selections[slotId];
    const current = getGearLevel(sel.currentId);
    const target = getGearLevel(sel.targetId);
    if (!current || !target) continue;

    currentTotalAttrPercent += current.attrPercent;

    if (target.order < current.order) {
      invalidSlots.push(slotId);
      targetTotalAttrPercent += current.attrPercent;
      continue;
    }

    const steps = GEAR_LEVELS.filter((l) => l.order > current.order && l.order <= target.order);
    for (const step of steps) {
      materials.satin = (materials.satin ?? 0) + step.cost.satin;
      materials.gildedThreads = (materials.gildedThreads ?? 0) + step.cost.gildedThreads;
      materials.artisansVision = (materials.artisansVision ?? 0) + step.cost.artisansVision;
    }
    targetTotalAttrPercent += target.attrPercent;
  }

  return {
    materials,
    currentTotalAttrPercent,
    targetTotalAttrPercent,
    totalAttrPercent: targetTotalAttrPercent - currentTotalAttrPercent,
    invalidSlots,
  };
}
