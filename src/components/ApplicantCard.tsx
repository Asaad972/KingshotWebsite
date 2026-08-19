'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { formatUtcTime } from '@/lib/slots';
import type { Application } from '@/types';

export interface Applicant {
  application_slot_id: string;
  application: Application;
  main_screenshot_signed_url: string | null;
  resources_screenshot_signed_url: string | null;
  other_requested_times: string[];
}

interface ApplicantCardProps {
  applicant: Applicant;
  busy: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function ApplicantCard({ applicant, busy, onAccept, onReject }: ApplicantCardProps) {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { application } = applicant;

  const totalRequested = applicant.other_requested_times.length + 1;

  return (
    <div className="dashboard-card p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <h3 className="card-title">{application.player_name}</h3>
      </div>
      <p className="text-xs text-parchment-400 mb-3">
        {t('booking.selectedCount', { count: totalRequested })}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Screenshot
          label={t('booking.uploadMainTitle')}
          url={applicant.main_screenshot_signed_url}
          onOpen={setLightbox}
          viewLabel={t('admin.viewFullSize')}
        />
        <Screenshot
          label={t('booking.uploadResourcesTitle')}
          url={applicant.resources_screenshot_signed_url}
          onOpen={setLightbox}
          viewLabel={t('admin.viewFullSize')}
        />
      </div>

      {applicant.other_requested_times.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-parchment-400 mb-1.5">{t('admin.otherAvailability')}</p>
          <div className="flex flex-wrap gap-1.5">
            {applicant.other_requested_times.map((time) => (
              <span key={time} className="chip !text-parchment-300 !border-stone-600 !bg-stone-800/60">
                {formatUtcTime(time)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={onAccept}
          disabled={busy}
          className="focus-ring flex-1 rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
        >
          {t('admin.acceptPlayer')}
        </button>
        <button
          onClick={onReject}
          disabled={busy}
          className="focus-ring flex-1 rounded-md border border-ember-600/50 py-2 text-sm text-ember-500 hover:bg-ember-500/10 transition-colors disabled:opacity-60"
        >
          {t('admin.reject')}
        </button>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded object-contain" />
          <button
            onClick={() => setLightbox(null)}
            className="focus-ring absolute top-4 end-4 rounded bg-stone-900 border border-stone-700 px-3 py-1.5 text-sm text-parchment-100"
          >
            {t('common.close')}
          </button>
        </div>
      )}
    </div>
  );
}

function Screenshot({
  label,
  url,
  onOpen,
  viewLabel,
}: {
  label: string;
  url: string | null;
  onOpen: (url: string) => void;
  viewLabel: string;
}) {
  return (
    <div>
      <p className="text-xs text-parchment-400 mb-1.5">{label}</p>
      {url ? (
        <button
          onClick={() => onOpen(url)}
          className="focus-ring block w-full overflow-hidden rounded border border-stone-700 hover:border-gold-600 transition-colors"
          title={viewLabel}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={label} className="h-24 w-full object-cover" />
        </button>
      ) : (
        <div className="h-24 rounded border border-dashed border-stone-700 bg-stone-800/40 flex items-center justify-center text-xs text-parchment-500">
          —
        </div>
      )}
    </div>
  );
}
