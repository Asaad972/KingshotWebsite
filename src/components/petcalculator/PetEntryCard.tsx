'use client';

import { PETS } from '@/lib/pets';
import type { PetRangeResult } from '@/lib/petCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import PetPicker from './PetPicker';
import PetUpgradePathView from './PetUpgradePathView';
import { PetFoodIcon, GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const COST_ROWS = [
  { key: 'petFood' as const, label: 'Pet Food', Icon: PetFoodIcon, tone: 'text-orange-400' },
  { key: 'growthManual' as const, label: 'Growth Manual', Icon: GrowthManualIcon, tone: 'text-cyan-400' },
  { key: 'nutrientPotion' as const, label: 'Nutrient Potion', Icon: NutrientPotionIcon, tone: 'text-moss-500' },
  { key: 'promotionMedallion' as const, label: 'Promotion Medallion', Icon: PromotionMedallionIcon, tone: 'text-gold-300' },
];

/** Milestone chips are every 10 levels -- the same points where a tier
 * advancement is paid, so they line up with the Upgrade Path checkpoints
 * below. Computed per-pet from its own real max level, never a shared
 * constant, since that varies pet to pet. */
function milestonesFor(maxLevel: number): number[] {
  const out: number[] = [];
  for (let m = 10; m <= maxLevel; m += 10) out.push(m);
  return out;
}

export default function PetEntryCard({
  petId,
  currentLevel,
  targetLevel,
  result,
  onPetChange,
  onLevelsChange,
  onRemove,
  showRemove,
}: {
  petId: string;
  currentLevel: number;
  targetLevel: number;
  result: PetRangeResult | null;
  onPetChange: (id: string) => void;
  onLevelsChange: (next: { currentLevel: number; targetLevel: number }) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const pet = PETS[petId];
  const milestones = milestonesFor(pet.maxLevel);

  const setCurrentLevel = (v: number) => {
    onLevelsChange({ currentLevel: v, targetLevel: Math.max(targetLevel, v) });
  };
  // Clamped here (not via the slider's own min) so Target's slider fill
  // doesn't visibly jump every time Current moves -- same reasoning as
  // the Hero Gear Calculator's ArmorSlotCard.
  const setTargetLevel = (v: number) => {
    onLevelsChange({ currentLevel, targetLevel: Math.max(v, currentLevel) });
  };

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <PetPicker selectedId={petId} onSelect={onPetChange} />
        </div>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-2 text-xs text-parchment-400 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium text-parchment-400">Level (1-{pet.maxLevel})</p>

        <LevelSlider label="Current" value={currentLevel} min={1} max={pet.maxLevel} onChange={setCurrentLevel} />
        <div className="flex gap-1.5 flex-wrap">
          {milestones.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setCurrentLevel(m)}
              className={`focus-ring rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[36px] ${
                currentLevel === m ? 'bg-gold-500 text-stone-950' : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-gold-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <LevelSlider label="Target" value={targetLevel} min={1} max={pet.maxLevel} onChange={setTargetLevel} tone="cyan" />
        <div className="flex gap-1.5 flex-wrap">
          {milestones.map((m) => {
            const disabled = m < currentLevel;
            return (
              <button
                key={m}
                type="button"
                disabled={disabled}
                onClick={() => setTargetLevel(m)}
                className={`focus-ring rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[36px] ${
                  disabled
                    ? 'bg-stone-900 border border-stone-800 text-parchment-600 opacity-50 cursor-not-allowed'
                    : targetLevel === m
                      ? 'bg-cyan-500 text-stone-950'
                      : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-cyan-600'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {!result ? (
        <p className="text-xs text-ember-500">Target must be higher than current level.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2">
            {COST_ROWS.filter((r) => result.total[r.key] > 0).map((r) => (
              <div key={r.key} className={`flex items-center gap-1.5 text-sm font-semibold tabular-nums ${r.tone}`}>
                <span className="h-4 w-4 shrink-0">
                  <r.Icon />
                </span>
                {result.total[r.key].toLocaleString()}
                <span className="text-parchment-500 font-normal text-xs">{r.label}</span>
              </div>
            ))}
          </div>

          <PetUpgradePathView petId={petId} currentLevel={currentLevel} targetLevel={targetLevel} checkpoints={result.checkpoints} />
        </>
      )}
    </div>
  );
}
