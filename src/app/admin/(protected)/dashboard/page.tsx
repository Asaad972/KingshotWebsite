'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import AdminStats from '@/components/AdminStats';
import AdminSlotGrid, { type DashboardSlot } from '@/components/AdminSlotGrid';
import ApplicantDrawer from '@/components/ApplicantDrawer';
import { isSlotInPast } from '@/lib/slots';

interface DashboardStats {
  total_applications: number;
  assigned_count: number;
  unassigned_count: number;
  available_slots_count: number;
}

interface DashboardMeta {
  slot_duration_minutes: number;
  lock_past_slots: boolean;
}

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [slots, setSlots] = useState<DashboardSlot[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [meta, setMeta] = useState<DashboardMeta>({ slot_duration_minutes: 30, lock_past_slots: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setSlots(data.slots || []);
      setStats(data.stats || null);
      if (data.settings) setMeta(data.settings);
      setError(null);
    } catch {
      setError(t('errors.genericServer'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
    // Keep the board fresh so a second admin sees acceptances quickly.
    const id = setInterval(load, 20_000);
    return () => clearInterval(id);
  }, [load]);

  const slotsWithPast: DashboardSlot[] = slots.map((slot) => ({
    ...slot,
    status:
      meta.lock_past_slots && isSlotInPast(slot.start_time_utc, meta.slot_duration_minutes) && slot.status !== 'booked'
        ? 'past'
        : slot.status,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="section-title">{t('admin.overviewTitle')}</h1>
        <UTCClock variant="compact" />
      </div>

      {error && (
        <div className="mb-4 rounded border border-ember-600/50 bg-ember-500/10 px-3 py-2 text-sm text-ember-500">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-parchment-400 py-16 text-center">{t('common.loading')}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {stats && (
            <AdminStats
              totalApplications={stats.total_applications}
              assigned={stats.assigned_count}
              unassigned={stats.unassigned_count}
              availableSlots={stats.available_slots_count}
            />
          )}

          <div>
            <h2 className="text-sm font-semibold text-parchment-100 mb-2.5">{t('admin.castleSchedule')}</h2>
            <AdminSlotGrid slots={slotsWithPast} onOpenSlot={setOpenSlotId} />
          </div>
        </div>
      )}

      <ApplicantDrawer slotId={openSlotId} onClose={() => setOpenSlotId(null)} onChanged={load} />
    </div>
  );
}
