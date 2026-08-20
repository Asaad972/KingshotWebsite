'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';

/** Shared tutorial for finding Construction Speed / Research Speed --
 * same 2 in-game screenshots explain both, since they live on the same
 * Bonus Overview screen (user-provided, real screenshots). Used by
 * ConstructionSpeedBuffsCard and ResearchSpeedBuffsCard so the "how do I
 * find this number" question only needs answering once. */
export default function BonusOverviewHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-md sm:rounded-md border border-stone-700 bg-stone-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title">{t('speedBuffs.helpTitle')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
          >
            {t('common.close')}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-parchment-300">
              <span className="text-gold-300 font-semibold">{t('speedBuffs.helpStep1')}</span> -- {t('speedBuffs.helpStep1Body')}
            </p>
            <div className="relative w-full aspect-[7/2] rounded-md overflow-hidden border border-stone-700 bg-stone-950">
              <Image src="/tutorials/bonus-overview-step1.png" alt={t('speedBuffs.helpStep1Body')} fill sizes="400px" className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-parchment-300">
              <span className="text-gold-300 font-semibold">{t('speedBuffs.helpStep2')}</span> -- {t('speedBuffs.helpStep2Body')}
            </p>
            <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border border-stone-700 bg-stone-950">
              <Image src="/tutorials/bonus-overview-step2.png" alt={t('speedBuffs.helpStep2Body')} fill sizes="400px" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
