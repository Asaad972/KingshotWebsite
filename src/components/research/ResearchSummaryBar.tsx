'use client';

import { formatCompact, formatResearchDuration, type ResearchPlanTotals } from '@/lib/researchCalc';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, GoldIcon, PowerIcon, ClockIcon, SpeedupIcon } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon, gold: GoldIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron' | 'gold', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
  gold: 'text-gold-300',
};

export default function ResearchSummaryBar({ totals }: { totals: ResearchPlanTotals }) {
  const completionPercent = totals.levelsMax > 0 ? Math.round((totals.levelsCurrent / totals.levelsMax) * 100) : 0;
  const costEntries = (Object.keys(totals.cost) as (keyof typeof totals.cost)[]).filter((k) => totals.cost[k] > 0);
  const hasGoal = totals.levelsTarget > totals.levelsCurrent;

  return (
    <div className="dashboard-card p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0">
            <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1f2a3c" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#f9a8d4"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(completionPercent / 100) * 97.4} 97.4`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-parchment-100">
              {completionPercent}%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-parchment-100">
              {totals.levelsCurrent}/{totals.levelsMax} levels researched
            </p>
            <p className="text-[11px] text-parchment-400">
              {totals.techsMaxedCurrent}/{totals.techsTotal} techs maxed
            </p>
          </div>
        </div>
      </div>

      {hasGoal && (
        <div className="flex flex-col gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/5 p-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-cyan-400">To reach your goals</p>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            {costEntries.map((k) => {
              const Icon = RESOURCE_ICON[k];
              return (
                <span key={k} className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${RESOURCE_COLOR[k]}`}>
                  <span className="h-4 w-4">
                    <Icon />
                  </span>
                  {formatCompact(totals.cost[k])}
                </span>
              );
            })}
            <span className="flex items-center gap-1 text-xs font-semibold text-sky-400 tabular-nums">
              <span className="h-4 w-4">
                <PowerIcon />
              </span>
              +{formatCompact(totals.powerGained)} Power
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-parchment-400 tabular-nums">
              <span className="h-4 w-4">
                <ClockIcon />
              </span>
              {formatResearchDuration(totals.timeSeconds)}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-cyan-300 tabular-nums">
              <span className="h-4 w-4">
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
