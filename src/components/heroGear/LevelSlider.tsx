'use client';

import { useId } from 'react';

const SNAP_TOLERANCE = 2;

/** Plain native range slider -- far easier to use than typing an exact 0-200
 * number or scrolling a long dropdown list. min/max are enforced natively by
 * the browser, which is how "Target can't go below Current" is enforced
 * here: the Target slider's own `min` prop is set to the Current value.
 *
 * `snapPoints` (e.g. the 120/140/160/180/200 milestone levels) get a
 * <datalist> tick mark AND a magnetic snap: dragging within a few units of
 * one locks the value to it exactly, since browsers don't reliably do this
 * on their own with just a datalist. */
export default function LevelSlider({
  label,
  value,
  min,
  max,
  onChange,
  tone = 'gold',
  snapPoints,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  tone?: 'gold' | 'cyan';
  snapPoints?: number[];
}) {
  const datalistId = useId();
  const range = max - min || 1;
  const pct = ((value - min) / range) * 100;
  const fillColor = tone === 'gold' ? '#d4a94a' : '#22d3ee';
  const accentClass = tone === 'gold' ? 'accent-gold-500' : 'accent-cyan-400';
  const relevantSnaps = snapPoints?.filter((p) => p >= min && p <= max);

  const handleChange = (raw: number) => {
    const nearest = relevantSnaps?.find((p) => Math.abs(p - raw) <= SNAP_TOLERANCE);
    onChange(nearest ?? raw);
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-parchment-500">{label}</span>
        <span className="text-sm font-bold text-parchment-100 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        list={relevantSnaps?.length ? datalistId : undefined}
        onChange={(e) => handleChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${accentClass}`}
        style={{
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, #292524 ${pct}%, #292524 100%)`,
        }}
      />
      {relevantSnaps && relevantSnaps.length > 0 && (
        <datalist id={datalistId}>
          {relevantSnaps.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      )}
    </div>
  );
}
