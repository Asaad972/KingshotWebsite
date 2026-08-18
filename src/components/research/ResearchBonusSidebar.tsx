'use client';

import type { CategoryBonus } from '@/lib/researchCalc';
import type { TreeDef } from '@/lib/researchTrees';
import { TechIconImage } from './ResearchIcons';

/** Shows only the bonus gained from techs you've actively set a goal for
 * (target > current) -- a tech just sitting at some level, including one
 * marked "already maxed" via the quick-tap pill, contributes nothing here.
 * This is "what do I get from upgrading," not a running total of
 * everything already researched. */
export default function ResearchBonusSidebar({
  tree,
  bonuses,
  onClose,
}: {
  tree: TreeDef;
  bonuses: CategoryBonus[];
  onClose?: () => void;
}) {
  return (
    <div className="dashboard-card p-5 flex flex-col gap-3 lg:sticky lg:top-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-parchment-100">Overall Bonuses</h2>
          <p className="text-xs text-parchment-400 mt-0.5">What you'll gain from the upgrades you've set a goal for.</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
          >
            Close
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {bonuses.map((b) => {
          const catIcon = tree.categoryIcon[b.category];
          return (
            <div key={b.category} className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 odd:bg-stone-950/60">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-5 w-5 shrink-0">
                  <TechIconImage src={catIcon.src} alt={catIcon.alt} />
                </span>
                <span className="text-sm text-parchment-300 truncate">{b.label}</span>
              </div>
              <span className={`text-sm font-bold shrink-0 tabular-nums ${b.gain > 0 ? 'text-cyan-400' : 'text-parchment-500'}`}>
                +{b.gain.toLocaleString()}
                {b.isPercent ? '%' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
