'use client';

import { PetFoodIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const MATERIALS = [
  { id: 'petFood' as const, label: 'Pet Food', Icon: PetFoodIcon },
  { id: 'growthManual' as const, label: 'Growth Manual', Icon: GrowthManualIcon },
  { id: 'nutrientPotion' as const, label: 'Nutrient Potion', Icon: NutrientPotionIcon },
  { id: 'promotionMedallion' as const, label: 'Promotion Medallion', Icon: PromotionMedallionIcon },
];

/** Same Required/I Have/Still Need pattern as the Gear/Charm Calculators'
 * GearMaterialsPanel -- one shared inventory across every added pet, since
 * these materials are account-wide, not pet-specific stockpiles. */
export default function PetMaterialsPanel({
  required,
  owned,
  onChangeOwned,
}: {
  required: Record<string, number>;
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-parchment-100">Total Materials Needed</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">Enter what you already have -- we'll tell you how much more you need, combined across every pet above.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {MATERIALS.map((m) => {
          const req = required[m.id] ?? 0;
          const own = owned[m.id] ?? 0;
          const needed = Math.max(0, req - own);
          const extra = Math.max(0, own - req);
          const ready = needed === 0;
          return (
            <div key={m.id} className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-stone-950 p-2">
                  <m.Icon />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-parchment-100 truncate">{m.label}</p>
                  <p className="text-xs text-parchment-400">
                    Need <span className="text-gold-300 font-bold text-sm tabular-nums">{req.toLocaleString()}</span> total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-parchment-400 shrink-0" htmlFor={`pet-owned-${m.id}`}>
                  I have:
                </label>
                <input
                  id={`pet-owned-${m.id}`}
                  type="number"
                  min={0}
                  value={own || ''}
                  onChange={(e) => onChangeOwned(m.id, Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  className="focus-ring flex-1 min-w-0 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
                />
              </div>
              {req === 0 ? (
                <div className="rounded px-2.5 py-2 text-sm font-semibold text-center bg-stone-700/40 text-parchment-500">
                  Not needed for your current picks{extra > 0 ? ` (${extra.toLocaleString()} banked)` : ''}
                </div>
              ) : (
                <div
                  className={`rounded px-2.5 py-2 text-sm font-semibold text-center ${
                    ready ? 'bg-moss-500/15 text-moss-500' : 'bg-ember-500/15 text-ember-500'
                  }`}
                >
                  {ready
                    ? extra > 0
                      ? `You're ready ✓ (+${extra.toLocaleString()} extra)`
                      : "You're ready ✓"
                    : `Need ${needed.toLocaleString()} more`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
