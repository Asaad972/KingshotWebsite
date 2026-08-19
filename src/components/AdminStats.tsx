'use client';

import { useI18n } from '@/lib/i18n';
import StatCard, { type StatCardTone } from '@/components/ui/StatCard';

interface AdminStatsProps {
  totalApplications: number;
  assigned: number;
  unassigned: number;
  availableSlots: number;
}

export default function AdminStats({ totalApplications, assigned, unassigned, availableSlots }: AdminStatsProps) {
  const { t } = useI18n();

  const cards: { label: string; value: number; tone: StatCardTone }[] = [
    { label: t('admin.totalApplications'), value: totalApplications, tone: 'neutral' },
    { label: t('admin.assigned'), value: assigned, tone: 'moss' },
    { label: t('admin.unassigned'), value: unassigned, tone: 'sky' },
    { label: t('admin.availableSlots'), value: availableSlots, tone: 'gold' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
      ))}
    </div>
  );
}
