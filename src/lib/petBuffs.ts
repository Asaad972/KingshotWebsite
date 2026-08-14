export interface PetBuffLevel {
  level: number;
  /** March speedup, in percent. PLACEHOLDER values -- update with real numbers. */
  speedupPercent: number;
}

export const PET_BUFF_LEVELS: PetBuffLevel[] = [
  { level: 1, speedupPercent: 5 },
  { level: 2, speedupPercent: 10 },
  { level: 3, speedupPercent: 15 },
  { level: 4, speedupPercent: 20 },
  { level: 5, speedupPercent: 25 },
  { level: 6, speedupPercent: 30 },
  { level: 7, speedupPercent: 35 },
  { level: 8, speedupPercent: 40 },
  { level: 9, speedupPercent: 45 },
  { level: 10, speedupPercent: 50 },
];

export function getPetBuffSpeedupPercent(level: number | null): number {
  if (level == null) return 0;
  return PET_BUFF_LEVELS.find((l) => l.level === level)?.speedupPercent ?? 0;
}
