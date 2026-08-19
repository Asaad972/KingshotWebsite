'use client';

import Image from 'next/image';
import { MATERIALS } from '@/lib/gearData';

// KvK event: raising a gear piece's Score stat earns event points at a fixed rate.
const KVK_POINTS_PER_SCORE = 36;

export default function GearMaterialsPanel({
  required,
  owned,
  onChangeOwned,
  scoreGained,
}: {
  required: Record<string, number>;
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
  scoreGained: number;
}) {
  const kvkPoints = scoreGained * KVK_POINTS_PER_SCORE;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="card-title">Materials</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">Enter what you already have -- we'll tell you how much more you need.</p>
      </div>

      {kvkPoints > 0 && (
        <div className="rounded-md border border-gold-600/40 bg-gold-500/10 p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gold-300">KvK Points</p>
            <p className="text-[11px] text-parchment-400">
              {scoreGained.toLocaleString()} Score × {KVK_POINTS_PER_SCORE}
            </p>
          </div>
          <p className="text-lg font-bold text-gold-300 tabular-nums shrink-0">{kvkPoints.toLocaleString()}</p>
        </div>
      )}

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
                  <Image
                    src={m.icon}
                    alt={m.label}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-parchment-100 truncate">{m.label}</p>
                    <p className="text-xs text-parchment-400">
                      Need <span className="text-gold-300 font-bold text-sm tabular-nums">{req.toLocaleString()}</span> total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-parchment-400 shrink-0" htmlFor={`owned-${m.id}`}>
                    I have:
                  </label>
                  <input
                    id={`owned-${m.id}`}
                    type="number"
                    min={0}
                    value={own || ''}
                    onChange={(e) => onChangeOwned(m.id, Math.max(0, Number(e.target.value) || 0))}
                    placeholder="0"
                    className="focus-ring flex-1 min-w-0 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
                  />
                </div>
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
              </div>
            );
        })}
      </div>
    </div>
  );
}
