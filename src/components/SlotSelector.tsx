'use client';

import { useI18n } from '@/lib/i18n';
import CastleSlotCard from './CastleSlotCard';
import { isSlotActiveNow } from '@/lib/slots';
import type { CastleSlot } from '@/types';

interface SlotSelectorProps {
  slots: CastleSlot[];
  selectedIds: Set<string>;
  slotDurationMinutes: number;
  onToggle: (slotId: string) => void;
  onClearAll: () => void;
  onSelectAllAvailable: () => void;
}

export default function SlotSelector({
  slots,
  selectedIds,
  slotDurationMinutes,
  onToggle,
  onClearAll,
  onSelectAllAvailable,
}: SlotSelectorProps) {
  const { t } = useI18n();

  return (
    <div>
      <div className="rounded border-l-2 border-gold-600 bg-stone-900 px-3 py-2 mb-3 text-sm text-parchment-200">
        {t('booking.selectHint')}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-parchment-100">{t('booking.selectTitle')}</h2>
          <span className="chip">{t('booking.selectedCount', { count: selectedIds.size })}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onSelectAllAvailable}
            className="focus-ring rounded border border-stone-600 px-2.5 py-1 text-parchment-300 hover:border-gold-600 hover:text-gold-200 transition-colors"
          >
            {t('booking.selectAllAvailable')}
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={selectedIds.size === 0}
            className="focus-ring rounded border border-stone-600 px-2.5 py-1 text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {t('booking.clearAll')}
          </button>
        </div>
      </div>

      {slots.length === 0 ? (
        <p className="text-parchment-400 text-sm py-8 text-center">{t('booking.noSlots')}</p>
      ) : (
        <div className="dashboard-card p-2.5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
            {slots.map((slot) => (
              <CastleSlotCard
                key={slot.slot_id}
                startTimeUtc={slot.start_time_utc}
                status={slot.status}
                selected={selectedIds.has(slot.slot_id)}
                active={isSlotActiveNow(slot.start_time_utc, slotDurationMinutes)}
                slotDurationMinutes={slotDurationMinutes}
                onToggle={() => (slot.status === 'available' || slot.status === 'pending') && onToggle(slot.slot_id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
