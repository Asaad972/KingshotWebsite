'use client';

import { useMemo } from 'react';
import {
  buildPlan,
  costForBuildingRange,
  defaultOtherLevels,
  selectableTownCenterLevels,
  BUILDING_LABELS,
  type PlanCost,
} from '@/lib/buildingPlanner';
import { BUILDINGS, DEPENDENCY_BUILDING_IDS } from '@/lib/buildings';
import { constructionSpeedMultiplier, defaultConstructionSpeedBuffs, type ConstructionSpeedBuffs } from '@/lib/constructionBuffs';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import RequiredPathView from './RequiredPathView';
import OptionalUpgradesList from './OptionalUpgradesList';
import PlanTotalsSidebar from './PlanTotalsSidebar';
import ConstructionSpeedBuffsCard from './ConstructionSpeedBuffsCard';

const TC_LEVELS = selectableTownCenterLevels();

interface PlannerState {
  currentTC: string;
  targetTC: string;
  currentLevels: Record<string, string | null>;
  levelsTouched: boolean;
  revealed: boolean;
  optionalAdds: Record<string, string | null>;
  speedBuffs: ConstructionSpeedBuffs;
}

function defaultPlannerState(): PlannerState {
  return {
    currentTC: '10',
    targetTC: '20',
    currentLevels: defaultOtherLevels('10'),
    levelsTouched: false,
    revealed: false,
    optionalAdds: {},
    speedBuffs: defaultConstructionSpeedBuffs(),
  };
}

/** Everything the user picks here is saved automatically, same as the
 * Gear/Charm/Hero Gear calculators -- otherwise a refresh throws away a
 * plan that can take a while to set up (multiple building levels, buffs,
 * optional adds). */
export default function BuildingPlannerSection() {
  const [state, setState] = useLocalStorageState<PlannerState>('buildingPlanner:state', defaultPlannerState());
  const { currentTC, targetTC, currentLevels, levelsTouched, revealed, optionalAdds, speedBuffs } = state;

  const handleCurrentTCChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      currentTC: value,
      currentLevels: prev.levelsTouched ? prev.currentLevels : defaultOtherLevels(value),
    }));
  };

  const handleLevelEdit = (buildingId: string, level: string) => {
    setState((prev) => ({ ...prev, levelsTouched: true, currentLevels: { ...prev.currentLevels, [buildingId]: level } }));
  };

  const plan = useMemo(() => {
    if (!revealed) return null;
    return buildPlan(currentTC, targetTC, currentLevels);
  }, [revealed, currentTC, targetTC, currentLevels]);

  const optionalCards = useMemo(() => {
    return Object.entries(optionalAdds)
      .filter(([, target]) => target)
      .map(([id, target]) => costForBuildingRange(id, currentLevels[id] ?? null, target as string))
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [optionalAdds, currentLevels]);

  const grandTotal = useMemo(() => {
    if (!plan) return null;
    const total: PlanCost & { timeSeconds: number } = { ...plan.total };
    for (const card of optionalCards) {
      total.wood += card.cost.wood;
      total.bread += card.cost.bread;
      total.stone += card.cost.stone;
      total.iron += card.cost.iron;
      total.truegold += card.cost.truegold;
      total.temperedTruegold += card.cost.temperedTruegold;
      total.timeSeconds += card.timeSeconds;
    }
    return total;
  }, [plan, optionalCards]);

  const displayTotal = useMemo(() => {
    if (!grandTotal) return null;
    return { ...grandTotal, timeSeconds: grandTotal.timeSeconds / constructionSpeedMultiplier(speedBuffs) };
  }, [grandTotal, speedBuffs]);

  const canShow = TC_LEVELS.indexOf(targetTC) > TC_LEVELS.indexOf(currentTC);

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-8">
      <div className="mb-5">
        <h1 className="section-title">Building Upgrade Planner</h1>
        <p className="text-xs text-parchment-400 mt-0.5">
          Pick where you are and where you want to be -- the plan works out the whole dependency chain for you.
        </p>
      </div>

      <div className="dashboard-card p-5 flex flex-col gap-4 mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-parchment-300 mb-1 block">Current Town Center</span>
            <select
              value={currentTC}
              onChange={(e) => handleCurrentTCChange(e.target.value)}
              className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-parchment-100 focus:border-gold-600"
            >
              {TC_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l.startsWith('TG') ? l : `Lv.${l}`}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-parchment-300 mb-1 block">Target Town Center</span>
            <select
              value={targetTC}
              onChange={(e) => setState((prev) => ({ ...prev, targetTC: e.target.value }))}
              className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-parchment-100 focus:border-gold-600"
            >
              {TC_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l.startsWith('TG') ? l : `Lv.${l}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="text-sm">
          <p className="text-parchment-300">
            Current Building Levels {levelsTouched && <span className="text-gold-400">(edited)</span>}
          </p>
          <p className="text-[11px] text-parchment-500 mt-0.5">
            Set what you already have -- the plan skips anything you've already built instead of assuming you're
            starting from zero.
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {DEPENDENCY_BUILDING_IDS.map((id) => (
              <label key={id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-parchment-400">{BUILDING_LABELS[id]}</span>
                <select
                  value={currentLevels[id] ?? ''}
                  onChange={(e) => handleLevelEdit(id, e.target.value)}
                  className="focus-ring rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-parchment-100"
                >
                  <option value="">None</option>
                  {BUILDINGS[id].levels.map((l) => (
                    <option key={l.level} value={l.level}>
                      Lv.{l.level}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        {!canShow && (
          <p className="text-xs text-ember-500">Target must be a higher level than your current Town Center.</p>
        )}

        <button
          type="button"
          disabled={!canShow}
          onClick={() => setState((prev) => ({ ...prev, revealed: true }))}
          className="focus-ring rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          Show Upgrade Plan
        </button>
      </div>

      {plan && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <div>
              <h2 className="text-sm font-semibold text-cyan-300 mb-2.5">Construction Speed</h2>
              <ConstructionSpeedBuffsCard buffs={speedBuffs} onChange={(next) => setState((prev) => ({ ...prev, speedBuffs: next }))} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-cyan-300 mb-2.5">Required Path</h2>
              <RequiredPathView plan={plan} />
            </div>

            <OptionalUpgradesList
              optionalIds={plan.optionalIds}
              currentLevels={currentLevels}
              addedTargets={optionalAdds}
              onAdd={(id, target) => setState((prev) => ({ ...prev, optionalAdds: { ...prev.optionalAdds, [id]: target } }))}
              onRemove={(id) => setState((prev) => ({ ...prev, optionalAdds: { ...prev.optionalAdds, [id]: null } }))}
            />
          </div>

          <PlanTotalsSidebar total={displayTotal} />
        </div>
      )}
    </div>
  );
}
