'use client';

import { useEffect, useRef } from 'react';
import { GEAR_LEVELS, tierMeta } from '@/lib/gearData';

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
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${slotLabel} ${mode} level selector`}
    >
      <div
        className="w-full sm:max-w-sm max-h-[85vh] sm:max-h-[80vh] rounded-t-md sm:rounded-md border border-stone-700 bg-stone-900 flex flex-col"
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

        <div className="overflow-y-auto scrollbar-thin flex flex-col">
          {GEAR_LEVELS.map((level) => {
            const meta = tierMeta(level.tier);
            const isSelected = level.id === selectedId;
            return (
              <button
                key={level.id}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                onClick={() => {
                  onSelect(level.id);
                  onClose();
                }}
                aria-pressed={isSelected}
                className={`focus-ring flex items-center justify-between gap-2 px-4 py-2.5 text-left border-b border-stone-800 transition-colors ${
                  isSelected ? `${meta.bg}` : 'hover:bg-stone-800/60'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${meta.dot}`} aria-hidden />
                  <span className={`text-sm font-medium truncate ${meta.text}`}>{level.label}</span>
                </span>
                {isSelected && (
                  <span className={`shrink-0 ${meta.text}`} aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
