'use client';

import { PetFoodIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon, ChestIcon } from './PetIcons';

const MATERIALS = [
  { id: 'petFood' as const, label: 'Pet Food', Icon: PetFoodIcon },
  { id: 'growthManual' as const, label: 'Growth Manual', Icon: GrowthManualIcon },
  { id: 'nutrientPotion' as const, label: 'Nutrient Potion', Icon: NutrientPotionIcon },
  { id: 'promotionMedallion' as const, label: 'Promotion Medallion', Icon: PromotionMedallionIcon },
];

/** Pure inputs, side by side -- materials plus chests owned in one grid, so
 * everything you can type in lives in one place. What it adds up to (Need/
 * Missing, chest recommendation) lives in the results sidebar instead,
 * mirroring the Building Planner's input-card/sticky-sidebar split. */
export default function PetMaterialsPanel({
  owned,
  onChangeOwned,
  chestsOwned,
  onChangeChestsOwned,
}: {
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
  chestsOwned: number;
  onChangeChestsOwned: (value: number) => void;
}) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-parchment-100">Materials &amp; Chests</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">Enter what you already have -- shortfalls update live on the right.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {MATERIALS.map((m) => (
          <label key={m.id} className="rounded-md border border-stone-700 bg-stone-800 p-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 shrink-0 rounded-lg bg-stone-950 p-1.5">
                <m.Icon />
              </div>
              <p className="text-xs font-semibold text-parchment-100 leading-tight truncate">{m.label}</p>
            </div>
            <input
              type="number"
              min={0}
              value={owned[m.id] || ''}
              onChange={(e) => onChangeOwned(m.id, Math.max(0, Number(e.target.value) || 0))}
              placeholder="0"
              className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
            />
          </label>
        ))}

        <label className="rounded-md border border-gold-600/40 bg-gold-500/[0.06] p-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-stone-950 p-1.5">
              <ChestIcon />
            </div>
            <p className="text-xs font-semibold text-gold-300 leading-tight truncate">Chests I Own</p>
          </div>
          <input
            type="number"
            min={0}
            value={chestsOwned || ''}
            onChange={(e) => onChangeChestsOwned(Math.max(0, Number(e.target.value) || 0))}
            placeholder="0"
            className="focus-ring w-full rounded border border-gold-600/40 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
          />
        </label>
      </div>
    </div>
  );
}
