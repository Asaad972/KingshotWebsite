'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useI18n } from '@/lib/i18n';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_SCREENSHOTS_BUCKET || 'screenshots';

interface ScreenshotUploadCardProps {
  title: string;
  applicationFolderId: string;
  fileKey: 'main' | 'resources';
  storagePath: string | null;
  onUploaded: (storagePath: string) => void;
  onRemove: () => void;
  error?: string;
}

export default function ScreenshotUploadCard({
  title,
  applicationFolderId,
  fileKey,
  storagePath,
  onUploaded,
  onRemove,
  error,
}: ScreenshotUploadCardProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const uploadFile = async (file: File) => {
    setLocalError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${applicationFolderId}/${fileKey}.${ext}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });

      if (uploadError) throw uploadError;
      onUploaded(path);
    } catch (err) {
      console.error(err);
      setLocalError(t('common.error'));
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File) => {
    setLocalError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError(t('booking.uploadHint'));
      return;
    }
    lastFileRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
    uploadFile(file);
  };

  // "Uploaded" only reflects a confirmed server-side path -- a local preview
  // existing is not proof the upload actually succeeded.
  const uploaded = Boolean(storagePath) && !uploading;
  const failed = Boolean(localError) && !uploading;
  const hasPreview = Boolean(previewUrl);

  return (
    <div className="dashboard-card p-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {hasPreview ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="focus-ring shrink-0 h-14 w-14 rounded overflow-hidden border border-stone-700 hover:border-gold-600 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl!} alt={title} className="h-full w-full object-cover" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-parchment-100 truncate">{title}</p>
            {uploading ? (
              <p className="text-[11px] text-gold-300 mb-1">{t('common.loading')}</p>
            ) : uploaded ? (
              <p className="text-[11px] text-moss-500 mb-1">✓ {t('booking.uploaded')}</p>
            ) : failed ? (
              <p className="text-[11px] text-ember-500 mb-1">✗ {t('common.error')}</p>
            ) : null}
            <div className="flex items-center gap-3 text-[11px]">
              {failed ? (
                <button
                  type="button"
                  onClick={() => lastFileRef.current && uploadFile(lastFileRef.current)}
                  disabled={uploading}
                  className="focus-ring text-gold-300 hover:text-gold-200 underline underline-offset-2"
                >
                  {t('common.retry')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="focus-ring text-gold-300 hover:text-gold-200 underline underline-offset-2"
                >
                  {t('booking.uploadReplace')}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setLocalError(null);
                  lastFileRef.current = null;
                  onRemove();
                }}
                disabled={uploading}
                className="focus-ring text-ember-500 hover:text-ember-500/80 underline underline-offset-2"
              >
                {t('booking.uploadRemove')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring w-full flex items-center rounded border border-dashed border-stone-600 px-3 py-2.5 text-start text-parchment-300 hover:border-gold-600 transition-colors"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold text-parchment-100 truncate">{title}</span>
            <span className="block text-[11px] text-parchment-400">{t('booking.uploadHint')}</span>
          </span>
        </button>
      )}

      {(localError || error) && <p className="mt-2 text-xs text-ember-500">{localError || error}</p>}

      {lightboxOpen && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={title} className="max-h-full max-w-full rounded object-contain" />
          <button
            onClick={() => setLightboxOpen(false)}
            className="focus-ring absolute top-4 end-4 rounded bg-stone-900 border border-stone-700 px-3 py-1.5 text-sm text-parchment-100"
          >
            {t('common.close')}
          </button>
        </div>
      )}
    </div>
  );
}
