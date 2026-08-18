export interface PetBuffLevel {
  /** Pet advancement level (10, 20, ... 80), not a UI index. */
  level: number;
  /** March speedup, in percent -- The Howler's buff table, capped at 30% at Lv.80. */
  speedupPercent: number;
}

export const PET_BUFF_LEVELS: PetBuffLevel[] = [
  { level: 10, speedupPercent: 15 },
  { level: 20, speedupPercent: 17 },
  { level: 30, speedupPercent: 19 },
  { level: 40, speedupPercent: 21 },
  { level: 50, speedupPercent: 23 },
  { level: 60, speedupPercent: 25 },
  { level: 70, speedupPercent: 27 },
  { level: 80, speedupPercent: 30 },
];

export function getPetBuffSpeedupPercent(level: number | null): number {
  if (level == null) return 0;
  return PET_BUFF_LEVELS.find((l) => l.level === level)?.speedupPercent ?? 0;
}
