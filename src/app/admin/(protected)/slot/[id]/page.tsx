'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import ApplicantCard, { type Applicant } from '@/components/ApplicantCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import { formatUtcDate, formatUtcTime } from '@/lib/slots';
import type { CastleSlot } from '@/types';

export default function AdminSlotReviewPage({ params }: { params: { id: string } }) {
  const { t, locale } = useI18n();

  const [slot, setSlot] = useState<CastleSlot | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [pendingAccept, setPendingAccept] = useState<Applicant | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/slot/${params.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setSlot(data.slot);
      setApplicants(data.applicants || []);
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setLoading(false);
    }
  }, [params.id, t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async () => {
    if (!pendingAccept || !slot) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/applications/${pendingAccept.application.application_id}/accept`, {
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
      await load();
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
      await fetch(`/api/applications/${applicant.application.application_id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slot.slot_id }),
      });
      await load();
    } catch {
      setMessage({ kind: 'error', text: t('errors.genericServer') });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="text-parchment-400 py-16 text-center">{t('common.loading')}</p>;
  }

  const slotTime = slot ? formatUtcTime(slot.start_time_utc) : '';

  return (
    <div>
      <Link
        href="/admin/dashboard"
        className="focus-ring text-sm text-parchment-400 hover:text-gold-300 transition-colors inline-block mb-4"
      >
        ← {t('admin.overviewTitle')}
      </Link>

      {slot && (
        <div className="mb-5">
          <h1 className="section-title tabular-nums">
            {slotTime} <span className="text-sm text-parchment-400">UTC</span>
          </h1>
          <p className="text-sm text-parchment-400">{formatUtcDate(slot.start_time_utc, locale ?? 'en')}</p>
          <p className="text-sm text-gold-300 mt-1.5">
            {applicants.length} {applicants.length === 1 ? t('admin.playerAvailable') : t('admin.playersAvailable')}
          </p>
        </div>
      )}

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

      {slot?.status === 'booked' ? (
        <div className="rounded border border-gold-600/40 bg-gold-500/5 p-5 text-center">
          <p className="text-base font-semibold text-gold-300">{t('admin.booked')}</p>
        </div>
      ) : applicants.length === 0 ? (
        <p className="text-parchment-400 py-16 text-center">{t('admin.noApplicants')}</p>
      ) : (
        <div className="space-y-4">
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
