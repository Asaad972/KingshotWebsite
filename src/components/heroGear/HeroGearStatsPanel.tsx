'use client';

import { STAT_LABELS, TROOP_LABELS, type StatId, type TroopType } from '@/lib/heroGearData';
import type { StatTotals } from '@/lib/heroGearCalc';

const STAT_ORDER: StatId[] = ['attack', 'defense', 'lethality', 'health', 'heroHealthArena'];
const TROOP_ORDER: TroopType[] = ['infantry', 'cavalry', 'archers'];

function formatPercent(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export default function HeroGearStatsPanel({ statsByTroop }: { statsByTroop: Record<TroopType, StatTotals> }) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div>
        <h2 className="card-title">Stat Bonus</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">One gear plan per troop type -- all three calculated together.</p>
      </div>
      <div className="flex flex-col gap-3">
        {TROOP_ORDER.map((troop) => (
          <div key={troop} className="rounded-md border border-stone-700 bg-stone-800 p-3">
            <p className="text-sm font-semibold text-gold-300 mb-2">{TROOP_LABELS[troop]}</p>
            <div className="flex flex-col gap-1">
              {STAT_ORDER.map((stat) => (
                <div key={stat} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-parchment-400">{STAT_LABELS[stat]}</span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      statsByTroop[troop][stat] > 0 ? 'text-moss-500' : 'text-parchment-400'
                    }`}
                  >
                    {formatPercent(statsByTroop[troop][stat])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
