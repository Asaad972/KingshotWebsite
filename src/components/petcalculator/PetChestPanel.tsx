'use client';

import { CHEST_YIELD, type ChestRecommendation } from '@/lib/petCalc';
import { ChestIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const MATERIAL_META = {
  growthManual: { label: 'Growth Manuals', Icon: GrowthManualIcon },
  nutrientPotion: { label: 'Nutrient Potions', Icon: NutrientPotionIcon },
  promotionMedallion: { label: 'Promotion Medallions', Icon: PromotionMedallionIcon },
};

export default function PetChestPanel({
  chestsOwned,
  onChangeChestsOwned,
  recommendation,
}: {
  chestsOwned: number;
  onChangeChestsOwned: (value: number) => void;
  recommendation: ChestRecommendation;
}) {
  const short = recommendation.extraChestsNeeded > 0;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-950 p-1.5">
          <ChestIcon />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-parchment-100">Custom Pet Advancement Chests</h2>
          <p className="text-[11px] text-parchment-400">
            1 chest = {CHEST_YIELD.growthManual} Growth Manuals, or {CHEST_YIELD.nutrientPotion} Nutrient Potions, or {CHEST_YIELD.promotionMedallion} Promotion Medallion. Pet Food isn't covered.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2">
        <span className="text-xs text-parchment-400 shrink-0">Chests I own:</span>
        <input
          type="number"
          min={0}
          value={chestsOwned || ''}
          onChange={(e) => onChangeChestsOwned(Math.max(0, Number(e.target.value) || 0))}
          placeholder="0"
          className="focus-ring w-28 rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
        />
      </label>

      {recommendation.breakdown.length === 0 ? (
        <p className="text-xs text-parchment-500">Nothing missing that chests can cover yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold text-parchment-400 uppercase tracking-wide">Recommended Chest Use</p>

          <div className="flex flex-col gap-2">
            {recommendation.breakdown.map((row) => {
              const meta = MATERIAL_META[row.material];
              return (
                <div
                  key={row.material}
                  className="rounded-md border border-stone-700 bg-stone-800 p-3 flex items-center gap-3"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-stone-950 p-1.5">
                      <ChestIcon />
                    </div>
                    <span className="text-lg font-bold text-parchment-100 tabular-nums">{row.chests}</span>
                  </div>

                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-parchment-600">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-lg bg-stone-950 p-1.5">
                      <meta.Icon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gold-300 tabular-nums leading-tight">{row.amount.toLocaleString()}</p>
                      <p className="text-[11px] text-parchment-400 truncate">{meta.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-md px-3 py-2.5 flex items-center justify-between gap-3 text-sm font-semibold ${
              short ? 'bg-ember-500/15 text-ember-500' : 'bg-moss-500/15 text-moss-500'
            }`}
          >
            {short ? (
              <span>Extra Chests Needed: {recommendation.extraChestsNeeded}</span>
            ) : (
              <>
                <span>
                  Chests Used: <span className="tabular-nums">{recommendation.chestsUsed}</span> /{' '}
                  <span className="tabular-nums">{recommendation.chestsUsed + recommendation.chestsRemaining}</span>
                </span>
                <span>
                  Remaining: <span className="tabular-nums">{recommendation.chestsRemaining}</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
