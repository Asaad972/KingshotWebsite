'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { formatUtcWeekdayDate, getUtcDateKey } from '@/lib/slots';
import AdminSlotCell from './AdminSlotCell';

export interface DashboardSlot {
  slot_id: string;
  slot_index: number;
  start_time_utc: string;
  status: 'available' | 'pending' | 'booked' | 'past';
  request_count: number;
  request_names: string[];
  accepted_player_name: string | null;
  accepted_alliance: string | null;
}

export default function AdminSlotGrid({ slots, onOpenSlot }: { slots: DashboardSlot[]; onOpenSlot: (slotId: string) => void }) {
  const { locale } = useI18n();

  const groups = useMemo(() => {
    const byDate = new Map<string, DashboardSlot[]>();
    for (const slot of slots) {
      const key = getUtcDateKey(slot.start_time_utc);
      if (!byDate.has(key)) byDate.set(key, []);
      byDate.get(key)!.push(slot);
    }
    return Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [slots]);

  return (
    <div className="space-y-5">
      {groups.map(([dateKey, dateSlots]) => (
        <div key={dateKey}>
          <p className="mb-2 label-eyebrow sticky top-0 bg-stone-950 py-1 z-10">
            {formatUtcWeekdayDate(`${dateKey}T00:00:00.000Z`, locale ?? 'en')}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {dateSlots.map((slot) => (
              <AdminSlotCell
                key={slot.slot_id}
                slotId={slot.slot_id}
                startTimeUtc={slot.start_time_utc}
                status={slot.status}
                requestCount={slot.request_count}
                acceptedPlayerName={slot.accepted_player_name}
                onOpen={onOpenSlot}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
