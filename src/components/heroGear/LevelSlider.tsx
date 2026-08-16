'use client';

import { useEffect, useState } from 'react';

/** Plain native range slider -- far easier to use than typing an exact 0-200
 * number or scrolling a long dropdown list. min/max are enforced natively by
 * the browser, which is how "Target can't go below Current" is enforced
 * here: the Target slider's own `min` prop is set to the Current value.
 *
 * No magnetic snapping -- milestone levels (120/140/160/180/200) have their
 * own quick-jump chips instead, so the slider stays free to drag to any
 * value without fighting a snap zone.
 *
 * The value next to the label is also a text input -- dragging to an exact
 * number can be fiddly, so typing it directly is the fallback. Uses a local
 * draft so the field can be cleared/edited freely while typing, only
 * clamping and committing on blur/Enter. */
export default function LevelSlider({
  label,
  value,
  min,
  max,
  onChange,
  tone = 'gold',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  tone?: 'gold' | 'cyan';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (!editing) setDraft(String(value));
  }, [value, editing]);

  const commit = () => {
    setEditing(false);
    const parsed = Math.round(Number(draft));
    if (Number.isFinite(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    } else {
      setDraft(String(value));
    }
  };

  const range = max - min || 1;
  const pct = ((value - min) / range) * 100;
  const fillColor = tone === 'gold' ? '#d4a94a' : '#22d3ee';
  const accentClass = tone === 'gold' ? 'accent-gold-500' : 'accent-cyan-400';

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-parchment-500">{label}</span>
        <input
          type="number"
          min={min}
          max={max}
          value={draft}
          onFocus={() => setEditing(true)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          className="focus-ring w-14 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-sm font-bold text-parchment-100 tabular-nums hover:border-stone-700 focus:border-gold-600 focus:bg-stone-950"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${accentClass}`}
        style={{
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, #292524 ${pct}%, #292524 100%)`,
        }}
      />
    </div>
  );
}
