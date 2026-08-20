'use client';

import { useState } from 'react';
import { getGearLevel, tierMeta, type GearSlotId, type GearTier } from '@/lib/gearData';
import { imageForTierStars } from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';
import GearVisualPicker from './GearVisualPicker';

type PickerTarget = 'current' | 'target' | null;

function UpgradeArrow() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 border border-gold-500/40 shadow-[0_0_12px_rgba(240,180,41,0.15)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold-300">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

/** PROTOTYPE -- new Current/Target picker for exactly one gear piece (Coat),
 * tested side by side with the other 5 pieces' existing dropdown-based
 * GearSlotCard before deciding whether to roll it out everywhere. Wired
 * into the real selections/onSelectLevel state, so it's a genuine
 * apples-to-apples comparison, not a disconnected mockup -- the underlying
 * cost calculation (calcGearPlan) is untouched either way.
 *
 * Tapping either picture opens that side's picker directly -- no separate
 * "Set Current"/"Set Target" buttons, since the arrow between the two
 * pictures already says what each side means. Manual selection only for
 * now -- screenshot detection was pulled (too unreliable without a real
 * trained model) until there's a better approach. */
export default function GearSlotCardPrototype({
  slotId,
  label,
  currentId,
  targetId,
  onSelectLevel,
}: {
  slotId: GearSlotId;
  label: string;
  currentId: string;
  targetId: string;
  onSelectLevel: (slotId: GearSlotId, mode: 'current' | 'target', levelId: string) => void;
}) {
  const [picker, setPicker] = useState<PickerTarget>(null);

  const current = getGearLevel(currentId);
  const target = getGearLevel(targetId);

  const currentImage = current && current.tier !== 'base' ? imageForTierStars(current.tier, current.stars) : undefined;
  const targetImage = target && target.tier !== 'base' ? imageForTierStars(target.tier, target.stars) : undefined;

  const summaryLabel = (lvl: typeof current) => {
    if (!lvl || lvl.tier === 'base') return 'Base';
    const meta = tierMeta(lvl.tier);
    return `${meta.label}${lvl.stars > 0 ? ' ' + '★'.repeat(lvl.stars) : ''}`;
  };

  const confirmLevel = (mode: 'current' | 'target', tier: GearTier, stars: number) => {
    onSelectLevel(slotId, mode, `${tier}-${stars}`);
    setPicker(null);
  };

  return (
    <div className="dashboard-card p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-parchment-100">{label}</p>
        <span className="chip !border-sky-500/40 !text-sky-300 text-[10px]">Prototype</span>
      </div>

      {/* Current -> Target, the whole point made visible at a glance */}
      <div className="flex items-stretch rounded-2xl border border-stone-700 bg-stone-950/50 p-2.5 gap-1">
        <button
          type="button"
          onClick={() => setPicker('current')}
          className="focus-ring flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-gold-500/[0.06] border border-gold-500/20 py-3 hover:bg-gold-500/10 hover:border-gold-500/40 transition-colors"
        >
          <span className="text-[9px] font-semibold uppercase tracking-wide text-gold-400/80">Current</span>
          <ClippedGearImage src={currentImage ?? '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp'} alt="Current" size={72} className={!currentImage ? 'opacity-30' : ''} />
          <span className="text-[11px] font-semibold text-parchment-200">{summaryLabel(current)}</span>
        </button>

        <div className="flex items-center justify-center shrink-0 px-0.5">
          <UpgradeArrow />
        </div>

        <button
          type="button"
          onClick={() => setPicker('target')}
          className="focus-ring flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 py-3 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-colors"
        >
          <span className="text-[9px] font-semibold uppercase tracking-wide text-cyan-400/80">Target</span>
          <ClippedGearImage src={targetImage ?? '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp'} alt="Target" size={72} className={!targetImage ? 'opacity-30' : ''} />
          <span className="text-[11px] font-semibold text-cyan-300">{summaryLabel(target)}</span>
        </button>
      </div>

      {picker === 'current' && (
        <GearVisualPicker title="Current Gear" onConfirm={(tier, stars) => confirmLevel('current', tier, stars)} onClose={() => setPicker(null)} />
      )}
      {picker === 'target' && (
        <GearVisualPicker
          title="Target Gear"
          minOrder={current?.order ?? 0}
          onConfirm={(tier, stars) => confirmLevel('target', tier, stars)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
