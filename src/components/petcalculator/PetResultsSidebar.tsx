'use client';

import { PetFoodIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const MATERIALS = [
  { id: 'petFood' as const, label: 'Pet Food', Icon: PetFoodIcon },
  { id: 'growthManual' as const, label: 'Growth Manual', Icon: GrowthManualIcon },
  { id: 'nutrientPotion' as const, label: 'Nutrient Potion', Icon: NutrientPotionIcon },
  { id: 'promotionMedallion' as const, label: 'Promotion Medallion', Icon: PromotionMedallionIcon },
];

/** Combined Required/Have/Missing per material -- the results half of the
 * Materials & Chests input panel, kept separate and sticky so it's visible
 * while scrolling through pet cards, mirroring the Building Planner's
 * PlanTotalsSidebar. */
export default function PetResultsSidebar({ required, owned }: { required: Record<string, number>; owned: Record<string, number> }) {
  const hasAnyRequired = Object.values(required).some((v) => v > 0);

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <h2 className="card-title">Live Results</h2>

      {!hasAnyRequired ? (
        <p className="text-xs text-parchment-500">Pick a pet and a target level below to see what's needed.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {MATERIALS.map((m) => {
            const req = required[m.id] ?? 0;
            if (req === 0) return null;
            const own = owned[m.id] ?? 0;
            const needed = Math.max(0, req - own);
            const ready = needed === 0;
            return (
              <div key={m.id} className="rounded-md border border-stone-700 bg-stone-800 p-2.5 flex items-center gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-stone-950 p-1.5">
                  <m.Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-parchment-100 truncate">{m.label}</p>
                  <p className="text-[11px] text-parchment-500">Need {req.toLocaleString()}</p>
                </div>
                <div className="text-xs font-semibold tabular-nums shrink-0 text-right">
                  {ready ? <span className="text-moss-500">Enough ✓</span> : <span className="text-ember-500">Missing {needed.toLocaleString()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
