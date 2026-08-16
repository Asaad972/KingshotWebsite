'use client';

import { useEffect, useRef, useState } from 'react';

interface Position {
  top: number;
  left: number;
  width: number;
}

/** Save/load named snapshots of a calculator's state, generic over the
 * shape T. Auto-save (useLocalStorageState) already keeps you from losing
 * work on refresh -- this is for keeping several distinct named setups
 * (e.g. one per player) side by side.
 *
 * Uses `position: fixed` with a JS-computed, viewport-clamped position
 * (same pattern as GearLevelDropdown etc.) instead of CSS `absolute right-0`
 * -- the latter clipped off-screen on mobile when the trigger button wasn't
 * near the right edge. */
export default function ProfileBar<T>({
  profiles,
  onLoad,
  onSave,
  onDelete,
}: {
  profiles: Record<string, T>;
  onLoad: (data: T) => void;
  onSave: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [name, setName] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const names = Object.keys(profiles);

  const openPanel = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelWidth = 256;
    const left = Math.min(Math.max(8, rect.right - panelWidth), window.innerWidth - panelWidth - 8);
    setPosition({ top: rect.bottom + 6, left: Math.max(8, left), width: panelWidth });
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

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    setName('');
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-expanded={open}
        className="focus-ring flex items-center gap-1.5 rounded border border-stone-700 px-3 py-1.5 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
      >
        Profiles
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      {open && position && (
        <div
          ref={panelRef}
          className="fixed z-50 rounded-md border border-stone-700 bg-stone-900 shadow-lg p-3 flex flex-col gap-2.5"
          style={{ top: position.top, left: position.left, width: position.width }}
        >
          {names.length === 0 ? (
            <p className="text-xs text-parchment-500">No saved profiles yet.</p>
          ) : (
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto scrollbar-thin">
              {names.map((n) => (
                <div key={n} className="flex items-center gap-1.5 group">
                  <button
                    type="button"
                    onClick={() => {
                      onLoad(profiles[n]);
                      setOpen(false);
                    }}
                    className="focus-ring flex-1 min-w-0 text-left rounded px-2 py-1.5 text-sm text-parchment-200 hover:bg-stone-800 transition-colors truncate"
                  >
                    {n}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(n)}
                    aria-label={`Delete profile ${n}`}
                    className="focus-ring shrink-0 h-6 w-6 flex items-center justify-center rounded text-parchment-600 hover:text-ember-500 hover:bg-stone-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <hr className="border-stone-800" />

          <div>
            <p className="text-xs font-semibold text-parchment-300 mb-1.5">Save Current Profile</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Enter profile name..."
                className="focus-ring flex-1 min-w-0 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-gold-600"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!name.trim()}
                className="focus-ring shrink-0 rounded bg-gold-500 px-3 py-1.5 text-sm font-semibold text-stone-950 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
