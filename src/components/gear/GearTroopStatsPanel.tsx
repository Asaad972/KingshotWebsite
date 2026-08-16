'use client';

const TROOP_TYPES = ['Infantry', 'Cavalry', 'Archers'] as const;
const STAT_LABELS = ['Attack', 'Defense', 'Lethality', 'Health'] as const;

function formatPercent(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}

export default function GearTroopStatsPanel({
  currentTotalAttrPercent,
  targetTotalAttrPercent,
}: {
  currentTotalAttrPercent: number;
  targetTotalAttrPercent: number;
}) {
  const improved = targetTotalAttrPercent > currentTotalAttrPercent;
  return (
    <div className="dashboard-card p-3 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-parchment-100">Stat Bonuses</h2>
      <p className="text-[11px] text-parchment-500 -mt-2">
        Real per-level % from the gear database, summed across your Current vs Target selections. The source lists one
        combined bonus per piece without breaking it down by individual stat, so the same total applies to every stat below.
      </p>
      {TROOP_TYPES.map((troop) => (
        <div key={troop}>
          <p className="text-xs font-semibold text-gold-300 mb-1">{troop}</p>
          <div className="flex flex-col gap-0.5">
            {STAT_LABELS.map((label) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-parchment-400">{label}</span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <span className="text-parchment-500">{formatPercent(currentTotalAttrPercent)}</span>
                  {improved && (
                    <>
                      <span className="text-parchment-600">&rarr;</span>
                      <span className="font-medium text-moss-500">{formatPercent(targetTotalAttrPercent)}</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
