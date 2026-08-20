'use client';

import { useI18n } from '@/lib/i18n';
import type { PlanCost } from '@/lib/buildingPlanner';
import { formatDuration } from '@/lib/buildingPlanner';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon, TruegoldIcon, TemperedTruegoldIcon } from './BuildingIcons';
import StatCard from '@/components/ui/StatCard';

const ROWS: { key: keyof PlanCost; labelKey: string; Icon: () => JSX.Element; tone: string }[] = [
  { key: 'wood', labelKey: 'resources.wood', Icon: WoodIcon, tone: 'text-orange-400' },
  { key: 'bread', labelKey: 'resources.bread', Icon: BreadIcon, tone: 'text-amber-400' },
  { key: 'stone', labelKey: 'resources.stone', Icon: StoneIcon, tone: 'text-parchment-300' },
  { key: 'iron', labelKey: 'resources.iron', Icon: IronIcon, tone: 'text-cyan-400' },
  { key: 'truegold', labelKey: 'resources.truegold', Icon: TruegoldIcon, tone: 'text-gold-300' },
  { key: 'temperedTruegold', labelKey: 'resources.temperedTruegold', Icon: TemperedTruegoldIcon, tone: 'text-ember-400' },
];

export default function PlanTotalsSidebar({ total }: { total: (PlanCost & { timeSeconds: number }) | null }) {
  const { t } = useI18n();
  return (
    <div className="dashboard-card p-5 flex flex-col gap-3 lg:sticky lg:top-20">
      <h2 className="card-title">{t('buildingPlanner.totalRequired')}</h2>

      {!total ? (
        <p className="text-xs text-parchment-500 py-1">{t('buildingPlanner.pickLevelsHint')}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {ROWS.filter((r) => total[r.key] > 0).map((r) => (
              <StatCard key={r.key} label={t(r.labelKey)} value={total[r.key].toLocaleString()} icon={<span className={r.tone}><r.Icon /></span>} />
            ))}
          </div>
          <StatCard label={t('buildingPlanner.totalUpgradeTime')} value={formatDuration(total.timeSeconds)} icon={<ClockIcon />} tone="gold" />
        </div>
      )}
    </div>
  );
}
