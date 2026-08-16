'use client';

import Image from 'next/image';
import type { HeroGearMaterials } from '@/lib/heroGearCalc';

const MATERIALS: { id: keyof HeroGearMaterials; label: string; icon?: string; dot?: string }[] = [
  { id: 'xp', label: 'Hero Gear XP', icon: '/heroGear/materials/xp.webp' },
  { id: 'mithril', label: 'Mithril', icon: '/heroGear/materials/mithril.png' },
  { id: 'mythicGears', label: 'Mythic Gears', dot: 'bg-purple-500' },
  { id: 'forgehammers', label: 'Forgehammers', icon: '/heroGear/materials/forgehammers.png' },
];

export default function HeroGearMaterialsPanel({
  required,
  owned,
  onChangeOwned,
}: {
  required: HeroGearMaterials;
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-parchment-100">Materials</h2>
        <p className="text-[11px] text-parchment-500 mt-0.5">
          Combined total across Infantry, Cavalry and Archers. Enter what you already have -- we'll tell you how much more you need.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {MATERIALS.map((m) => {
          const req = required[m.id];
          const own = owned[m.id] ?? 0;
          const needed = Math.max(0, req - own);
          const extra = Math.max(0, own - req);
          const ready = needed === 0;
          return (
            <div key={m.id} className="rounded-md border border-stone-700 bg-stone-950/60 p-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                {m.icon ? (
                  <Image src={m.icon} alt={m.label} width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className={`h-3 w-3 rounded-full shrink-0 ${m.dot}`} aria-hidden />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-parchment-100 truncate">{m.label}</p>
                  <p className="text-xs text-parchment-500">
                    Need <span className="text-parchment-200 font-medium tabular-nums">{req.toLocaleString()}</span> total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-parchment-500 shrink-0" htmlFor={`owned-${m.id}`}>
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
                className={`rounded px-2.5 py-1.5 text-xs font-semibold text-center ${
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
