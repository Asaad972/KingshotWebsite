// Shared types for the Building Upgrade Planner. Data lives entirely in
// src/lib/buildingData/*.ts, kept separate from the UI so it can be
// corrected or extended without touching any component.

export interface BuildingCost {
  wood?: number;
  bread?: number;
  stone?: number;
  iron?: number;
  truegold?: number;
  temperedTruegold?: number;
}

export interface BuildingRequirement {
  buildingId: string;
  /** Matches another building's own BuildingLevel.level string exactly. */
  level: string;
}

export interface BuildingLevel {
  /** '1'..'30' for normal levels, then '30-1'..'30-4','TG1' for the first
   * Truegold tier, 'TG1-1'..'TG1-4','TG2' for the second, and so on through
   * TG8. Not numerically sortable -- always compare by array index. */
  level: string;
  /** Other buildings that must already be at a given level. Does not
   * include this building's own previous level (implicit) or the plain
   * Town Center level gate most normal levels have (informational only,
   * never blocks the plan since you're always upgrading TC itself). */
  requirements: BuildingRequirement[];
  cost: BuildingCost;
  timeSeconds: number;
  power: number | null;
}

export interface Building {
  id: string;
  name: string;
  /** Path under /public. */
  image: string;
  levels: BuildingLevel[];
}
