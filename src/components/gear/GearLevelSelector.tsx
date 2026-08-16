'use client';

import { useEffect } from 'react';
import { GEAR_LEVELS, TIER_DISPLAY_ORDER, tierMeta } from '@/lib/gearData';

export default function GearLevelSelector({
  slotLabel,
  mode,
  selectedId,
  onSelect,
  onClose,
}: {
  slotLabel: string;
  mode: 'current' | 'target';
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${slotLabel} ${mode} level selector`}
    >
      <div
        className="w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] rounded-t-md sm:rounded-md border border-stone-700 bg-stone-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-700 shrink-0">
          <h2 className="text-sm font-semibold text-parchment-100">
            {slotLabel} — {mode === 'current' ? 'Current' : 'Target'} Level
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring rounded h-7 w-7 flex items-center justify-center text-parchment-400 hover:text-parchment-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4">
          {TIER_DISPLAY_ORDER.map((tier) => {
            const levels = GEAR_LEVELS.filter((l) => l.tier === tier);
            if (levels.length === 0) return null;
            const meta = tierMeta(tier);

            return (
              <div key={tier}>
                <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 ${meta.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
                  {meta.label}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {levels.map((level) => {
                    const isSelected = level.id === selectedId;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => {
                          onSelect(level.id);
                          onClose();
                        }}
                        aria-pressed={isSelected}
                        className={`focus-ring rounded border px-2 py-2.5 text-center transition-colors min-h-[44px] ${meta.border} ${
                          isSelected ? `${meta.bg} ring-2 ${meta.ring}` : 'bg-stone-950 hover:bg-stone-800'
                        }`}
                      >
                        <span className={`block text-xs font-semibold ${meta.text}`}>{level.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
