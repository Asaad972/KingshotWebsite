'use client';

import { useI18n } from '@/lib/i18n';
import ScreenshotUploadCard from './ScreenshotUploadCard';
import SelectedSlotChips from './SelectedSlotChips';
import type { CastleSlot } from '@/types';

interface ApplicationSidebarProps {
  playerName: string;
  onChangeName: (v: string) => void;
  fieldErrors: { name?: boolean; main?: boolean; resources?: boolean };
  folderId: string;
  mainScreenshotPath: string | null;
  resourcesScreenshotPath: string | null;
  onUploadedMain: (path: string) => void;
  onUploadedResources: (path: string) => void;
  onRemoveMain: () => void;
  onRemoveResources: () => void;
  selectedSlots: CastleSlot[];
  onRemoveSlot: (slotId: string) => void;
  formError: string | null;
  submitting: boolean;
  onSubmit: () => void;
}

export default function ApplicationSidebar({
  playerName,
  onChangeName,
  fieldErrors,
  folderId,
  mainScreenshotPath,
  resourcesScreenshotPath,
  onUploadedMain,
  onUploadedResources,
  onRemoveMain,
  onRemoveResources,
  selectedSlots,
  onRemoveSlot,
  formError,
  submitting,
  onSubmit,
}: ApplicationSidebarProps) {
  const { t } = useI18n();

  const missing: string[] = [];
  if (!playerName.trim()) missing.push(t('booking.playerName'));
  if (selectedSlots.length === 0) missing.push(t('booking.selectTitle'));
  if (!mainScreenshotPath) missing.push(t('booking.uploadMainTitle'));
  if (!resourcesScreenshotPath) missing.push(t('booking.uploadResourcesTitle'));

  const canSubmit = missing.length === 0;

  return (
    <div className="dashboard-card p-3.5 sm:sticky sm:top-4 flex flex-col gap-3.5">
      <h2 className="text-sm font-semibold text-parchment-100">{t('booking.applicationTitle')}</h2>

      <div className="flex flex-col gap-3">
        <Field
          label={t('booking.playerName')}
          value={playerName}
          error={fieldErrors.name}
          onChange={onChangeName}
          required
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {folderId && (
          <>
            <ScreenshotUploadCard
              title={t('booking.uploadMainTitle')}
              applicationFolderId={folderId}
              fileKey="main"
              storagePath={mainScreenshotPath}
              onUploaded={onUploadedMain}
              onRemove={onRemoveMain}
              error={fieldErrors.main ? t('booking.uploadRequired') : undefined}
            />
            <ScreenshotUploadCard
              title={t('booking.uploadResourcesTitle')}
              applicationFolderId={folderId}
              fileKey="resources"
              storagePath={resourcesScreenshotPath}
              onUploaded={onUploadedResources}
              onRemove={onRemoveResources}
              error={fieldErrors.resources ? t('booking.uploadRequired') : undefined}
            />
          </>
        )}
      </div>

      <SelectedSlotChips slots={selectedSlots} onRemove={onRemoveSlot} />

      {!canSubmit && (
        <div className="rounded border border-stone-700 bg-stone-950 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1.5">
            {t('booking.whatsMissing')}
          </p>
          <ul className="space-y-1">
            {missing.map((m) => (
              <li key={m} className="text-xs text-parchment-300 flex items-center gap-1.5">
                <span className="text-ember-500" aria-hidden>
                  ✗
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {formError && (
        <div className="rounded border border-ember-600/50 bg-ember-500/10 px-3 py-2 text-xs text-ember-500">
          {formError}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
      >
        {submitting ? t('booking.submitting') : t('booking.submit')}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-parchment-300 mb-1 block">
        {label} {required && <span className="text-gold-400">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`focus-ring w-full rounded border bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 ${
          error ? 'border-ember-600' : 'border-stone-700 focus:border-gold-600'
        }`}
      />
    </label>
  );
}
