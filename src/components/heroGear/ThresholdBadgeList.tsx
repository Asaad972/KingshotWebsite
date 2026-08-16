'use client';

import { STAT_LABELS, THRESHOLDS, type ThresholdVariant } from '@/lib/heroGearData';

// Positional colors (slot 0-4), matching the reference site's milestone
// badges -- achieved (level reached) gets its color, locked stays muted.
const ACHIEVED_COLORS = ['#2f9e44', '#0f6674', '#5b3a9e', '#6b6b2a', '#7a2331'];

export default function ThresholdBadgeList({ level, variant }: { level: number; variant: ThresholdVariant }) {
  const thresholds = THRESHOLDS[variant];
  return (
    <div className="flex flex-col gap-1.5">
      {thresholds.map((t, i) => {
        const achieved = level >= t.level;
        return (
          <div
            key={`${t.level}-${t.stat}`}
            className={`rounded-md px-2.5 py-1.5 text-center ${achieved ? '' : 'bg-stone-800 border border-stone-700'}`}
            style={achieved ? { backgroundColor: ACHIEVED_COLORS[i] } : undefined}
          >
            <p className={`text-xs font-bold ${achieved ? 'text-white' : 'text-parchment-500'}`}>
              {STAT_LABELS[t.stat]} +{t.value}%
            </p>
            <p className={`text-[10px] ${achieved ? 'text-white/70' : 'text-parchment-600'}`}>Lv.{t.level}</p>
          </div>
        );
      })}
    </div>
  );
}
