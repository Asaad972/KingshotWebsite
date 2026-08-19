'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import ScheduleSlotCell from '@/components/ScheduleSlotCell';
import { isSlotInPast } from '@/lib/slots';
import type { CastleSlot, EventSettings } from '@/types';

interface ScheduleSlot extends CastleSlot {
  accepted_player_name?: string | null;
  accepted_alliance?: string | null;
}

export default function SchedulePage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/schedule', { cache: 'no-store' });
        const data = await res.json();
        setSettings(data.settings);
        setSlots(data.slots || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const durationMinutes = settings?.slot_duration_minutes ?? 30;
  const lockPastSlots = settings?.lock_past_slots ?? true;

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-8">
      <h1 className="section-title mb-4">{t('schedule.title')}</h1>

      <div className="flex justify-center mb-5">
        <UTCClock />
      </div>

      {loading ? (
        <p className="text-center text-parchment-400 py-16">{t('common.loading')}</p>
      ) : slots.length === 0 ? (
        <p className="text-center text-parchment-400 py-16">{t('schedule.empty')}</p>
      ) : (
        <div className="dashboard-card p-2.5">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
            {slots.map((slot) => {
              const past = lockPastSlots && isSlotInPast(slot.start_time_utc, durationMinutes);
              return (
                <ScheduleSlotCell
                  key={slot.slot_id}
                  startTimeUtc={slot.start_time_utc}
                  status={past && slot.status !== 'booked' ? 'past' : slot.status}
                  slotDurationMinutes={durationMinutes}
                  acceptedPlayerName={slot.accepted_player_name}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
