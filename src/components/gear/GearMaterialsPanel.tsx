'use client';

import { MATERIALS, tierMeta } from '@/lib/gearData';

export default function GearMaterialsPanel({
  required,
  coins,
  owned,
  onChangeOwned,
}: {
  required: Record<string, number>;
  coins: number;
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  const usedMaterials = MATERIALS.filter((m) => (required[m.id] ?? 0) > 0);

  return (
    <div className="dashboard-card p-3 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-parchment-100">Materials</h2>

      {usedMaterials.length === 0 ? (
        <p className="text-xs text-parchment-500">Set a Target above Current on at least one gear piece to see costs.</p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 text-[10px] uppercase tracking-wide text-parchment-500 px-0.5">
            <span>Material</span>
            <span className="text-right w-14">Required</span>
            <span className="text-right w-16">Owned</span>
            <span className="text-right w-16">Needed</span>
          </div>
          {usedMaterials.map((m) => {
            const req = required[m.id] ?? 0;
            const own = owned[m.id] ?? 0;
            const needed = Math.max(0, req - own);
            const meta = tierMeta(m.tier);
            return (
              <div key={m.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center">
                <span className={`text-xs font-medium truncate flex items-center gap-1.5 ${meta.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${meta.dot}`} aria-hidden />
                  {m.label}
                </span>
                <span className="text-xs text-parchment-300 text-right w-14 tabular-nums">{req.toLocaleString()}</span>
                <input
                  type="number"
                  min={0}
                  value={own || ''}
                  onChange={(e) => onChangeOwned(m.id, Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  className="focus-ring w-16 rounded border border-stone-700 bg-stone-950 px-1.5 py-1 text-xs text-parchment-100 text-right tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
                />
                <span className={`text-xs text-right w-16 tabular-nums font-semibold ${needed > 0 ? 'text-ember-500' : 'text-moss-500'}`}>
                  {needed.toLocaleString()}
                </span>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-800">
            <span className="text-xs text-parchment-400">Total Coins</span>
            <span className="text-sm font-semibold text-gold-300 tabular-nums">{coins.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
