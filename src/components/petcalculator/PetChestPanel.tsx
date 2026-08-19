'use client';

import { CHEST_YIELD, type ChestRecommendation } from '@/lib/petCalc';
import { ChestIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const MATERIAL_META = {
  growthManual: { label: 'Growth Manuals', Icon: GrowthManualIcon },
  nutrientPotion: { label: 'Nutrient Potions', Icon: NutrientPotionIcon },
  promotionMedallion: { label: 'Promotion Medallions', Icon: PromotionMedallionIcon },
};

/** Recommended chest allocation for the current shortfall -- the "chests
 * I own" input itself lives in PetMaterialsPanel now, alongside the other
 * material inputs. */
export default function PetChestPanel({ recommendation }: { recommendation: ChestRecommendation }) {
  const short = recommendation.extraChestsNeeded > 0;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-stone-950 p-1.5">
          <ChestIcon />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-parchment-100">Chest Use</h2>
          <p className="text-[10px] text-parchment-400">
            1 chest = {CHEST_YIELD.growthManual} Manuals, {CHEST_YIELD.nutrientPotion} Potions, or {CHEST_YIELD.promotionMedallion} Medallion.
          </p>
        </div>
      </div>

      {recommendation.breakdown.length === 0 ? (
        <p className="text-xs text-parchment-500">Nothing missing that chests can cover yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {recommendation.breakdown.map((row) => {
            const meta = MATERIAL_META[row.material];
            return (
              <div key={row.material} className="rounded-md border border-stone-700 bg-stone-800 p-2 flex items-center gap-2 text-xs">
                <span className="font-bold text-parchment-100 tabular-nums shrink-0">{row.chests}×</span>
                <span className="h-5 w-5 shrink-0">
                  <ChestIcon />
                </span>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-parchment-600">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="h-5 w-5 shrink-0">
                  <meta.Icon />
                </span>
                <span className="text-gold-300 font-semibold tabular-nums truncate">
                  {row.amount.toLocaleString()} {meta.label}
                </span>
              </div>
            );
          })}

          <div
            className={`rounded-md px-2.5 py-2 text-xs font-semibold ${short ? 'bg-ember-500/15 text-ember-500' : 'bg-moss-500/15 text-moss-500'}`}
          >
            {short ? (
              <span>Extra Chests Needed: {recommendation.extraChestsNeeded}</span>
            ) : (
              <span>
                Used {recommendation.chestsUsed} / {recommendation.chestsUsed + recommendation.chestsRemaining} -- {recommendation.chestsRemaining} left
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
