'use client';

import { useEffect, useRef, useState } from 'react';
import { CHARM_LEVELS, getCharmLevel } from '@/lib/charmData';

interface Position {
  top: number;
  left: number;
  width: number;
}

/** Same anchored-dropdown pattern as GearLevelDropdown (kept as a separate,
 * duplicated component so this feature stays independently removable) --
 * simpler here since charm levels have no tiers, just a flat 1-22 list. */
export default function CharmLevelDropdown({
  label,
  levelId,
  onSelect,
}: {
  label: string;
  levelId: string;
  onSelect: (levelId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const level = getCharmLevel(levelId);

  const openDropdown = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelWidth = Math.max(rect.width, 140);
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - panelWidth - 8);
    setPosition({ top: rect.bottom + 4, left, width: panelWidth });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const close = () => setOpen(false);

    document.addEventListener('pointerdown', onDocPointerDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useEffect(() => {
    if (open) selectedRef.current?.scrollIntoView({ block: 'center' });
  }, [open]);

  return (
    <div>
      <span className="text-[9px] uppercase tracking-wide text-parchment-500" aria-hidden>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${level?.label ?? 'Base'}`}
        className={`focus-ring w-full flex items-center justify-between gap-1 rounded border border-stone-700 bg-stone-950 px-1.5 py-1 text-[11px] font-medium hover:border-gold-600 transition-colors min-h-[28px] ${
          level && level.id !== 'base' ? 'text-cyan-300' : 'text-parchment-300'
        }`}
      >
        <span className="truncate">{level?.label ?? 'Base'}</span>
        <span className="text-parchment-500 shrink-0" aria-hidden>
          ▾
        </span>
      </button>

      {open && position && (
        <div
          ref={panelRef}
          role="listbox"
          className="fixed z-50 rounded-md border border-stone-700 bg-stone-900 shadow-lg overflow-y-auto scrollbar-thin"
          style={{ top: position.top, left: position.left, width: position.width, maxHeight: 'min(60vh, 340px)' }}
        >
          {CHARM_LEVELS.map((l) => {
            const isSelected = l.id === levelId;
            return (
              <button
                key={l.id}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelect(l.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left border-b border-stone-800 last:border-b-0 transition-colors ${
                  isSelected ? 'bg-cyan-500/10' : 'hover:bg-stone-800/60'
                }`}
              >
                <span className={`text-xs font-medium truncate ${isSelected ? 'text-cyan-300' : 'text-parchment-300'}`}>
                  {l.label}
                </span>
                {isSelected && (
                  <span className="shrink-0 text-xs text-cyan-300" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
