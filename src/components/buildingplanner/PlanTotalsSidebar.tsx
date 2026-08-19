'use client';

import type { PlanCost } from '@/lib/buildingPlanner';
import { formatDuration } from '@/lib/buildingPlanner';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon, TruegoldIcon, TemperedTruegoldIcon } from './BuildingIcons';

const ROWS: { key: keyof PlanCost; label: string; Icon: () => JSX.Element; tone: string }[] = [
  { key: 'wood', label: 'Wood', Icon: WoodIcon, tone: 'text-orange-400' },
  { key: 'bread', label: 'Bread', Icon: BreadIcon, tone: 'text-amber-400' },
  { key: 'stone', label: 'Stone', Icon: StoneIcon, tone: 'text-parchment-300' },
  { key: 'iron', label: 'Iron', Icon: IronIcon, tone: 'text-cyan-400' },
  { key: 'truegold', label: 'Truegold', Icon: TruegoldIcon, tone: 'text-gold-300' },
  { key: 'temperedTruegold', label: 'Tempered Truegold', Icon: TemperedTruegoldIcon, tone: 'text-ember-400' },
];

export default function PlanTotalsSidebar({ total }: { total: (PlanCost & { timeSeconds: number }) | null }) {
  return (
    <div className="dashboard-card p-5 flex flex-col gap-3 lg:sticky lg:top-20">
      <h2 className="text-base font-semibold text-parchment-100">Total Required</h2>

      {!total ? (
        <p className="text-xs text-parchment-500 py-1">Pick a current and target Town Center level, then Show Upgrade Plan.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {ROWS.filter((r) => total[r.key] > 0).map((r) => (
            <div key={r.key} className="flex items-center gap-2 text-base font-semibold tabular-nums">
              <span className={`h-5 w-5 shrink-0 ${r.tone}`}>
                <r.Icon />
              </span>
              <span className={r.tone}>{total[r.key].toLocaleString()}</span>
              <span className="text-parchment-500 text-sm font-normal">{r.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-xl font-bold text-parchment-100 tabular-nums mt-1 pt-2 border-t border-stone-700">
            <span className="h-6 w-6 shrink-0 text-parchment-300">
              <ClockIcon />
            </span>
            {formatDuration(total.timeSeconds)}
          </div>
          <p className="text-[11px] text-parchment-500 -mt-1">Total upgrade time</p>
        </div>
      )}
    </div>
  );
}
