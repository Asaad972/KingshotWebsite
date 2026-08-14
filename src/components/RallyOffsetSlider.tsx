'use client';

import { RALLY_OFFSET_MIN, RALLY_OFFSET_MAX, clampRallyOffset } from '@/lib/rally';

interface RallyOffsetSliderProps {
  value: number;
  /** Absolute set, e.g. from dragging the slider directly. */
  onChange: (v: number) => void;
  /** Relative nudge, e.g. from the −/+ buttons. Applied against the latest state, not this render's `value`. */
  onStep: (delta: number) => void;
}

export default function RallyOffsetSlider({ value, onChange, onStep }: RallyOffsetSliderProps) {
  const label = value === 0 ? 'Same time as previous' : value > 0 ? `+${value}s after previous` : `${value}s before previous`;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-parchment-400">Timing</span>
        <span className="text-xs font-mono text-gold-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Decrease offset by 1 second"
          className="focus-ring shrink-0 rounded border border-stone-700 h-7 w-7 flex items-center justify-center text-parchment-200 hover:border-gold-600 transition-colors"
        >
          −
        </button>
        <input
          type="range"
          min={RALLY_OFFSET_MIN}
          max={RALLY_OFFSET_MAX}
          step={1}
          value={value}
          onChange={(e) => onChange(clampRallyOffset(Number(e.target.value)))}
          className="w-full accent-gold-500"
          aria-label="Arrival offset in seconds, relative to the previous player"
        />
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Increase offset by 1 second"
          className="focus-ring shrink-0 rounded border border-stone-700 h-7 w-7 flex items-center justify-center text-parchment-200 hover:border-gold-600 transition-colors"
        >
          +
        </button>
      </div>
      <div className="flex justify-between text-[10px] text-parchment-500 mt-0.5">
        <span>← earlier</span>
        <span>later →</span>
      </div>
    </div>
  );
}
