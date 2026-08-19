'use client';

import type { PetCheckpoint } from '@/lib/petCalc';
import { PETS } from '@/lib/pets';
import { GrowthManualIcon, NutrientPotionIcon, PromotionMedallionIcon } from './PetIcons';

const CHECKPOINT_ROWS = [
  { key: 'growthManual' as const, label: 'Growth Manual', Icon: GrowthManualIcon },
  { key: 'nutrientPotion' as const, label: 'Nutrient Potion', Icon: NutrientPotionIcon },
  { key: 'promotionMedallion' as const, label: 'Promotion Medallion', Icon: PromotionMedallionIcon },
];

/** The important stages between current and target -- every tier boundary
 * crossed gets its own "Advance" checkpoint with its own material cost, so
 * the user sees the shape of the climb without every individual level
 * cluttering the main screen. Full level-by-level food detail is tucked
 * behind a details disclosure, mirroring the Building Planner's collapsed
 * "Current Building Levels" pattern. */
export default function PetUpgradePathView({
  petId,
  currentLevel,
  targetLevel,
  checkpoints,
}: {
  petId: string;
  currentLevel: number;
  targetLevel: number;
  checkpoints: PetCheckpoint[];
}) {
  const pet = PETS[petId];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
        <span className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1 font-semibold text-parchment-100 tabular-nums">
          Lv.{currentLevel}
        </span>
        {checkpoints.map((cp) => (
          <span key={cp.atLevel} className="flex items-center gap-1.5">
            <ArrowIcon />
            <span className="text-[10px] uppercase tracking-wide text-gold-400">Advance</span>
            <ArrowIcon />
            <span className="rounded border border-gold-600/50 bg-gold-500/10 px-2.5 py-1 font-semibold text-gold-300 tabular-nums">
              Lv.{cp.atLevel}
            </span>
          </span>
        ))}
        <ArrowIcon />
        <span className="rounded border border-cyan-600/50 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300 tabular-nums">
          Lv.{targetLevel}
        </span>
      </div>

      {checkpoints.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {checkpoints.map((cp) => (
            <div key={cp.atLevel} className="flex flex-wrap items-center gap-3 text-xs text-parchment-400">
              <span className="text-parchment-300 font-medium shrink-0">Advance to Lv.{cp.atLevel}:</span>
              {CHECKPOINT_ROWS.filter((r) => cp.cost[r.key] > 0).map((r) => (
                <span key={r.key} className="flex items-center gap-1 tabular-nums">
                  <span className="h-3.5 w-3.5 shrink-0">
                    <r.Icon />
                  </span>
                  {cp.cost[r.key].toLocaleString()} {r.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      <details className="text-xs mt-1">
        <summary className="cursor-pointer text-parchment-500 hover:text-gold-300 transition-colors select-none">
          Show every level ({currentLevel + 1}-{targetLevel})
        </summary>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-1">
          {pet.levels.slice(currentLevel, targetLevel).map((lvl) => (
            <div key={lvl.level} className="flex items-center justify-between rounded bg-stone-950/60 px-2 py-1">
              <span className="text-parchment-400">Lv.{lvl.level}</span>
              <span className="text-parchment-300 tabular-nums">{(lvl.cost.petFood ?? 0).toLocaleString()} food</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-parchment-500">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
