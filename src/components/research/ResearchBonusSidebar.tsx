'use client';

import { CATEGORY_RESOURCE, type CategoryBonus } from '@/lib/researchCalc';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, OutputGlyph, GatheringGlyph } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
};

/** Shows only the bonus % gained from techs you've actively set a goal for
 * (target > current) -- a tech just sitting at some level, including one
 * marked "already maxed" via the quick-tap pill, contributes nothing here.
 * This is "what do I get from upgrading," not a running total of
 * everything already researched. */
export default function ResearchBonusSidebar({ bonuses, onClose }: { bonuses: CategoryBonus[]; onClose?: () => void }) {
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
          const resource = CATEGORY_RESOURCE[b.category];
          const Icon = RESOURCE_ICON[resource];
          const isGathering = b.category.endsWith('gathering');
          return (
            <div key={b.category} className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 odd:bg-stone-950/60">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-5 w-5 shrink-0 ${RESOURCE_COLOR[resource]}`}>
                  <Icon />
                </span>
                <span className="h-3.5 w-3.5 shrink-0 text-parchment-500">{isGathering ? <GatheringGlyph /> : <OutputGlyph />}</span>
                <span className="text-sm text-parchment-300 truncate">{b.label}</span>
              </div>
              <span className={`text-sm font-bold shrink-0 tabular-nums ${b.gainPercent > 0 ? 'text-cyan-400' : 'text-parchment-500'}`}>
                +{b.gainPercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
