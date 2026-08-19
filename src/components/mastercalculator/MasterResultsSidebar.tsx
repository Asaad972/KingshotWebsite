'use client';

import { EmblemIcon, ManuscriptIcon, LearningXpIcon } from './MasterIcons';

const MATERIALS = [
  { id: 'emblems' as const, label: 'Master Emblems', Icon: EmblemIcon },
  { id: 'manuscripts' as const, label: "Master's Manuscripts", Icon: ManuscriptIcon },
  { id: 'learningXp' as const, label: 'Learning XP', Icon: LearningXpIcon },
];

/** Combined Required/Have/Missing per material -- the results half of the
 * Materials panel, sticky so it stays visible while scrolling through the
 * Affinity/Talent/Skills/Research planners below. */
export default function MasterResultsSidebar({
  masterName,
  selections,
  required,
  owned,
}: {
  masterName: string | null;
  selections: { label: string; current: number; target: number }[];
  required: Record<string, number>;
  owned: Record<string, number>;
}) {
  const hasAnyRequired = Object.values(required).some((v) => v > 0);
  const activeSelections = selections.filter((s) => s.target > s.current);

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <h2 className="card-title">{masterName ? `${masterName} Upgrade Plan` : 'Live Results'}</h2>

      {activeSelections.length > 0 && (
        <div className="flex flex-col gap-1 pb-1 border-b border-stone-700">
          {activeSelections.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="text-parchment-400">{s.label}</span>
              <span className="text-parchment-100 font-semibold tabular-nums">
                {s.current} <span className="text-parchment-600">→</span> {s.target}
              </span>
            </div>
          ))}
        </div>
      )}

      {!hasAnyRequired ? (
        <p className="text-xs text-parchment-500">Pick a master and set targets below to see what's needed.</p>
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
