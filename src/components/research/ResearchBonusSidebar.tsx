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

export default function ResearchBonusSidebar({ bonuses }: { bonuses: CategoryBonus[] }) {
  return (
    <div className="dashboard-card p-3.5 flex flex-col gap-2.5 lg:sticky lg:top-3">
      <h2 className="text-sm font-semibold text-parchment-100">Overall Bonuses</h2>
      <p className="text-[11px] text-parchment-400 -mt-1.5">Every tier of a stat stacks, so this is your true total.</p>

      <div className="flex flex-col gap-1">
        {bonuses.map((b) => {
          const resource = CATEGORY_RESOURCE[b.category];
          const Icon = RESOURCE_ICON[resource];
          const isGathering = b.category.endsWith('gathering');
          const hasGoal = b.targetPercent > b.currentPercent;
          return (
            <div key={b.category} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 odd:bg-stone-950/60">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`h-4 w-4 shrink-0 ${RESOURCE_COLOR[resource]}`}>
                  <Icon />
                </span>
                <span className="h-3 w-3 shrink-0 text-parchment-500">{isGathering ? <GatheringGlyph /> : <OutputGlyph />}</span>
                <span className="text-xs text-parchment-300 truncate">{b.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                <span className={`text-xs font-bold ${b.currentPercent > 0 ? 'text-gold-300' : 'text-parchment-500'}`}>
                  +{b.currentPercent}%
                </span>
                {hasGoal && (
                  <>
                    <span className="text-parchment-600 text-xs">→</span>
                    <span className="text-xs font-bold text-cyan-400">+{b.targetPercent}%</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
