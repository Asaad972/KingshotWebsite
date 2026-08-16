import { GEAR_LEVELS, GEAR_SLOTS, getGearLevel, type GearSlotId, type TroopType } from './gearData';

export interface GearSlotSelection {
  currentId: string;
  targetId: string;
}

export type GearSelections = Record<GearSlotId, GearSlotSelection>;

export interface TroopStatTotal {
  /** Current cumulative %, summed across this troop type's 2 gear pieces. Applies equally to Attack and Defense. */
  current: number;
  /** Target cumulative %, summed across this troop type's 2 gear pieces. */
  target: number;
}

export interface GearCalcResult {
  /** materialId -> total quantity required across all 6 slots. */
  materials: Record<string, number>;
  /** Attack/Defense % totals, per troop type (each piece only boosts its own troop type). */
  troopStats: Record<TroopType, TroopStatTotal>;
  /** Slots where target is set below current -- nothing counted for these. */
  invalidSlots: GearSlotId[];
}

const SLOT_TROOP_TYPE: Record<GearSlotId, TroopType> = Object.fromEntries(
  GEAR_SLOTS.map((s) => [s.id, s.troopType])
) as Record<GearSlotId, TroopType>;

function emptyTroopStats(): Record<TroopType, TroopStatTotal> {
  return {
    infantry: { current: 0, target: 0 },
    cavalry: { current: 0, target: 0 },
    archers: { current: 0, target: 0 },
  };
}

/** Materials are summed from every level strictly after `current` up to and
 * including `target` (each level's cost is the incremental cost of that one
 * step). Each slot's Attack/Defense % is added only to its own troop type's
 * total, since gear only boosts the troop type it belongs to. */
export function calcGearPlan(selections: GearSelections): GearCalcResult {
  const materials: Record<string, number> = {};
  const troopStats = emptyTroopStats();
  const invalidSlots: GearSlotId[] = [];

  for (const slotId of Object.keys(selections) as GearSlotId[]) {
    const sel = selections[slotId];
    const current = getGearLevel(sel.currentId);
    const target = getGearLevel(sel.targetId);
    if (!current || !target) continue;

    const troop = SLOT_TROOP_TYPE[slotId];
    troopStats[troop].current += current.attrPercent;

    if (target.order < current.order) {
      invalidSlots.push(slotId);
      troopStats[troop].target += current.attrPercent;
      continue;
    }

    const steps = GEAR_LEVELS.filter((l) => l.order > current.order && l.order <= target.order);
    for (const step of steps) {
      materials.satin = (materials.satin ?? 0) + step.cost.satin;
      materials.gildedThreads = (materials.gildedThreads ?? 0) + step.cost.gildedThreads;
      materials.artisansVision = (materials.artisansVision ?? 0) + step.cost.artisansVision;
    }
    troopStats[troop].target += target.attrPercent;
  }

  return { materials, troopStats, invalidSlots };
}
