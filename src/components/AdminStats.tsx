'use client';

import { useI18n } from '@/lib/i18n';

interface AdminStatsProps {
  totalApplications: number;
  assigned: number;
  unassigned: number;
  availableSlots: number;
}

export default function AdminStats({ totalApplications, assigned, unassigned, availableSlots }: AdminStatsProps) {
  const { t } = useI18n();

  const cards = [
    { label: t('admin.totalApplications'), value: totalApplications, tone: 'text-parchment-100' },
    { label: t('admin.assigned'), value: assigned, tone: 'text-moss-500' },
    { label: t('admin.unassigned'), value: unassigned, tone: 'text-sky-400' },
    { label: t('admin.availableSlots'), value: availableSlots, tone: 'text-gold-300' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="dashboard-card px-3.5 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-parchment-400 mb-0.5">{card.label}</p>
          <p className={`text-xl sm:text-2xl font-semibold tabular-nums ${card.tone}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
