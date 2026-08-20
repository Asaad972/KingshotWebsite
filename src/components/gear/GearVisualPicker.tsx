'use client';

import { useEffect, useState } from 'react';
import { tierMeta, getGearLevel, type GearSlotId, type GearTier } from '@/lib/gearData';
import { GEAR_COLOR_ORDER, GEAR_COLOR_LABEL, tiersForColor, starsForTier, type GearColorId } from '@/lib/gearPieceImages';
import GearTierThumb from './GearTierThumb';

type Step = 'color' | 'tier' | 'stars' | 'combo';

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
 * one long dropdown of 57 options. Every choice shown is a real GearLevel
 * (tiersForColor/starsForTier are driven by the actual cost table, not
 * guessed), so e.g. Green only offers 0-1 stars instead of implying a
 * fourth star that never existed for that tier. `minOrder` mirrors
 * GearLevelDropdown's own prop: Target can't be set below Current, so
 * combos under that real GearLevel.order show disabled rather than just
 * vanishing. */
export default function GearVisualPicker({
  slotId,
  icon,
  title,
  minOrder = 0,
  onConfirm,
  onClose,
}: {
  slotId: GearSlotId;
  icon: React.ReactNode;
  title: string;
  minOrder?: number;
  onConfirm: (tier: GearTier, stars: number) => void;
  onClose: () => void;
}) {
  // Testing a 2-tap version (Color -> one combined Stage+Stars grid) on
  // Coat only, since that's the one piece with real photos to judge it
  // against -- everything else keeps the original 3-step flow for now.
  const combinedGrid = slotId === 'coat';

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
    setStep(combinedGrid ? 'combo' : 'tier');
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
          {combinedGrid ? (
            <span className={step === 'combo' ? 'text-gold-300 font-semibold' : ''}>2. Stage &amp; Stars</span>
          ) : (
            <>
              <span className={step === 'tier' ? 'text-gold-300 font-semibold' : ''}>2. Stage</span>
              <span>→</span>
              <span className={step === 'stars' ? 'text-gold-300 font-semibold' : ''}>3. Stars</span>
            </>
          )}
        </div>

        {step === 'color' && (
          <div className="grid grid-cols-3 gap-2.5">
            {GEAR_COLOR_ORDER.map((c) => {
              const sampleTier = tiersForColor(c)[0]?.tier;
              const sampleStars = sampleTier ? starsForTier(sampleTier)[0] : undefined;
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
                  {sampleTier != null && sampleStars != null && (
                    <GearTierThumb slotId={slotId} icon={icon} tier={sampleTier} stars={sampleStars} size={56} />
                  )}
                  <span className="text-xs font-semibold text-parchment-200">{GEAR_COLOR_LABEL[c]}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'combo' && color && (
          <div className="flex flex-col gap-3.5">
            {tiersForColor(color).map(({ tier: t }) => {
              const meta = tierMeta(t);
              return (
                <div key={t} className="flex flex-col gap-1.5">
                  <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {starsForTier(t).map((s) => {
                      const disabled = orderOf(t, s) < minOrder;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={disabled}
                          onClick={() => onConfirm(t, s)}
                          className={`focus-ring flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors ${
                            disabled
                              ? 'border-stone-800 bg-stone-900 opacity-40 cursor-not-allowed'
                              : 'border-stone-700 bg-stone-800 hover:border-gold-600'
                          }`}
                        >
                          <GearTierThumb slotId={slotId} icon={icon} tier={t} stars={s} size={64} />
                          <span className={`text-[10px] font-semibold ${disabled ? 'text-parchment-600' : 'text-parchment-300'}`}>
                            {s > 0 ? '★'.repeat(s) : 'No stars'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 'tier' && color && (
          <div className="grid grid-cols-3 gap-2.5">
            {tiersForColor(color).map(({ tier: t }) => {
              const s0 = starsForTier(t)[0];
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
                  {s0 != null && <GearTierThumb slotId={slotId} icon={icon} tier={t} stars={s0} size={56} />}
                  <span className={`text-xs font-semibold ${disabled ? 'text-parchment-600' : meta.text}`}>{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'stars' && tier && (
          <div className="grid grid-cols-2 gap-2.5">
            {starsForTier(tier).map((s) => {
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
                  <GearTierThumb slotId={slotId} icon={icon} tier={tier} stars={s} size={84} />
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
