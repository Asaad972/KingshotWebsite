'use client';

import { useMemo, useState } from 'react';
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
import RequiredPathView from './RequiredPathView';
import OptionalUpgradesList from './OptionalUpgradesList';
import PlanTotalsSidebar from './PlanTotalsSidebar';
import ConstructionSpeedBuffsCard from './ConstructionSpeedBuffsCard';

const TC_LEVELS = selectableTownCenterLevels();

export default function BuildingPlannerSection() {
  const [currentTC, setCurrentTC] = useState('10');
  const [targetTC, setTargetTC] = useState('20');
  const [currentLevels, setCurrentLevels] = useState<Record<string, string | null>>(() => defaultOtherLevels('10'));
  const [levelsTouched, setLevelsTouched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [optionalAdds, setOptionalAdds] = useState<Record<string, string | null>>({});
  const [speedBuffs, setSpeedBuffs] = useState<ConstructionSpeedBuffs>(defaultConstructionSpeedBuffs());

  const handleCurrentTCChange = (value: string) => {
    setCurrentTC(value);
    if (!levelsTouched) setCurrentLevels(defaultOtherLevels(value));
  };

  const handleLevelEdit = (buildingId: string, level: string) => {
    setLevelsTouched(true);
    setCurrentLevels((prev) => ({ ...prev, [buildingId]: level }));
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
        <h1 className="text-lg font-semibold text-parchment-100">Building Upgrade Planner</h1>
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
              onChange={(e) => setTargetTC(e.target.value)}
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

        <details className="text-sm">
          <summary className="cursor-pointer text-parchment-300 hover:text-gold-300 transition-colors select-none">
            Current Building Levels {levelsTouched && <span className="text-gold-400">(edited)</span>}
          </summary>
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
        </details>

        {!canShow && (
          <p className="text-xs text-ember-500">Target must be a higher level than your current Town Center.</p>
        )}

        <button
          type="button"
          disabled={!canShow}
          onClick={() => setRevealed(true)}
          className="focus-ring rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          Show Upgrade Plan
        </button>
      </div>

      {plan && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            <div>
              <h2 className="text-sm font-semibold text-cyan-300 mb-2.5">Required Path</h2>
              <RequiredPathView plan={plan} />
            </div>

            <OptionalUpgradesList
              optionalIds={plan.optionalIds}
              currentLevels={currentLevels}
              addedTargets={optionalAdds}
              onAdd={(id, target) => setOptionalAdds((prev) => ({ ...prev, [id]: target }))}
              onRemove={(id) => setOptionalAdds((prev) => ({ ...prev, [id]: null }))}
            />

            <div>
              <h2 className="text-sm font-semibold text-cyan-300 mb-2.5">Construction Speed</h2>
              <ConstructionSpeedBuffsCard buffs={speedBuffs} onChange={setSpeedBuffs} />
            </div>
          </div>

          <PlanTotalsSidebar total={displayTotal} />
        </div>
      )}
    </div>
  );
}
