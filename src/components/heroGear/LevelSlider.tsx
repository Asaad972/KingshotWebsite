'use client';

/** Plain native range slider -- far easier to use than typing an exact 0-200
 * number or scrolling a long dropdown list. min/max are enforced natively by
 * the browser, which is how "Target can't go below Current" is enforced
 * here: the Target slider's own `min` prop is set to the Current value.
 *
 * No magnetic snapping -- milestone levels (120/140/160/180/200) have their
 * own quick-jump chips instead, so the slider stays free to drag to any
 * value without fighting a snap zone. */
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
  const range = max - min || 1;
  const pct = ((value - min) / range) * 100;
  const fillColor = tone === 'gold' ? '#d4a94a' : '#22d3ee';
  const accentClass = tone === 'gold' ? 'accent-gold-500' : 'accent-cyan-400';

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
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${accentClass}`}
        style={{
          background: `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, #292524 ${pct}%, #292524 100%)`,
        }}
      />
    </div>
  );
}
