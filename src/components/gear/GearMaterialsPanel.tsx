'use client';

import { MATERIALS } from '@/lib/gearData';
import { SatinIcon, ThreadIcon, VisionIcon } from './GearIcons';

const MATERIAL_ICONS: Record<string, React.ReactNode> = {
  satin: <SatinIcon />,
  gildedThreads: <ThreadIcon />,
  artisansVision: <VisionIcon />,
};

export default function GearMaterialsPanel({
  required,
  owned,
  onChangeOwned,
}: {
  required: Record<string, number>;
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  const usedMaterials = MATERIALS.filter((m) => (required[m.id] ?? 0) > 0);

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-parchment-100">Materials</h2>

      {usedMaterials.length === 0 ? (
        <p className="text-xs text-parchment-500">Set a Target above Current on at least one gear piece to see costs.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {usedMaterials.map((m) => {
            const req = required[m.id] ?? 0;
            const own = owned[m.id] ?? 0;
            const needed = Math.max(0, req - own);
            return (
              <div key={m.id} className="rounded-md border border-stone-700 bg-stone-950/60 p-2.5 flex items-center gap-3">
                <div className={`h-10 w-10 shrink-0 rounded-lg p-2 text-stone-950 ${m.dot}`}>
                  {MATERIAL_ICONS[m.id]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-parchment-200 truncate">{m.label}</p>
                  <p className="text-[11px] text-parchment-500">
                    Required <span className="text-parchment-300 tabular-nums">{req.toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <input
                    type="number"
                    min={0}
                    value={own || ''}
                    onChange={(e) => onChangeOwned(m.id, Math.max(0, Number(e.target.value) || 0))}
                    placeholder="Owned"
                    className="focus-ring w-24 rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-parchment-100 text-right tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
                  />
                  <span className={`text-sm font-bold tabular-nums ${needed > 0 ? 'text-ember-500' : 'text-moss-500'}`}>
                    {needed > 0 ? `${needed.toLocaleString()} needed` : 'Ready'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
