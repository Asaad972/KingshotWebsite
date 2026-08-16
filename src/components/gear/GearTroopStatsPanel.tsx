'use client';

import { TROOP_LABELS, type TroopType } from '@/lib/gearData';
import type { TroopStatTotal } from '@/lib/gearCalc';

const TROOP_ORDER: TroopType[] = ['cavalry', 'infantry', 'archers'];

function formatPercent(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export default function GearTroopStatsPanel({ troopStats }: { troopStats: Record<TroopType, TroopStatTotal> }) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-parchment-100">Stat Bonuses</h2>
        <p className="text-[11px] text-parchment-500 mt-0.5">
          Each gear piece boosts only its own troop type's Attack &amp; Defense (Cap/Watch &rarr; Cavalry, Coat/Pants
          &rarr; Infantry, Belt/Staff &rarr; Archers).
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {TROOP_ORDER.map((troop) => {
          const stat = troopStats[troop];
          const improved = stat.target > stat.current;
          return (
            <div key={troop} className="rounded-md border border-stone-700 bg-stone-950/60 p-3">
              <p className="text-sm font-semibold text-gold-300 mb-2">{TROOP_LABELS[troop]}</p>
              <div className="grid grid-cols-2 gap-3">
                {(['Attack', 'Defense'] as const).map((label) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wide text-parchment-500">{label}</span>
                    <span className="flex items-baseline gap-2 tabular-nums mt-0.5">
                      <span className={`text-lg font-bold ${improved ? 'text-parchment-400' : 'text-parchment-200'}`}>
                        {formatPercent(stat.current)}
                      </span>
                      {improved && (
                        <>
                          <span className="text-parchment-600">&rarr;</span>
                          <span className="text-lg font-bold text-moss-500">{formatPercent(stat.target)}</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
