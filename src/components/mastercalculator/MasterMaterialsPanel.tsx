'use client';

import { EmblemIcon, ManuscriptIcon, LearningXpIcon } from './MasterIcons';

const MATERIALS = [
  { id: 'emblems' as const, label: 'Master Emblems', Icon: EmblemIcon },
  { id: 'manuscripts' as const, label: "Master's Manuscripts", Icon: ManuscriptIcon },
  { id: 'learningXp' as const, label: 'Learning XP', Icon: LearningXpIcon },
];

/** Pure inputs, mirroring the Pet Calculator's Materials & Chests panel --
 * what it adds up to (Need/Missing) lives in the results sidebar instead. */
export default function MasterMaterialsPanel({
  owned,
  onChangeOwned,
}: {
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div>
        <h2 className="card-title">Your Materials</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">Enter what you already have -- shortfalls update live on the right.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
      </div>
    </div>
  );
}
