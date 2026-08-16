'use client';

import { useEffect, useRef, useState } from 'react';

/** Save/load named snapshots of a calculator's state, generic over the
 * shape T. Auto-save (useLocalStorageState) already keeps you from losing
 * work on refresh -- this is for keeping several distinct named setups
 * (e.g. one per player) side by side. */
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
  const [name, setName] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const names = Object.keys(profiles);

  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    setName('');
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="focus-ring flex items-center gap-1.5 rounded border border-stone-700 px-3 py-1.5 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
      >
        Profiles
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-64 rounded-md border border-stone-700 bg-stone-900 shadow-lg p-3 flex flex-col gap-2.5">
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
