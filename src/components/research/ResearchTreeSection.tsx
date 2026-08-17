'use client';

import { useEffect, useState } from 'react';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { calcResearchPlan, calcCategoryBonuses, defaultResearchPlan, type ResearchPlan, type TechLevelState } from '@/lib/researchCalc';
import { getEconomyTech } from '@/lib/researchEconomyData';
import ResearchTreeFlow from './ResearchTreeFlow';
import ResearchTechCard from './ResearchTechCard';
import ResearchSummaryBar from './ResearchSummaryBar';
import ResearchBonusSidebar from './ResearchBonusSidebar';

/**
 * Research Tree (Economy branch) -- an isolated, self-contained feature (this
 * component + src/lib/researchEconomyData.ts + src/lib/researchCalc.ts +
 * everything in src/components/research/ + the /research-tree page). To
 * remove it entirely: delete this folder, those two lib files, and the page.
 * Nothing else in the app imports from here.
 *
 * Costs/time/power/effect% are real, extracted directly from
 * kingshotdata.com/research's own static markup -- see
 * researchEconomyData.ts for the sourcing note. The tree's shape (rows that
 * split and re-merge, connected by right-angle lines) mirrors the game's own
 * Academy screen layout. Development and Battle branches aren't built yet;
 * this is the Economy branch only.
 */
export default function ResearchTreeSection() {
  const [plan, setPlan] = useLocalStorageState<ResearchPlan>('researchTree:economy', defaultResearchPlan());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bonusesOpen, setBonusesOpen] = useState(false);

  const totals = calcResearchPlan(plan);
  const bonuses = calcCategoryBonuses(plan);
  const selectedTech = selectedId ? getEconomyTech(selectedId) : null;

  useEffect(() => {
    if (!selectedId && !bonusesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null);
        setBonusesOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, bonusesOpen]);

  const updateTech = (techId: string, next: TechLevelState) => {
    setPlan((prev) => ({ ...prev, [techId]: next }));
  };

  const handleReset = () => {
    setPlan(defaultResearchPlan());
    setSelectedId(null);
  };

  const isUnlocked = (techId: string): boolean => {
    const tech = getEconomyTech(techId);
    if (!tech) return false;
    return tech.prereqs.every((p) => (plan[p.techId]?.current ?? 0) >= p.level);
  };

  // Quick-max toggle right on the tree node -- no popup needed for the
  // common "I already have this maxed" case. Mirrors the Current-Max
  // checkbox inside the popup: sets current (and target, clamped up) to
  // maxLevel, or back to 0 if it was already maxed.
  const toggleMax = (techId: string) => {
    const tech = getEconomyTech(techId);
    if (!tech) return;
    const state = plan[techId] ?? { current: 0, target: 0 };
    const nextCurrent = state.current >= tech.maxLevel ? 0 : tech.maxLevel;
    updateTech(techId, { current: nextCurrent, target: Math.max(nextCurrent, state.target) });
  };

  return (
    <div className="flex flex-col gap-3" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">Research Tree -- Economy</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            Real cost, time, power, and effect data for all 44 Economy technologies. Tap a tech to set your level and
            goal.
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

      <div className="flex gap-1.5">
        <span className="rounded-t-md border border-b-0 border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-parchment-500">
          Growth (soon)
        </span>
        <span className="rounded-t-md border border-b-0 border-gold-500/60 bg-stone-900 px-4 py-2 text-xs font-semibold text-gold-300">
          Economy
        </span>
        <span className="rounded-t-md border border-b-0 border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-parchment-500">
          Battle (soon)
        </span>
      </div>

      <ResearchSummaryBar totals={totals} />

      {/* No items-start here on purpose -- a sticky child only has room to
          stay pinned while scrolling if ITS OWN grid-item box is as tall as
          the row (i.e. as tall as the tree). items-start would shrink the
          sidebar's box down to just its own content height, leaving the
          sticky panel nothing to "stick" within past the first ~400px. */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <ResearchTreeFlow plan={plan} selectedId={selectedId} onSelect={setSelectedId} onToggleMax={toggleMax} />
        <div className="hidden lg:block">
          <ResearchBonusSidebar bonuses={bonuses} />
        </div>
      </div>

      {/* Below lg, the sidebar can't sit beside the tree, so it becomes a
          floating button that's always on screen no matter how far you've
          scrolled down the tree -- tapping it opens the same bonus list. */}
      <button
        type="button"
        onClick={() => setBonusesOpen(true)}
        className="focus-ring lg:hidden fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full border border-gold-500/60 bg-stone-900 px-4 py-3 shadow-lg text-sm font-semibold text-gold-300"
      >
        Bonuses
      </button>

      {bonusesOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-4"
          onClick={() => setBonusesOpen(false)}
        >
          <div className="w-full max-w-sm max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <ResearchBonusSidebar bonuses={bonuses} onClose={() => setBonusesOpen(false)} />
          </div>
        </div>
      )}

      {selectedTech && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <ResearchTechCard
              tech={selectedTech}
              state={plan[selectedTech.id] ?? { current: 0, target: 0 }}
              unlocked={isUnlocked(selectedTech.id)}
              onChange={(next) => updateTech(selectedTech.id, next)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
