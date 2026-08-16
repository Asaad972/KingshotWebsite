'use client';

import type { GearStatBonus } from '@/lib/gearData';

const TROOP_TYPES = ['Infantry', 'Cavalry', 'Archers'] as const;

function formatPercent(v: number): string {
  return `+${v.toFixed(2)}%`;
}

export default function GearTroopStatsPanel({ statBonus }: { statBonus: GearStatBonus }) {
  const rows: { label: string; value: number }[] = [
    { label: 'Attack', value: statBonus.attack },
    { label: 'Defense', value: statBonus.defense },
    { label: 'Lethality', value: statBonus.lethality },
    { label: 'Health', value: statBonus.health },
  ];

  return (
    <div className="dashboard-card p-3 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-parchment-100">Troop Stat Bonus</h2>
      <p className="text-[11px] text-parchment-500 -mt-2">
        Governor Gear bonuses apply to all troop types equally in this placeholder model.
      </p>
      {TROOP_TYPES.map((troop) => (
        <div key={troop}>
          <p className="text-xs font-semibold text-gold-300 mb-1">{troop}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-parchment-400">{r.label}</span>
                <span className={`tabular-nums font-medium ${r.value > 0 ? 'text-moss-500' : 'text-parchment-500'}`}>
                  {formatPercent(r.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
