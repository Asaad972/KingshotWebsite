'use client';

import { useState } from 'react';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { calcResearchPlan, defaultResearchPlan, type ResearchPlan, type TechLevelState } from '@/lib/researchCalc';
import ResearchTreeCanvas from './ResearchTreeCanvas';
import TechDetailPanel from './TechDetailPanel';
import ResearchSummaryBar from './ResearchSummaryBar';

/**
 * Research Tree (Economy branch) -- an isolated, self-contained feature (this
 * component + src/lib/researchEconomyData.ts + src/lib/researchCalc.ts +
 * everything in src/components/research/ + the /research-tree page). To
 * remove it entirely: delete this folder, those two lib files, and the page.
 * Nothing else in the app imports from here.
 *
 * Costs/time/power/effect% are real, extracted directly from
 * kingshotdata.com/research's own static markup -- see
 * researchEconomyData.ts for the sourcing note. Development and Battle
 * branches aren't built yet; this is the Economy branch only.
 */
export default function ResearchTreeSection() {
  const [plan, setPlan] = useLocalStorageState<ResearchPlan>('researchTree:economy', defaultResearchPlan());
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  const totals = calcResearchPlan(plan);

  const updateTech = (techId: string, next: TechLevelState) => {
    setPlan((prev) => ({ ...prev, [techId]: next }));
  };

  const handleReset = () => {
    setPlan(defaultResearchPlan());
    setSelectedTechId(null);
  };

  return (
    <div className="flex flex-col gap-3" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">Research Tree -- Economy</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            Real cost, time, power, and effect data for all 44 Economy technologies. Track your level, set a goal, and
            see what it takes to get there.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
        >
          Reset all
        </button>
      </div>

      <ResearchSummaryBar totals={totals} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-3.5 items-start">
        <ResearchTreeCanvas plan={plan} selectedTechId={selectedTechId} onSelectTech={setSelectedTechId} />

        {selectedTechId ? (
          <TechDetailPanel
            techId={selectedTechId}
            state={plan[selectedTechId] ?? { current: 0, target: 0 }}
            onChange={(next) => updateTech(selectedTechId, next)}
            onClose={() => setSelectedTechId(null)}
          />
        ) : (
          <div className="dashboard-card p-6 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-semibold text-parchment-300">Tap a technology</p>
            <p className="text-xs text-parchment-500">Select any node on the tree to see its levels and set your goal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
