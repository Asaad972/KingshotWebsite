'use client';

import type { ResearchPlanTotals } from '@/lib/researchCalc';

/** Just the completion ring + level/tech counts -- the cost/power/time/
 * speedups breakdown for your active goals lives in ResearchBonusSidebar
 * now, right alongside the bonuses those same goals earn, instead of being
 * duplicated up here too. */
export default function ResearchSummaryBar({ totals }: { totals: ResearchPlanTotals }) {
  const completionPercent = totals.levelsMax > 0 ? Math.round((totals.levelsCurrent / totals.levelsMax) * 100) : 0;

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
    </div>
  );
}
