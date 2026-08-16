import { CHARM_LEVELS, CHARM_SLOTS, getCharmLevel } from './charmData';
import type { TroopType } from './gearData';

export interface CharmSlotSelection {
  currentId: string;
  targetId: string;
}

export type CharmSelections = Record<string, CharmSlotSelection>;

export interface TroopStatTotal {
  current: number;
  target: number;
}

export interface CharmCalcResult {
  materials: Record<string, number>;
  /** Health/Lethality % totals, per troop type (each charm only boosts its own troop type). */
  troopStats: Record<TroopType, TroopStatTotal>;
  invalidSlots: string[];
}

const SLOT_TROOP_TYPE: Record<string, TroopType> = Object.fromEntries(CHARM_SLOTS.map((s) => [s.id, s.troopType]));

function emptyTroopStats(): Record<TroopType, TroopStatTotal> {
  return {
    infantry: { current: 0, target: 0 },
    cavalry: { current: 0, target: 0 },
    archers: { current: 0, target: 0 },
  };
}

export function calcCharmPlan(selections: CharmSelections): CharmCalcResult {
  const materials: Record<string, number> = {};
  const troopStats = emptyTroopStats();
  const invalidSlots: string[] = [];

  for (const slotId of Object.keys(selections)) {
    const sel = selections[slotId];
    const current = getCharmLevel(sel.currentId);
    const target = getCharmLevel(sel.targetId);
    if (!current || !target) continue;

    const troop = SLOT_TROOP_TYPE[slotId];
    troopStats[troop].current += current.totalPercent;

    if (target.order < current.order) {
      invalidSlots.push(slotId);
      troopStats[troop].target += current.totalPercent;
      continue;
    }

    const steps = CHARM_LEVELS.filter((l) => l.order > current.order && l.order <= target.order);
    for (const step of steps) {
      materials.guides = (materials.guides ?? 0) + step.cost.guides;
      materials.designs = (materials.designs ?? 0) + step.cost.designs;
    }
    troopStats[troop].target += target.totalPercent;
  }

  return { materials, troopStats, invalidSlots };
}
