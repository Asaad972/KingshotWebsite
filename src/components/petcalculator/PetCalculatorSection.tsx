'use client';

import { useMemo } from 'react';
import { PET_ORDER, PETS } from '@/lib/pets';
import { costForPetRange, emptyPetTotal, recommendChestUse, type PetTotal } from '@/lib/petCalc';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import PetEntryCard from './PetEntryCard';
import PetMaterialsPanel from './PetMaterialsPanel';
import PetResultsSidebar from './PetResultsSidebar';
import PetChestPanel from './PetChestPanel';

interface PetEntry {
  localId: number;
  petId: string;
  currentLevel: number;
  targetLevel: number;
}

function newEntry(localId: number): PetEntry {
  const petId = PET_ORDER[0];
  const maxLevel = PETS[petId].maxLevel;
  return { localId, petId, currentLevel: 1, targetLevel: Math.min(10, maxLevel) };
}

/** Every added pet, its levels, inventory, and chest count are all saved
 * automatically -- same as the Gear/Charm/Hero Gear calculators -- so a
 * refresh doesn't throw away a multi-pet plan. localId is derived from the
 * current max on each add rather than a module-level counter, since that
 * counter would reset on reload while persisted entries wouldn't. */
export default function PetCalculatorSection() {
  const [entries, setEntries] = useLocalStorageState<PetEntry[]>('petCalculator:entries', [newEntry(1)]);
  const [owned, setOwned] = useLocalStorageState<Record<string, number>>('petCalculator:owned', {});
  const [chestsOwned, setChestsOwned] = useLocalStorageState<number>('petCalculator:chests', 0);

  const updateEntry = (localId: number, patch: Partial<PetEntry>) => {
    setEntries((prev) => prev.map((e) => (e.localId === localId ? { ...e, ...patch } : e)));
  };

  const results = useMemo(() => {
    return entries.map((e) => ({ entry: e, result: costForPetRange(e.petId, e.currentLevel, e.targetLevel) }));
  }, [entries]);

  const combinedRequired = useMemo(() => {
    const total: PetTotal = emptyPetTotal();
    for (const { result } of results) {
      if (!result) continue;
      total.petFood += result.total.petFood;
      total.growthManual += result.total.growthManual;
      total.nutrientPotion += result.total.nutrientPotion;
      total.promotionMedallion += result.total.promotionMedallion;
    }
    return total;
  }, [results]);

  const chestRecommendation = useMemo(() => {
    const missing = {
      growthManual: Math.max(0, combinedRequired.growthManual - (owned.growthManual ?? 0)),
      nutrientPotion: Math.max(0, combinedRequired.nutrientPotion - (owned.nutrientPotion ?? 0)),
      promotionMedallion: Math.max(0, combinedRequired.promotionMedallion - (owned.promotionMedallion ?? 0)),
    };
    return recommendChestUse(missing, chestsOwned);
  }, [combinedRequired, owned, chestsOwned]);

  const requiredRecord: Record<string, number> = {
    petFood: combinedRequired.petFood,
    growthManual: combinedRequired.growthManual,
    nutrientPotion: combinedRequired.nutrientPotion,
    promotionMedallion: combinedRequired.promotionMedallion,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-8 flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-parchment-100">Pet Upgrade Calculator</h1>
        <p className="text-xs text-parchment-400 mt-0.5">
          Pick a pet, set your current and target level, and see exactly what you need to get there.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-5 min-w-0">
          <PetMaterialsPanel
            owned={owned}
            onChangeOwned={(id, value) => setOwned((prev) => ({ ...prev, [id]: value }))}
            chestsOwned={chestsOwned}
            onChangeChestsOwned={setChestsOwned}
          />

          <div className="flex flex-col gap-4">
            {results.map(({ entry, result }) => (
              <PetEntryCard
                key={entry.localId}
                petId={entry.petId}
                currentLevel={entry.currentLevel}
                targetLevel={entry.targetLevel}
                result={result}
                onPetChange={(id) => {
                  const maxLevel = PETS[id].maxLevel;
                  updateEntry(entry.localId, {
                    petId: id,
                    currentLevel: 1,
                    targetLevel: Math.min(10, maxLevel),
                  });
                }}
                onLevelsChange={(next) => updateEntry(entry.localId, next)}
                onRemove={() => setEntries((prev) => prev.filter((e) => e.localId !== entry.localId))}
                showRemove={entries.length > 1}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEntries((prev) => [...prev, newEntry(Math.max(0, ...prev.map((e) => e.localId)) + 1)])}
            className="focus-ring self-start rounded-md border border-gold-600/50 px-4 py-2 text-sm font-semibold text-gold-300 hover:bg-gold-500/10 transition-colors"
          >
            + Add Another Pet
          </button>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-20">
          <PetResultsSidebar required={requiredRecord} owned={owned} />
          <PetChestPanel recommendation={chestRecommendation} />
        </div>
      </div>
    </div>
  );
}
