'use client';

import { useI18n } from '@/lib/i18n';
import { formatUtcTimeRange, isSlotActiveNow } from '@/lib/slots';

interface ScheduleSlotCellProps {
  startTimeUtc: string;
  status: 'available' | 'pending' | 'booked' | 'past';
  slotDurationMinutes: number;
  acceptedPlayerName?: string | null;
}

export default function ScheduleSlotCell({
  startTimeUtc,
  status,
  slotDurationMinutes,
  acceptedPlayerName,
}: ScheduleSlotCellProps) {
  const { t } = useI18n();
  const range = formatUtcTimeRange(startTimeUtc, slotDurationMinutes);
  const active = isSlotActiveNow(startTimeUtc, slotDurationMinutes);

  let stateClasses = 'border-stone-700 bg-stone-900 text-parchment-200';
  if (status === 'booked') {
    stateClasses = 'border-gold-600 bg-gold-500/10 text-gold-200 shadow-[0_0_12px_-3px_rgba(236,72,153,0.4)]';
  } else if (status === 'past') {
    stateClasses = 'border-stone-800 bg-stone-900/20 text-parchment-500/40 opacity-60';
  }

  if (active && status !== 'past') {
    stateClasses += ' ring-2 ring-moss-500/70 shadow-[0_0_12px_-2px_rgba(63,174,114,0.5)]';
  }

  return (
    <div
      title={status === 'booked' && acceptedPlayerName ? acceptedPlayerName : `${range} UTC`}
      className={`flex flex-col items-center justify-center gap-0.5 rounded border px-1 py-3 text-center ${stateClasses}`}
    >
      <span className="font-mono text-[12px] font-semibold tabular-nums leading-none">{range}</span>
      {status === 'booked' ? (
        <span className="text-[9px] font-semibold text-gold-300 truncate max-w-full">
          {acceptedPlayerName}
        </span>
      ) : status === 'past' ? (
        <span className="text-[9px] uppercase tracking-wide">{t('slotStatus.past')}</span>
      ) : active ? (
        <span className="text-[9px] uppercase tracking-wide text-moss-500">{t('schedule.active')}</span>
      ) : null}
    </div>
  );
}
