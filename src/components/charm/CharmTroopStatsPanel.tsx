'use client';

import { TROOP_LABELS, type TroopType } from '@/lib/gearData';
import type { TroopStatTotal } from '@/lib/charmCalc';

const TROOP_ORDER: TroopType[] = ['cavalry', 'infantry', 'archers'];

function formatPercent(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export default function CharmTroopStatsPanel({ troopStats }: { troopStats: Record<TroopType, TroopStatTotal> }) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="card-title">Stat Bonuses</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">
          Charms boost their piece's troop type Health &amp; Lethality (Cap/Watch &rarr; Cavalry, Coat/Pants &rarr; Infantry,
          Belt/Staff &rarr; Archers) -- the gear pieces themselves boost Attack &amp; Defense instead.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {TROOP_ORDER.map((troop) => {
          const stat = troopStats[troop];
          const improved = stat.target > stat.current;
          return (
            <div key={troop} className="rounded-md border border-stone-700 bg-stone-800 p-3">
              <p className="text-sm font-semibold text-gold-300 mb-2">{TROOP_LABELS[troop]}</p>
              <div className="flex flex-col gap-1.5">
                {(['Health', 'Lethality'] as const).map((label) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-parchment-400 shrink-0">{label}</span>
                    <span className="flex items-baseline gap-1.5 flex-wrap justify-end tabular-nums">
                      <span className={`text-sm font-semibold ${improved ? 'text-parchment-400' : 'text-parchment-200'}`}>
                        {formatPercent(stat.current)}
                      </span>
                      {improved && (
                        <>
                          <span className="text-parchment-600 text-xs">&rarr;</span>
                          <span className="text-sm font-bold text-moss-500">{formatPercent(stat.target)}</span>
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
