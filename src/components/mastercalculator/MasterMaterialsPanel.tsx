'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { EmblemIcon, ManuscriptIcon } from './MasterIcons';

/** Pure inputs, mirroring the Pet Calculator's Materials & Chests panel --
 * what it adds up to (Need/Missing) lives in the results sidebar instead. */
export default function MasterMaterialsPanel({
  owned,
  onChangeOwned,
}: {
  owned: Record<string, number>;
  onChangeOwned: (materialId: string, value: number) => void;
}) {
  const { t } = useI18n();

  const MATERIALS = [
    { id: 'emblems' as const, label: t('masterCalculator.masterEmblems'), Icon: EmblemIcon },
    { id: 'manuscripts' as const, label: t('masterCalculator.mastersManuscripts'), Icon: ManuscriptIcon },
  ];

  // Real in-game Affinity gift items (user-provided) -- gifted to a Master
  // to raise Affinity directly, in 3 fixed denominations, same "count what
  // you have" pattern as Hero Gear's XP items (Green/Purple Gear).
  const AFFINITY_GIFTS = [
    { id: 'affinityGift10', label: t('masterCalculator.smallAffinityGift'), xpEach: 10, image: '/masters/gifts/affinity-10.png' },
    { id: 'affinityGift100', label: t('masterCalculator.mediumAffinityGift'), xpEach: 100, image: '/masters/gifts/affinity-100.png' },
    { id: 'affinityGift1000', label: t('masterCalculator.largeAffinityGift'), xpEach: 1000, image: '/masters/gifts/affinity-1000.png' },
  ];

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div>
        <h2 className="card-title">{t('calc.yourMaterials')}</h2>
        <p className="text-[11px] text-parchment-400 mt-0.5">{t('calc.materialsSubtitle')}</p>
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

      <div className="border-t border-stone-700 pt-3 flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-500">{t('masterCalculator.affinityGifts')}</p>
        <div className="grid grid-cols-3 gap-2.5">
          {AFFINITY_GIFTS.map((g) => (
            <label key={g.id} className="rounded-md border border-stone-700 bg-stone-800 p-2.5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden">
                  <Image src={g.image} alt={g.label} fill sizes="32px" className="object-cover" />
                </div>
                <p className="text-[11px] font-semibold text-parchment-100 leading-tight">+{g.xpEach.toLocaleString()}</p>
              </div>
              <input
                type="number"
                min={0}
                value={owned[g.id] || ''}
                onChange={(e) => onChangeOwned(g.id, Math.max(0, Number(e.target.value) || 0))}
                placeholder="0"
                className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
