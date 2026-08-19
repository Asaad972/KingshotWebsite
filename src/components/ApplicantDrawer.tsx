'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import ApplicantCard, { type Applicant } from './ApplicantCard';
import ConfirmationModal from './ConfirmationModal';
import { formatUtcDate, formatUtcTime } from '@/lib/slots';
import type { CastleSlot } from '@/types';

export default function ApplicantDrawer({
  slotId,
  onClose,
  onChanged,
  apiBase = '/api',
}: {
  slotId: string | null;
  onClose: () => void;
  onChanged: () => void;
  /** Lets a kingdom-scoped dashboard point this at /api/k/[slug] instead
   * of the legacy /api root, without duplicating this whole component. */
  apiBase?: string;
}) {
  const { t, locale } = useI18n();

  const [slot, setSlot] = useState<CastleSlot | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [pendingAccept, setPendingAccept] = useState<Applicant | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/admin/slot/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setSlot(data.slot);
      setApplicants(data.applicants || []);
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setLoading(false);
    }
  }, [t, apiBase]);

  useEffect(() => {
    if (slotId) load(slotId);
  }, [slotId, load]);

  useEffect(() => {
    if (!slotId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slotId, onClose]);

  if (!slotId) return null;

  const handleAccept = async () => {
    if (!pendingAccept || !slot) return;
    setBusy(true);
    try {
      const res = await fetch(`${apiBase}/applications/${pendingAccept.application.application_id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slot.slot_id }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ kind: 'success', text: t('admin.appointmentConfirmed') });
      } else if (data.reason === 'slot_already_booked') {
        setMessage({ kind: 'error', text: t('errors.slotAlreadyBookedRace') });
      } else if (data.reason === 'already_accepted') {
        setMessage({ kind: 'error', text: t('errors.alreadyAccepted') });
      } else if (data.reason === 'not_an_active_applicant') {
        setMessage({ kind: 'error', text: t('errors.notActiveApplicant') });
      } else {
        setMessage({ kind: 'error', text: t('errors.genericServer') });
      }
      setPendingAccept(null);
      await load(slot.slot_id);
      onChanged();
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (applicant: Applicant) => {
    if (!slot) return;
    setBusy(true);
    try {
      await fetch(`${apiBase}/applications/${applicant.application.application_id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slot.slot_id }),
      });
      await load(slot.slot_id);
      onChanged();
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setBusy(false);
    }
  };

  const slotTime = slot ? formatUtcTime(slot.start_time_utc) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/70">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full sm:w-[440px] sm:max-w-[90vw] max-h-[88vh] sm:max-h-none bg-stone-950 border-t sm:border-t-0 sm:border-s border-stone-700 rounded-t-md sm:rounded-none overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-700 bg-stone-950 px-4 py-3">
          <div>
            {slot && (
              <>
                <h2 className="text-base font-semibold text-parchment-100 tabular-nums">
                  {slotTime} <span className="text-xs text-parchment-400">UTC</span>
                </h2>
                <p className="text-xs text-parchment-400">{formatUtcDate(slot.start_time_utc, locale ?? 'en')}</p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded border border-stone-700 px-2.5 py-1 text-sm text-parchment-300 hover:border-gold-600 hover:text-gold-200 transition-colors"
          >
            {t('admin.closeDrawer')} ✕
          </button>
        </div>

        <div className="px-5 py-4">
          {loading ? (
            <p className="text-parchment-400 py-16 text-center">{t('common.loading')}</p>
          ) : (
            <>
              {slot && (
                <p className="text-sm text-gold-300 mb-3">
                  {applicants.length} {applicants.length === 1 ? t('admin.playerAvailable') : t('admin.playersAvailable')}
                </p>
              )}

              {message && (
                <div
                  className={`mb-3 rounded border px-3 py-2 text-sm ${
                    message.kind === 'success'
                      ? 'border-moss-500/50 bg-moss-500/10 text-moss-500'
                      : 'border-ember-600/50 bg-ember-500/10 text-ember-500'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {slot?.status === 'booked' ? (
                <div className="rounded border border-gold-600/40 bg-gold-500/5 p-5 text-center">
                  <p className="text-base font-semibold text-gold-300">{t('admin.booked')}</p>
                </div>
              ) : applicants.length === 0 ? (
                <p className="text-parchment-400 py-16 text-center">{t('admin.noApplicants')}</p>
              ) : (
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.application_slot_id}
                      applicant={applicant}
                      busy={busy}
                      onAccept={() => setPendingAccept(applicant)}
                      onReject={() => handleReject(applicant)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={Boolean(pendingAccept)}
        loading={busy}
        title={t('admin.confirmAcceptTitle', {
          name: pendingAccept?.application.player_name ?? '',
          time: slotTime,
        })}
        bullets={[
          t('admin.confirmAcceptBody1', { name: pendingAccept?.application.player_name ?? '', time: slotTime }),
          t('admin.confirmAcceptBody2'),
          t('admin.confirmAcceptBody3', { name: pendingAccept?.application.player_name ?? '' }),
        ]}
        confirmLabel={t('admin.confirmButton')}
        onCancel={() => setPendingAccept(null)}
        onConfirm={handleAccept}
      />
    </div>
  );
}
