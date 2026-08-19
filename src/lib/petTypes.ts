export interface PetCost {
  petFood?: number;
  growthManual?: number;
  nutrientPotion?: number;
  promotionMedallion?: number;
}

export interface PetLevelData {
  level: number;
  /** This level's own Pet Food cost, plus -- only on a tier's first level
   * (11, 21, 31...) -- that tier boundary's advancement materials merged
   * in, so summing a range is a single flat walk. */
  cost: PetCost;
  /** True on levels 11, 21, 31... -- an "Upgrade Path" checkpoint. */
  isTierBoundary: boolean;
}

export interface Pet {
  id: string;
  name: string;
  image: string;
  maxLevel: number;
  levels: PetLevelData[];
}
