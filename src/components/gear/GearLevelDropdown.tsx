'use client';

import { useEffect, useRef, useState } from 'react';
import { GEAR_LEVELS, getGearLevel, tierMeta } from '@/lib/gearData';

interface Position {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

/**
 * Custom anchored dropdown -- not a native <select>, because on mobile a
 * native select with 58 options opens the OS's full-screen picker/wheel
 * instead of an inline dropdown. This renders its own small floating panel
 * positioned under the trigger button so it looks/behaves the same on
 * desktop and mobile.
 */
export default function GearLevelDropdown({
  id,
  label,
  levelId,
  onSelect,
  minOrder,
  placeholder,
}: {
  id: string;
  label: string;
  levelId: string;
  onSelect: (levelId: string) => void;
  /** Only show levels at or above this order -- used to stop Target from going below Current. */
  minOrder?: number;
  /** Shown instead of "Base" when levelId doesn't resolve -- used for stateless bulk-select triggers. */
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const level = getGearLevel(levelId);
  const meta = level ? tierMeta(level.tier) : null;
  const options = minOrder != null ? GEAR_LEVELS.filter((l) => l.order >= minOrder) : GEAR_LEVELS;

  const openDropdown = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelWidth = Math.max(rect.width, 200);
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - panelWidth - 8);
    // Flip upward if there isn't enough room below the trigger -- otherwise
    // the panel opens off the bottom of the viewport with no way to see or
    // scroll to the rest of it (it's position:fixed, so page scroll doesn't
    // help), which was the bug for triggers near the page bottom.
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUpward = spaceBelow < 150 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(360, Math.max(120, openUpward ? spaceAbove : spaceBelow));
    setPosition({
      top: openUpward ? undefined : rect.bottom + 4,
      bottom: openUpward ? window.innerHeight - rect.top + 4 : undefined,
      left,
      width: panelWidth,
      maxHeight,
    });
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
    // Capture-phase 'scroll' also fires for scrolling *inside* the panel's own
    // list (scroll doesn't bubble, but capture listeners still see it on the
    // way down) -- ignore those so scrolling the list doesn't close it.
    const onScroll = (e: Event) => {
      if (e.target instanceof Node && panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onDocPointerDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
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
        data-testid={id}
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${level?.label ?? placeholder ?? 'Base'}`}
        className="focus-ring w-full flex items-center justify-between gap-1 rounded border border-stone-700 bg-stone-950 px-2 py-2 text-xs font-medium hover:border-gold-600 transition-colors min-h-[40px]"
      >
        <span className={`truncate ${meta ? meta.text : 'text-parchment-300'}`}>{level?.label ?? placeholder ?? 'Base'}</span>
        <span className="text-parchment-500 shrink-0" aria-hidden>
          ▾
        </span>
      </button>

      {open && position && (
        <div
          ref={panelRef}
          role="listbox"
          className="fixed z-50 rounded-md border border-stone-700 bg-stone-900 shadow-lg overflow-y-auto scrollbar-thin"
          style={{ top: position.top, bottom: position.bottom, left: position.left, width: position.width, maxHeight: position.maxHeight }}
        >
          {options.map((l) => {
            const m = tierMeta(l.tier);
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
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left border-b border-stone-800 last:border-b-0 transition-colors ${
                  isSelected ? m.bg : 'hover:bg-stone-800/60'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${m.dot}`} aria-hidden />
                  <span className={`text-xs font-medium truncate ${m.text}`}>{l.label}</span>
                </span>
                {isSelected && (
                  <span className={`shrink-0 text-xs ${m.text}`} aria-hidden>
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
