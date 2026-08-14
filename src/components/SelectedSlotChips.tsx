'use client';

import { useI18n } from '@/lib/i18n';
import { formatUtcTime } from '@/lib/slots';
import type { CastleSlot } from '@/types';

export default function SelectedSlotChips({ slots, onRemove }: { slots: CastleSlot[]; onRemove?: (slotId: string) => void }) {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-2">
        {t('booking.selectedTimesTitle')} ({slots.length})
      </p>
      {slots.length === 0 ? (
        <p className="text-sm text-parchment-500">—</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {slots.map((slot) => (
            <button
              key={slot.slot_id}
              type="button"
              onClick={() => onRemove?.(slot.slot_id)}
              className="chip hover:border-ember-500/50 hover:text-ember-500 transition-colors"
              title={onRemove ? t('booking.uploadRemove') : undefined}
            >
              {formatUtcTime(slot.start_time_utc)}
              {onRemove && <span aria-hidden>×</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
