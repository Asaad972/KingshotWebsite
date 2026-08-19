'use client';

import { formatCompact, formatResearchDuration, type CategoryBonus, type ResearchPlanTotals } from '@/lib/researchCalc';
import type { TreeDef } from '@/lib/researchTrees';
import { TechIconImage, BreadIcon, WoodIcon, StoneIcon, IronIcon, GoldIcon, PowerIcon, ClockIcon, SpeedupIcon } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon, gold: GoldIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron' | 'gold', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
  gold: 'text-gold-300',
};

/** Shows only the bonus gained from techs you've actively set a goal for
 * (target > current) -- a tech just sitting at some level, including one
 * marked "already maxed" via the quick-tap pill, contributes nothing here.
 * This is "what do I get from upgrading," not a running total of
 * everything already researched -- and unlike an earlier version, categories
 * with nothing gained are hidden entirely rather than listed as "+0%", so
 * the list only ever shows what you've actually chosen to upgrade. The
 * resource cost / power / time / speedups needed for those same goals sits
 * right below it, in the same sticky panel. */
export default function ResearchBonusSidebar({
  tree,
  bonuses,
  totals,
  onClose,
}: {
  tree: TreeDef;
  bonuses: CategoryBonus[];
  totals: ResearchPlanTotals;
  onClose?: () => void;
}) {
  const activeBonuses = bonuses.filter((b) => b.gain > 0);
  const hasGoal = totals.levelsTarget > totals.levelsCurrent;
  const costEntries = (Object.keys(totals.cost) as (keyof typeof totals.cost)[]).filter((k) => totals.cost[k] > 0);

  return (
    // top-20 (not top-3) so the sticky panel settles just below the site
    // header's own sticky bar instead of tucking in at the very top of the
    // viewport, where the header (an explicit z-40) would paint over it.
    <div className="dashboard-card p-5 flex flex-col gap-3 lg:sticky lg:top-20 z-0">
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

      {activeBonuses.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {activeBonuses.map((b) => {
            const catIcon = tree.categoryIcon[b.category];
            return (
              <div key={b.category} className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 odd:bg-stone-950/60">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-5 w-5 shrink-0">
                    <TechIconImage src={catIcon.src} alt={catIcon.alt} />
                  </span>
                  <span className="text-sm text-parchment-300 truncate">{b.label}</span>
                </div>
                <span className="text-sm font-bold shrink-0 tabular-nums text-cyan-400">
                  +{b.gain.toLocaleString()}
                  {b.isPercent ? '%' : ''}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-parchment-500 py-1">Set a goal on the tree to see what it'll earn you here.</p>
      )}

      {hasGoal && (
        <div className="flex flex-col gap-2.5 rounded-md border border-cyan-500/30 bg-cyan-500/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">To reach your goals</p>
          <div className="flex flex-col gap-2">
            {costEntries.map((k) => {
              const Icon = RESOURCE_ICON[k];
              return (
                <span key={k} className={`flex items-center gap-2 text-base font-semibold tabular-nums ${RESOURCE_COLOR[k]}`}>
                  <span className="h-5 w-5 shrink-0">
                    <Icon />
                  </span>
                  {formatCompact(totals.cost[k])}
                </span>
              );
            })}
            <span className="flex items-center gap-2 text-base font-semibold text-sky-400 tabular-nums">
              <span className="h-5 w-5 shrink-0">
                <PowerIcon />
              </span>
              +{formatCompact(totals.powerGained)} Power
            </span>
            <span className="flex items-center gap-2 text-xl font-bold text-parchment-100 tabular-nums mt-0.5">
              <span className="h-6 w-6 shrink-0">
                <ClockIcon />
              </span>
              {formatResearchDuration(totals.timeSeconds)}
            </span>
            <span className="flex items-center gap-2 text-base font-semibold text-cyan-300 tabular-nums">
              <span className="h-5 w-5 shrink-0">
                <SpeedupIcon />
              </span>
              {formatCompact(Math.ceil(totals.timeSeconds / 60))} min speedups
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
