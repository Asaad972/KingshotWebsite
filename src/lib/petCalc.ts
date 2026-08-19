import type { PetCost } from './petTypes';
import { PETS } from './pets';

export interface PetTotal {
  petFood: number;
  growthManual: number;
  nutrientPotion: number;
  promotionMedallion: number;
}

export interface PetRangeResult {
  total: PetTotal;
}

export function emptyPetTotal(): PetTotal {
  return { petFood: 0, growthManual: 0, nutrientPotion: 0, promotionMedallion: 0 };
}

function addPetCost(a: PetTotal, b: PetCost): void {
  a.petFood += b.petFood ?? 0;
  a.growthManual += b.growthManual ?? 0;
  a.nutrientPotion += b.nutrientPotion ?? 0;
  a.promotionMedallion += b.promotionMedallion ?? 0;
}

/** Sums every level strictly after `currentLevel` up to and including
 * `targetLevel` -- mirrors the Building Planner's sumRange, since each
 * tier's advancement cost is already merged onto that tier's first level. */
export function costForPetRange(petId: string, currentLevel: number, targetLevel: number): PetRangeResult | null {
  const pet = PETS[petId];
  if (!pet) return null;
  if (targetLevel <= currentLevel || targetLevel > pet.maxLevel || currentLevel < 1) return null;

  const total = emptyPetTotal();
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    const data = pet.levels[level - 1];
    if (data) addPetCost(total, data.cost);
  }

  return { total };
}

export const CHEST_YIELD = {
  growthManual: 7,
  nutrientPotion: 2,
  promotionMedallion: 1,
} as const;

export interface ChestBreakdownRow {
  material: 'growthManual' | 'nutrientPotion' | 'promotionMedallion';
  chests: number;
  amount: number;
}

export interface ChestRecommendation {
  breakdown: ChestBreakdownRow[];
  totalNeeded: number;
  chestsUsed: number;
  chestsRemaining: number;
  extraChestsNeeded: number;
}

/** Works out the most useful (never wasteful) chest use: exactly enough
 * chests per material to close that material's own shortfall, never more.
 * If the owned count can't cover everything, the breakdown still shows the
 * full amount needed per material so the shortfall is obvious -- no
 * priority/partial allocation to reason about. */
export function recommendChestUse(
  missing: { growthManual: number; nutrientPotion: number; promotionMedallion: number },
  chestsOwned: number
): ChestRecommendation {
  const breakdown: ChestBreakdownRow[] = [];
  (Object.keys(CHEST_YIELD) as (keyof typeof CHEST_YIELD)[]).forEach((material) => {
    const amount = missing[material];
    if (amount <= 0) return;
    const chests = Math.ceil(amount / CHEST_YIELD[material]);
    breakdown.push({ material, chests, amount });
  });

  const totalNeeded = breakdown.reduce((sum, r) => sum + r.chests, 0);
  const chestsUsed = Math.min(totalNeeded, chestsOwned);
  const chestsRemaining = Math.max(0, chestsOwned - totalNeeded);
  const extraChestsNeeded = Math.max(0, totalNeeded - chestsOwned);

  return { breakdown, totalNeeded, chestsUsed, chestsRemaining, extraChestsNeeded };
}

export const PET_MATERIAL_LABELS: Record<string, string> = {
  petFood: 'Pet Food',
  growthManual: 'Growth Manual',
  nutrientPotion: 'Nutrient Potion',
  promotionMedallion: 'Promotion Medallion',
};
