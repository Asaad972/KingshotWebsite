'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { BUILDINGS } from '@/lib/buildings';
import { BUILDING_LABELS } from '@/lib/buildingPlanner';

interface OptionalUpgradesListProps {
  optionalIds: string[];
  currentLevels: Record<string, string | null>;
  addedTargets: Record<string, string | null>;
  onAdd: (buildingId: string, targetLevel: string) => void;
  onRemove: (buildingId: string) => void;
}

/** Buildings not on the required path for this exact target -- the user
 * can still opt in and level them up alongside the plan, each with its
 * own target level, added into the running total the same way a required
 * card is. */
export default function OptionalUpgradesList({
  optionalIds,
  currentLevels,
  addedTargets,
  onAdd,
  onRemove,
}: OptionalUpgradesListProps) {
  const { t } = useI18n();
  if (optionalIds.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-sm font-semibold text-parchment-300">{t('buildingPlanner.optionalUpgrades')}</h2>
      <p className="text-xs text-parchment-500 -mt-1.5">{t('buildingPlanner.optionalUpgradesSubtitle')}</p>
      <div className="flex flex-col gap-2.5">
        {optionalIds.map((id) => (
          <OptionalRow
            key={id}
            buildingId={id}
            currentLevel={currentLevels[id] ?? null}
            addedTarget={addedTargets[id] ?? null}
            onAdd={(target) => onAdd(id, target)}
            onRemove={() => onRemove(id)}
          />
        ))}
      </div>
    </div>
  );
}

function OptionalRow({
  buildingId,
  currentLevel,
  addedTarget,
  onAdd,
  onRemove,
}: {
  buildingId: string;
  currentLevel: string | null;
  addedTarget: string | null;
  onAdd: (target: string) => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const building = BUILDINGS[buildingId];
  const [picking, setPicking] = useState(false);
  const label = BUILDING_LABELS[buildingId] ?? building.name;

  const currentIdx = currentLevel ? building.levels.findIndex((l) => l.level === currentLevel) : -1;
  const options = building.levels.slice(currentIdx + 1);

  return (
    <div className="dashboard-card p-3.5 flex items-center gap-3.5">
      <div className="relative h-12 w-12 shrink-0">
        <Image src={building.image} alt={label} fill sizes="48px" className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-parchment-100">{label}</p>
        <p className="text-xs text-parchment-400">
          {t('calc.current')}: {currentLevel ? `Lv.${currentLevel}` : t('buildingPlanner.none')}
        </p>
      </div>

      {addedTarget ? (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gold-300">{t('buildingPlanner.targetLv', { level: addedTarget })}</span>
          <button
            type="button"
            onClick={onRemove}
            className="focus-ring rounded border border-stone-700 px-2.5 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
          >
            {t('calc.remove')}
          </button>
        </div>
      ) : picking ? (
        <div className="flex items-center gap-2 shrink-0">
          <select
            autoFocus
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onAdd(e.target.value);
                setPicking(false);
              }
            }}
            className="focus-ring rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-xs text-parchment-100"
          >
            <option value="" disabled>
              {t('buildingPlanner.targetLevelPlaceholder')}
            </option>
            {options.map((lvl) => (
              <option key={lvl.level} value={lvl.level}>
                Lv.{lvl.level}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setPicking(false)}
            className="focus-ring rounded border border-stone-700 px-2 py-1.5 text-xs text-parchment-400"
          >
            {t('common.cancel')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicking(true)}
          disabled={options.length === 0}
          className="focus-ring shrink-0 rounded-md border border-gold-600/50 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/10 transition-colors disabled:opacity-40"
        >
          {t('buildingPlanner.addToPlan')}
        </button>
      )}
    </div>
  );
}
