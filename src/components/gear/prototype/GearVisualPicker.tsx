'use client';

import { useEffect, useState } from 'react';
import { tierMeta, getGearLevel, type GearTier } from '@/lib/gearData';
import {
  GEAR_COLOR_ORDER,
  GEAR_COLOR_LABEL,
  tiersForColor,
  starsForTier,
  imageForTierStars,
  type GearColorId,
} from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';

type Step = 'color' | 'tier' | 'stars';

function orderOf(tier: GearTier, stars: number): number {
  return getGearLevel(`${tier}-${stars}`)?.order ?? 0;
}

/** Highest real order reachable anywhere inside this color/tier -- used to
 * decide whether the whole step is worth entering at all (its best combo
 * still has to clear the floor) vs. just individual stars within it. */
function bestOrderForColor(color: GearColorId): number {
  let best = 0;
  for (const { tier } of tiersForColor(color)) {
    for (const s of starsForTier(tier)) best = Math.max(best, orderOf(tier, s));
  }
  return best;
}

function bestOrderForTier(tier: GearTier): number {
  let best = 0;
  for (const s of starsForTier(tier)) best = Math.max(best, orderOf(tier, s));
  return best;
}

/** Step-by-step visual picker -- Color, then Stage, then Stars -- instead of
 * one long dropdown of 57 options. Every choice shown actually has a real
 * screenshot behind it (tiersForColor/starsForTier), so e.g. Green only
 * offers 0-1 stars instead of implying a fourth star that was never real
 * for that tier. `minOrder` mirrors GearLevelDropdown's own prop: Target
 * can't be set below Current, so combos under that real GearLevel.order
 * show disabled rather than just vanishing. */
export default function GearVisualPicker({
  title,
  minOrder = 0,
  onConfirm,
  onClose,
}: {
  title: string;
  minOrder?: number;
  onConfirm: (tier: GearTier, stars: number) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>('color');
  const [color, setColor] = useState<GearColorId | null>(null);
  const [tier, setTier] = useState<GearTier | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const goBack = () => setStep(step === 'stars' ? 'tier' : 'color');

  const goColor = (c: GearColorId) => {
    setColor(c);
    setTier(null);
    setStep('tier');
  };

  const goTier = (t: GearTier) => {
    setTier(t);
    setStep('stars');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-sm max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-stone-700 bg-stone-900 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {step !== 'color' && (
              <button
                type="button"
                onClick={goBack}
                className="focus-ring rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-gold-600"
              >
                ←
              </button>
            )}
            <h3 className="card-title">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-4 text-xs text-parchment-500">
          <span className={step === 'color' ? 'text-gold-300 font-semibold' : ''}>1. Color</span>
          <span>→</span>
          <span className={step === 'tier' ? 'text-gold-300 font-semibold' : ''}>2. Stage</span>
          <span>→</span>
          <span className={step === 'stars' ? 'text-gold-300 font-semibold' : ''}>3. Stars</span>
        </div>

        {step === 'color' && (
          <div className="grid grid-cols-3 gap-2.5">
            {GEAR_COLOR_ORDER.map((c) => {
              const sampleTier = tiersForColor(c)[0]?.tier;
              const sampleStars = sampleTier ? starsForTier(sampleTier)[0] : undefined;
              const img = sampleTier != null && sampleStars != null ? imageForTierStars(sampleTier, sampleStars) : undefined;
              const disabled = bestOrderForColor(c) < minOrder;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={disabled}
                  onClick={() => goColor(c)}
                  className={`focus-ring flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-colors ${
                    disabled
                      ? 'border-stone-800 bg-stone-900 opacity-40 cursor-not-allowed'
                      : 'border-stone-700 bg-stone-800 hover:border-gold-600'
                  }`}
                >
                  {img && <ClippedGearImage src={img} alt={GEAR_COLOR_LABEL[c]} size={56} />}
                  <span className="text-xs font-semibold text-parchment-200">{GEAR_COLOR_LABEL[c]}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'tier' && color && (
          <div className="grid grid-cols-3 gap-2.5">
            {tiersForColor(color).map(({ tier: t }) => {
              const s0 = starsForTier(t)[0];
              const img = s0 != null ? imageForTierStars(t, s0) : undefined;
              const meta = tierMeta(t);
              const disabled = bestOrderForTier(t) < minOrder;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={disabled}
                  onClick={() => goTier(t)}
                  className={`focus-ring flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-colors ${
                    disabled
                      ? 'border-stone-800 bg-stone-900 opacity-40 cursor-not-allowed'
                      : 'border-stone-700 bg-stone-800 hover:border-gold-600'
                  }`}
                >
                  {img && <ClippedGearImage src={img} alt={meta.label} size={56} />}
                  <span className={`text-xs font-semibold ${disabled ? 'text-parchment-600' : meta.text}`}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'stars' && tier && (
          <div className="grid grid-cols-2 gap-2.5">
            {starsForTier(tier).map((s) => {
              const img = imageForTierStars(tier, s);
              const meta = tierMeta(tier);
              const disabled = orderOf(tier, s) < minOrder;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => onConfirm(tier, s)}
                  className={`focus-ring flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors ${
                    disabled
                      ? 'border-stone-800 bg-stone-900 opacity-40 cursor-not-allowed'
                      : 'border-stone-700 bg-stone-800 hover:border-gold-600'
                  }`}
                >
                  {img && <ClippedGearImage src={img} alt={`${meta.label} ${s} star`} size={84} />}
                  <span className={`text-xs font-semibold ${disabled ? 'text-parchment-600' : meta.text}`}>
                    {meta.label} {s > 0 ? '★'.repeat(s) : '(no stars)'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
