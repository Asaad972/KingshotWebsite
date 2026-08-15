'use client';

import { useI18n } from '@/lib/i18n';
import { formatUtcTimeRange } from '@/lib/slots';
import type { SlotStatus } from '@/types';

interface CastleSlotCardProps {
  startTimeUtc: string;
  status: SlotStatus;
  selected: boolean;
  active?: boolean;
  slotDurationMinutes: number;
  onToggle?: () => void;
}

export default function CastleSlotCard({
  startTimeUtc,
  status,
  selected,
  active,
  slotDurationMinutes,
  onToggle,
}: CastleSlotCardProps) {
  const { t } = useI18n();

  const disabled = status === 'booked' || status === 'past';
  const range = formatUtcTimeRange(startTimeUtc, slotDurationMinutes);

  let stateClasses = 'border-stone-700 bg-stone-900 text-parchment-200 hover:border-gold-600 hover:bg-stone-800';
  if (selected) {
    stateClasses =
      'border-gold-400 bg-gold-500 text-stone-950 font-semibold shadow-[0_0_14px_-2px_rgba(77,132,168,0.55)]';
  } else if (status === 'booked') {
    stateClasses =
      'border-ember-600/30 bg-ember-500/[0.07] text-parchment-400/60 cursor-not-allowed shadow-[0_0_10px_-3px_rgba(226,80,63,0.3)]';
  } else if (status === 'past') {
    stateClasses = 'border-stone-800 bg-stone-900/30 text-parchment-500/50 cursor-not-allowed opacity-60';
  } else if (status === 'pending') {
    stateClasses =
      'border-sky-500/30 bg-sky-500/[0.06] text-parchment-200 hover:border-sky-400/60 hover:bg-sky-500/10 shadow-[0_0_10px_-3px_rgba(59,130,246,0.35)] hover:shadow-[0_0_14px_-2px_rgba(95,168,245,0.5)]';
  }

  if (active && !disabled) {
    stateClasses += ' ring-2 ring-moss-500/70 shadow-[0_0_12px_-2px_rgba(63,174,114,0.5)]';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-pressed={selected}
      title={
        status === 'booked'
          ? t('slotStatus.lockedBooked')
          : status === 'past'
          ? t('slotStatus.past')
          : `${range} UTC`
      }
      className={`focus-ring relative flex items-center justify-center rounded border px-1 py-3 text-center transition-colors ${stateClasses}`}
    >
      {selected && (
        <span className="absolute -top-1.5 -end-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-stone-950 text-[10px] text-gold-300">
          ✓
        </span>
      )}
      {status === 'pending' && !selected && (
        <span className="absolute top-1 end-1 h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
      )}
      <span className="font-mono text-[12px] font-semibold tabular-nums leading-none">{range}</span>
    </button>
  );
}
