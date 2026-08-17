'use client';

import Image from 'next/image';
import type { HeroGearMaterials } from '@/lib/heroGearCalc';

const OTHER_MATERIALS: { id: keyof HeroGearMaterials; label: string; icon: string }[] = [
  { id: 'mithril', label: 'Mithril', icon: '/heroGear/materials/mithril.png' },
  { id: 'mythicGears', label: 'Mythic Gears', icon: '/heroGear/pieces/chestplate.png' },
  { id: 'forgehammers', label: 'Forgehammers', icon: '/heroGear/materials/forgehammers.png' },
];

// Hero Gear XP isn't a material you count directly -- you count how many
// Green/Purple gear items you have, each worth a fixed XP amount.
const XP_ITEMS = [
  { id: 'xpGreen', label: 'Green Gear', xpEach: 10, icon: '/heroGear/materials/greenxp.png' },
  { id: 'xpPurple', label: 'Purple Gear', xpEach: 100, icon: '/heroGear/materials/xp.webp' },
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
  const ownedXp = XP_ITEMS.reduce((sum, item) => sum + (owned[item.id] ?? 0) * item.xpEach, 0);
  const xpNeeded = Math.max(0, required.xp - ownedXp);
  const xpExtra = Math.max(0, ownedXp - required.xp);
  const xpReady = xpNeeded === 0;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-parchment-100">Materials</h2>
        <p className="text-[11px] text-parchment-500 mt-0.5">
          Combined total across Infantry, Cavalry and Archers. Enter what you already have -- we'll tell you how much more you need.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Hero Gear XP -- entered as item counts, not a raw number */}
        <div className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-2.5">
          <div>
            <p className="text-sm font-semibold text-parchment-100">Hero Gear XP</p>
            <p className="text-xs text-parchment-500">
              Need <span className="text-parchment-200 font-medium tabular-nums">{required.xp.toLocaleString()}</span> total
            </p>
          </div>
          {XP_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Image src={item.icon} alt={item.label} width={32} height={32} className="h-8 w-8 shrink-0 rounded-md object-cover" />
              <label className="text-xs text-parchment-400 flex-1 min-w-0" htmlFor={`owned-${item.id}`}>
                {item.label} <span className="text-parchment-600">(×{item.xpEach} XP)</span>
              </label>
              <input
                id={`owned-${item.id}`}
                type="number"
                min={0}
                value={owned[item.id] || ''}
                onChange={(e) => onChangeOwned(item.id, Math.max(0, Number(e.target.value) || 0))}
                placeholder="0"
                className="focus-ring w-20 shrink-0 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
              />
            </div>
          ))}
          <p className="text-[11px] text-parchment-500">
            = <span className="text-parchment-200 font-medium tabular-nums">{ownedXp.toLocaleString()}</span> XP
          </p>
          <div
            className={`rounded px-2.5 py-1.5 text-xs font-semibold text-center ${
              xpReady ? 'bg-moss-500/15 text-moss-500' : 'bg-ember-500/15 text-ember-500'
            }`}
          >
            {xpReady
              ? xpExtra > 0
                ? `You're ready ✓ (+${xpExtra.toLocaleString()} extra)`
                : "You're ready ✓"
              : `Need ${xpNeeded.toLocaleString()} more`}
          </div>
        </div>

        {OTHER_MATERIALS.map((m) => {
          const req = required[m.id];
          const own = owned[m.id] ?? 0;
          const needed = Math.max(0, req - own);
          const extra = Math.max(0, own - req);
          const ready = needed === 0;
          return (
            <div key={m.id} className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <Image src={m.icon} alt={m.label} width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
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
