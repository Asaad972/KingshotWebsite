'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  bullets?: string[];
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  open,
  title,
  bullets = [],
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full sm:max-w-md rounded-t-md sm:rounded-md border border-stone-700 bg-stone-900 p-5">
        <h3 className="card-title mb-3">{title}</h3>

        {bullets.length > 0 && (
          <ul className="space-y-1.5 mb-5 text-sm text-parchment-300">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-gold-400 mt-0.5" aria-hidden>
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="focus-ring flex-1 rounded-md border border-stone-600 py-2 text-sm text-parchment-200 hover:border-gold-600 transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="focus-ring flex-1 rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
          >
            {loading ? t('common.loading') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
