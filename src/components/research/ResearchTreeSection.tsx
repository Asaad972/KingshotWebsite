'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import {
  calcResearchPlan,
  calcCategoryBonuses,
  defaultResearchPlan,
  defaultSpeedBuffs,
  type ResearchPlan,
  type ResearchSpeedBuffs,
  type TechLevelState,
} from '@/lib/researchCalc';
import { TREES, TREE_ORDER, type TreeId } from '@/lib/researchTrees';
import ResearchTreeFlow from './ResearchTreeFlow';
import ResearchTechCard from './ResearchTechCard';
import ResearchSummaryBar from './ResearchSummaryBar';
import ResearchSpeedBuffsCard from './ResearchSpeedBuffsCard';
import ResearchBonusSidebar from './ResearchBonusSidebar';

/**
 * Research Tree -- Growth, Economy, and Battle branches -- an isolated,
 * self-contained feature (this component + src/lib/research*.ts +
 * everything in src/components/research/ + the /research-tree page). To
 * remove it entirely: delete this folder, those lib files, and the page.
 * Nothing else in the app imports from here.
 *
 * Costs/time/power/effect data are real, extracted directly from
 * kingshotdata.com/research's own static markup -- see each
 * research*Data.ts file for the sourcing note. The tree's shape (rows that
 * split and re-merge, connected by right-angle lines) mirrors the game's
 * own Academy screen layout.
 */
const CATEGORY_LABEL_KEY: Record<TreeId, string> = {
  economy: 'researchTree.categoryEconomy',
  growth: 'researchTree.categoryGrowth',
  battle: 'researchTree.categoryBattle',
};

export default function ResearchTreeSection() {
  const { t } = useI18n();
  const [activeTreeId, setActiveTreeId] = useState<TreeId>('economy');
  const tree = TREES[activeTreeId];

  // One persisted plan per tree (own localStorage key, own default shape) --
  // called unconditionally so hook order stays stable across tab switches,
  // then the active one is selected below. A single dynamically-keyed call
  // would leave a not-yet-saved tree showing the PREVIOUS tree's state,
  // since the hook's hydration effect only overwrites state when it finds
  // saved data for the new key.
  const [economyPlan, setEconomyPlan] = useLocalStorageState<ResearchPlan>(
    'researchTree:economy',
    defaultResearchPlan(TREES.economy.techs)
  );
  const [growthPlan, setGrowthPlan] = useLocalStorageState<ResearchPlan>(
    'researchTree:growth',
    defaultResearchPlan(TREES.growth.techs)
  );
  const [battlePlan, setBattlePlan] = useLocalStorageState<ResearchPlan>(
    'researchTree:battle',
    defaultResearchPlan(TREES.battle.techs)
  );
  const [plan, setPlan] =
    activeTreeId === 'economy' ? [economyPlan, setEconomyPlan] : activeTreeId === 'growth' ? [growthPlan, setGrowthPlan] : [battlePlan, setBattlePlan];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bonusesOpen, setBonusesOpen] = useState(false);

  // One shared buffs setting across all 3 trees -- these are account-wide
  // speed bonuses, not tree-specific ones.
  const [speedBuffs, setSpeedBuffs] = useLocalStorageState<ResearchSpeedBuffs>('researchTree:speedBuffs', defaultSpeedBuffs());

  const totals = calcResearchPlan(tree.techs, plan, speedBuffs);
  const bonuses = calcCategoryBonuses(tree.techs, tree.categoryOrder, plan);
  const selectedTech = selectedId ? tree.getTech(selectedId) : null;

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

  const switchTree = (id: TreeId) => {
    setActiveTreeId(id);
    setSelectedId(null);
    setBonusesOpen(false);
  };

  const updateTech = (techId: string, next: TechLevelState) => {
    setPlan((prev) => ({ ...prev, [techId]: next }));
  };

  const handleReset = () => {
    setPlan(defaultResearchPlan(tree.techs));
    setSelectedId(null);
  };

  // Same "current = target = maxLevel for every tech" toggleMax already
  // applies one at a time, just for the whole tree in one click.
  const handleMaxAll = () => {
    const next: ResearchPlan = {};
    for (const t of tree.techs) {
      next[t.id] = { current: t.maxLevel, target: t.maxLevel };
    }
    setPlan(next);
    setSelectedId(null);
  };

  const isUnlocked = (techId: string): boolean => {
    const tech = tree.getTech(techId);
    if (!tech) return false;
    return tech.prereqs.every((p) => (plan[p.techId]?.current ?? 0) >= p.level);
  };

  // Quick-max toggle right on the tree node -- no popup needed for the
  // common "I already have this maxed" case. Mirrors the Current-Max
  // checkbox inside the popup: sets current (and target, clamped up) to
  // maxLevel, or back to 0 if it was already maxed.
  const toggleMax = (techId: string) => {
    const tech = tree.getTech(techId);
    if (!tech) return;
    const state = plan[techId] ?? { current: 0, target: 0 };
    const nextCurrent = state.current >= tech.maxLevel ? 0 : tech.maxLevel;
    updateTech(techId, { current: nextCurrent, target: Math.max(nextCurrent, state.target) });
  };

  // Prototype: +/- steppers flanking a single node (see ResearchTreeFlow),
  // testing whether that's an easier way to set Current/Target than opening
  // the popup. Current can't pass Target going up (bumps it along); Target
  // can't drop below Current going down.
  const stepTech = (techId: string, field: 'current' | 'target', delta: number) => {
    const tech = tree.getTech(techId);
    if (!tech) return;
    const state = plan[techId] ?? { current: 0, target: 0 };
    if (field === 'current') {
      const nextCurrent = Math.max(0, Math.min(tech.maxLevel, state.current + delta));
      updateTech(techId, { current: nextCurrent, target: Math.max(nextCurrent, state.target) });
    } else {
      const nextTarget = Math.max(state.current, Math.min(tech.maxLevel, state.target + delta));
      updateTech(techId, { current: state.current, target: nextTarget });
    }
  };

  return (
    <div className="flex flex-col gap-3" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title">{t('researchTree.treeTitle', { label: t(CATEGORY_LABEL_KEY[activeTreeId]) })}</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            {t('researchTree.subtitle', { count: tree.techs.length, label: t(CATEGORY_LABEL_KEY[activeTreeId]) })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleMaxAll}
            className="focus-ring rounded border border-gold-600/50 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/10 transition-colors"
          >
            {t('calc.maxAll')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
          >
            {t('calc.resetAll')}
          </button>
        </div>
      </div>

      <div className="flex gap-1.5">
        {TREE_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => switchTree(id)}
            className={`focus-ring rounded-t-md border border-b-0 px-4 py-2 text-xs font-semibold transition-colors ${
              activeTreeId === id
                ? 'border-gold-500/60 bg-stone-900 text-gold-300'
                : 'border-stone-700 bg-stone-800 text-parchment-400 hover:text-parchment-200'
            }`}
          >
            {t(CATEGORY_LABEL_KEY[id])}
          </button>
        ))}
      </div>

      <ResearchSpeedBuffsCard buffs={speedBuffs} onChange={setSpeedBuffs} />

      <ResearchSummaryBar totals={totals} />

      {/* No items-start here on purpose -- a sticky child only has room to
          stay pinned while scrolling if ITS OWN grid-item box is as tall as
          the row (i.e. as tall as the tree). items-start would shrink the
          sidebar's box down to just its own content height, leaving the
          sticky panel nothing to "stick" within past the first ~400px. */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <ResearchTreeFlow
          key={activeTreeId}
          tree={tree}
          plan={plan}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onToggleMax={toggleMax}
          onStep={stepTech}
        />
        <div className="hidden lg:block">
          <ResearchBonusSidebar tree={tree} bonuses={bonuses} totals={totals} />
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
        {t('researchTree.bonusesButton')}
      </button>

      {bonusesOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-4"
          onClick={() => setBonusesOpen(false)}
        >
          <div className="w-full max-w-sm max-h-[80vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <ResearchBonusSidebar tree={tree} bonuses={bonuses} totals={totals} onClose={() => setBonusesOpen(false)} />
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
              getTech={tree.getTech}
              onChange={(next) => updateTech(selectedTech.id, next)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
