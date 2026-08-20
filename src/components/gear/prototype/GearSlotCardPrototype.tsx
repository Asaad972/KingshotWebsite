'use client';

import { useState } from 'react';
import { getGearLevel, tierMeta, type GearSlotId, type GearTier } from '@/lib/gearData';
import { imageForTierStars } from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';
import GearVisualPicker from './GearVisualPicker';
import ScreenshotDetectFlow from './ScreenshotDetectFlow';

type PickerTarget = 'current' | 'target' | null;

/** PROTOTYPE -- new Current/Target picker for exactly one gear piece (Coat),
 * tested side by side with the other 5 pieces' existing dropdown-based
 * GearSlotCard before deciding whether to roll it out everywhere. Wired
 * into the real selections/onSelectLevel state, so it's a genuine
 * apples-to-apples comparison, not a disconnected mockup -- the underlying
 * cost calculation (calcGearPlan) is untouched either way. */
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
  const [currentChoiceOpen, setCurrentChoiceOpen] = useState(false);

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
    setCurrentChoiceOpen(false);
  };

  return (
    <div className="dashboard-card p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-parchment-100">{label}</p>
        <span className="chip !border-sky-500/40 !text-sky-300 text-[10px]">Prototype</span>
      </div>

      {/* Current -> Target, the whole point made visible at a glance */}
      <div className="flex items-center justify-center gap-3 py-1">
        <button type="button" onClick={() => setCurrentChoiceOpen(true)} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          <ClippedGearImage src={currentImage ?? '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp'} alt="Current" size={72} className={!currentImage ? 'opacity-30' : ''} />
          <span className="text-[11px] font-semibold text-parchment-300">{summaryLabel(current)}</span>
        </button>

        <span className="text-xl text-gold-500/70 shrink-0">→</span>

        <button type="button" onClick={() => setPicker('target')} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          <ClippedGearImage src={targetImage ?? '/gear/pieces/infantry-1/infantry_gear_1_green_t0_s0.webp'} alt="Target" size={72} className={!targetImage ? 'opacity-30' : ''} />
          <span className="text-[11px] font-semibold text-cyan-300">{summaryLabel(target)}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCurrentChoiceOpen(true)}
          className="focus-ring rounded-md border border-stone-700 bg-stone-800 py-2 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
        >
          Set Current
        </button>
        <button
          type="button"
          onClick={() => setPicker('target')}
          className="focus-ring rounded-md border border-stone-700 bg-stone-800 py-2 text-xs font-semibold text-parchment-200 hover:border-cyan-500/60 transition-colors"
        >
          Set Target
        </button>
      </div>

      {/* Choice sheet for Current: screenshot vs manual */}
      {currentChoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4" onClick={() => setCurrentChoiceOpen(false)}>
          <div
            className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border border-stone-700 bg-stone-900 p-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="card-title">Set Current Gear</h3>
              <button
                type="button"
                onClick={() => setCurrentChoiceOpen(false)}
                className="focus-ring rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
              >
                Close
              </button>
            </div>
            <ScreenshotDetectFlow onConfirm={(tier, stars) => confirmLevel('current', tier, stars)} onCancel={() => setCurrentChoiceOpen(false)} />
            <div className="flex items-center gap-2 text-[11px] text-parchment-500 my-1">
              <div className="h-px flex-1 bg-stone-700" />
              or
              <div className="h-px flex-1 bg-stone-700" />
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentChoiceOpen(false);
                setPicker('current');
              }}
              className="focus-ring rounded-md border border-stone-700 bg-stone-800 py-2 text-sm font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
            >
              Choose manually instead
            </button>
          </div>
        </div>
      )}

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
