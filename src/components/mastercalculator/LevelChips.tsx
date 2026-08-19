'use client';

/** Row of quick-jump level chips under a LevelSlider -- same pattern used by
 * the Affinity/Research planners and the Pet Calculator, pulled out here
 * since Skills/Talent now use it twice each (Current + Target). Chips in
 * `milestoneLevels` get a small dot to flag a real checkpoint (e.g. a skill
 * level where the Affinity gate steps up), same idea as the spec's
 * "milestone markers" for Affinity. */
export default function LevelChips({
  levels,
  value,
  disabledBelow,
  onSelect,
  tone = 'gold',
  milestoneLevels,
  milestoneNotes,
}: {
  levels: number[];
  value: number;
  disabledBelow?: number;
  onSelect: (v: number) => void;
  tone?: 'gold' | 'cyan';
  milestoneLevels?: number[];
  /** Per-level tooltip text for a milestone dot, e.g. "Lv.5 needs Affinity 80". */
  milestoneNotes?: Record<number, string>;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {levels.map((m) => {
        const disabled = disabledBelow !== undefined && m < disabledBelow;
        const active = value === m;
        const isMilestone = milestoneLevels?.includes(m);
        return (
          <button
            key={m}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(m)}
            title={isMilestone ? milestoneNotes?.[m] : undefined}
            className={`focus-ring relative rounded px-2.5 py-1.5 text-xs font-semibold transition-colors min-h-[32px] min-w-[32px] ${
              disabled
                ? 'bg-stone-900 border border-stone-800 text-parchment-600 opacity-50 cursor-not-allowed'
                : active
                  ? tone === 'gold'
                    ? 'bg-gold-500 text-stone-950'
                    : 'bg-cyan-500 text-stone-950'
                  : `bg-stone-800 border border-stone-700 text-parchment-400 ${tone === 'gold' ? 'hover:border-gold-600' : 'hover:border-cyan-600'}`
            }`}
          >
            {m}
            {isMilestone && !disabled && (
              <span
                className={`absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full ${active ? 'bg-stone-950' : 'bg-ember-500'}`}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
