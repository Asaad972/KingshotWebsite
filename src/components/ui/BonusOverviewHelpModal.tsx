'use client';

import { useEffect } from 'react';
import Image from 'next/image';

/** Shared tutorial for finding Construction Speed / Research Speed --
 * same 2 in-game screenshots explain both, since they live on the same
 * Bonus Overview screen (user-provided, real screenshots). Used by
 * ConstructionSpeedBuffsCard and ResearchSpeedBuffsCard so the "how do I
 * find this number" question only needs answering once. */
export default function BonusOverviewHelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
          <h3 className="card-title">Where to find Construction/Research Speed</h3>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-parchment-300">
              <span className="text-gold-300 font-semibold">Step 1</span> -- tap your Gold count in the top-left of the main screen to open your profile.
            </p>
            <div className="relative w-full aspect-[7/2] rounded-md overflow-hidden border border-stone-700 bg-stone-950">
              <Image src="/tutorials/bonus-overview-step1.png" alt="Tap your Gold count to open your profile" fill sizes="400px" className="object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-parchment-300">
              <span className="text-gold-300 font-semibold">Step 2</span> -- open Bonus Overview, then scroll to the Growth section -- Construction Speed and Research Speed are both listed there.
            </p>
            <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border border-stone-700 bg-stone-950">
              <Image src="/tutorials/bonus-overview-step2.png" alt="Growth section showing Construction Speed and Research Speed" fill sizes="400px" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
