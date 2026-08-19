'use client';

import type { PlanCost } from '@/lib/buildingPlanner';
import { formatDuration } from '@/lib/buildingPlanner';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon, TruegoldIcon, TemperedTruegoldIcon } from './BuildingIcons';
import StatCard from '@/components/ui/StatCard';

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
      <h2 className="card-title">Total Required</h2>

      {!total ? (
        <p className="text-xs text-parchment-500 py-1">Pick a current and target Town Center level, then Show Upgrade Plan.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {ROWS.filter((r) => total[r.key] > 0).map((r) => (
              <StatCard key={r.key} label={r.label} value={total[r.key].toLocaleString()} icon={<span className={r.tone}><r.Icon /></span>} />
            ))}
          </div>
          <StatCard label="Total Upgrade Time" value={formatDuration(total.timeSeconds)} icon={<ClockIcon />} tone="gold" />
        </div>
      )}
    </div>
  );
}
