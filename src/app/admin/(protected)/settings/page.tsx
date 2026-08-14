'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { EventSettings } from '@/types';

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      const data = await res.json();
      setSettings(data.settings);
      setLoading(false);
    };
    load();
  }, []);

  const patch = async (payload: Partial<EventSettings> & { regenerate?: boolean }) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSettings(data.settings);
        if (data.regenerated && data.regenerated.success === false) {
          setMessage({
            kind: 'error',
            text:
              'Settings saved, but slots were not regenerated because some slots are already booked. Clear bookings first if you need to rebuild the schedule.',
          });
        } else {
          setMessage({ kind: 'success', text: t('admin.settingsSaved') });
        }
      } else {
        setMessage({ kind: 'error', text: data.reason || t('errors.genericServer') });
      }
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className="text-parchment-400 py-16 text-center">{t('common.loading')}</p>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    patch({
      event_name: settings.event_name,
      event_date: settings.event_date,
      start_time_utc: settings.start_time_utc,
      num_slots: settings.num_slots,
      slot_interval_minutes: settings.slot_interval_minutes,
      slot_duration_minutes: settings.slot_duration_minutes,
    });
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-semibold text-parchment-100 mb-5">{t('admin.settingsTitle')}</h1>

      {message && (
        <div
          className={`mb-4 rounded border px-3 py-2 text-sm ${
            message.kind === 'success'
              ? 'border-moss-500/50 bg-moss-500/10 text-moss-500'
              : 'border-ember-600/50 bg-ember-500/10 text-ember-500'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Applications open/closed toggle -- saved immediately, no rebuild. */}
      <div className="dashboard-card p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-parchment-100 text-sm">
              {settings.applications_open ? t('admin.applicationsOpen') : t('admin.applicationsClosed')}
            </p>
            <p className="text-xs text-parchment-400 mt-1">
              {settings.applications_open
                ? t('booking.selectHint')
                : t('booking.applicationsClosedBody')}
            </p>
          </div>
          <button
            onClick={() => patch({ applications_open: !settings.applications_open })}
            disabled={saving}
            className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
              settings.applications_open
                ? 'border border-ember-600/50 text-ember-500 hover:bg-ember-500/10'
                : 'bg-gold-500 text-stone-950 hover:bg-gold-400'
            }`}
          >
            {settings.applications_open ? t('admin.closeApplications') : t('admin.openApplications')}
          </button>
        </div>
      </div>

      {/* Whether slots auto-lock once their time passes -- turn off to open
          applications a day (or more) ahead of the actual appointments. */}
      <div className="dashboard-card p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-parchment-100 text-sm">
              {settings.lock_past_slots ? t('admin.lockPastSlotsEnabledLabel') : t('admin.lockPastSlotsDisabledLabel')}
            </p>
            <p className="text-xs text-parchment-400 mt-1">
              {settings.lock_past_slots ? t('admin.lockPastSlotsEnabledDesc') : t('admin.lockPastSlotsDisabledDesc')}
            </p>
          </div>
          <button
            onClick={() => patch({ lock_past_slots: !settings.lock_past_slots })}
            disabled={saving}
            className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
              settings.lock_past_slots
                ? 'bg-gold-500 text-stone-950 hover:bg-gold-400'
                : 'border border-sky-500/50 text-sky-400 hover:bg-sky-500/10'
            }`}
          >
            {settings.lock_past_slots ? t('admin.lockPastSlotsDisableButton') : t('admin.lockPastSlotsEnableButton')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="dashboard-card p-4 space-y-3.5">
        <Field
          label={t('admin.eventName')}
          value={settings.event_name}
          onChange={(v) => setSettings({ ...settings, event_name: v })}
        />
        <Field
          label={t('admin.eventDate')}
          type="date"
          value={settings.event_date}
          onChange={(v) => setSettings({ ...settings, event_date: v })}
        />
        <Field
          label={t('admin.startTimeUtc')}
          type="time"
          value={settings.start_time_utc}
          onChange={(v) => setSettings({ ...settings, start_time_utc: v })}
        />
        <div className="grid sm:grid-cols-3 gap-4">
          <Field
            label={t('admin.numSlots')}
            type="number"
            value={String(settings.num_slots)}
            onChange={(v) => setSettings({ ...settings, num_slots: Number(v) })}
          />
          <Field
            label={t('admin.slotInterval')}
            type="number"
            value={String(settings.slot_interval_minutes)}
            onChange={(v) => setSettings({ ...settings, slot_interval_minutes: Number(v) })}
          />
          <Field
            label={t('admin.slotDuration')}
            type="number"
            value={String(settings.slot_duration_minutes)}
            onChange={(v) => setSettings({ ...settings, slot_duration_minutes: Number(v) })}
          />
        </div>

        <p className="text-xs text-parchment-400 leading-relaxed">
          Changing the date, start time, slot count or interval rebuilds the whole slot grid. This is blocked
          automatically if any slot is already booked.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
        >
          {saving ? t('common.loading') : t('common.save')}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-parchment-300 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
      />
    </label>
  );
}
