'use client';

import { useEffect } from 'react';
import { CHARM_LEVELS } from '@/lib/charmData';
import CharmLevelPlaceholder from './CharmLevelPlaceholder';

/** Charm's version of GearVisualPicker -- but levels are a flat Base..22
 * track with no Color/Stage axis, so it's a single grid instead of a
 * step-by-step flow. `minOrder` mirrors CharmLevelDropdown's own prop:
 * Target can't be set below Current. */
export default function CharmVisualPicker({
  icon,
  title,
  minOrder = 0,
  onConfirm,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  minOrder?: number;
  onConfirm: (levelId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-sm max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-stone-700 bg-stone-900 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="card-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {CHARM_LEVELS.map((lvl) => {
            const disabled = lvl.order < minOrder;
            return (
              <button
                key={lvl.id}
                type="button"
                disabled={disabled}
                onClick={() => onConfirm(lvl.id)}
                className={`focus-ring flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                  disabled
                    ? 'border-stone-800 bg-stone-900 opacity-40 cursor-not-allowed'
                    : 'border-stone-700 bg-stone-800 hover:border-gold-600'
                }`}
              >
                <CharmLevelPlaceholder icon={icon} order={lvl.order} size={56} />
                <span className={`text-[10px] font-semibold ${disabled ? 'text-parchment-600' : 'text-parchment-300'}`}>
                  {lvl.order === 0 ? 'Base' : lvl.order}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
