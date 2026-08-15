'use client';

import { useI18n } from '@/lib/i18n';
import { formatUtcTime } from '@/lib/slots';

interface AdminSlotCellProps {
  slotId: string;
  startTimeUtc: string;
  status: 'available' | 'pending' | 'booked' | 'past';
  requestCount: number;
  acceptedPlayerName?: string | null;
  onOpen: (slotId: string) => void;
}

export default function AdminSlotCell({
  slotId,
  startTimeUtc,
  status,
  requestCount,
  acceptedPlayerName,
  onOpen,
}: AdminSlotCellProps) {
  const { t } = useI18n();
  const time = formatUtcTime(startTimeUtc);
  const clickable = status === 'booked' || (status !== 'past' && requestCount > 0);

  let stateClasses = 'border-stone-800 bg-stone-900/40 text-parchment-500';
  if (status === 'booked') {
    stateClasses = 'border-gold-600/50 bg-gold-500/10 text-gold-200 shadow-[0_0_12px_-3px_rgba(236,72,153,0.4)]';
  } else if (status === 'past') {
    stateClasses = 'border-stone-800 bg-stone-900/20 text-parchment-500/40 opacity-60';
  } else if (requestCount > 0) {
    stateClasses =
      'border-sky-500/40 bg-sky-500/[0.08] text-parchment-100 hover:border-sky-400/70 shadow-[0_0_10px_-3px_rgba(59,130,246,0.35)] hover:shadow-[0_0_14px_-2px_rgba(95,168,245,0.5)]';
  } else {
    stateClasses = 'border-stone-700 bg-stone-900/50 text-parchment-400 hover:border-gold-600/40';
  }

  return (
    <button
      type="button"
      onClick={() => clickable && onOpen(slotId)}
      disabled={!clickable}
      className={`focus-ring flex flex-col items-center justify-center gap-1 rounded border px-1.5 py-2.5 text-center transition-colors ${stateClasses} ${
        clickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <span className="font-mono text-[13px] font-semibold tabular-nums leading-none">{time}</span>
      {status === 'booked' ? (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-gold-300 truncate max-w-full">
          {acceptedPlayerName}
        </span>
      ) : status === 'past' ? (
        <span className="text-[9px] uppercase tracking-wide">{t('slotStatus.past')}</span>
      ) : requestCount > 0 ? (
        <span className="text-[9px] font-semibold text-sky-400">
          {requestCount} {requestCount === 1 ? t('admin.request') : t('admin.requests')}
        </span>
      ) : (
        <span className="text-[9px] uppercase tracking-wide">{t('slotStatus.available')}</span>
      )}
    </button>
  );
}
