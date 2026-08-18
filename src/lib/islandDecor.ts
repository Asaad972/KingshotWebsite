export interface IslandBuffLevel {
  level: number;
  /** March speedup, in percent -- pet island decoration level 1-5, +1% each. */
  speedupPercent: number;
}

export const ISLAND_BUFF_LEVELS: IslandBuffLevel[] = [
  { level: 1, speedupPercent: 1 },
  { level: 2, speedupPercent: 2 },
  { level: 3, speedupPercent: 3 },
  { level: 4, speedupPercent: 4 },
  { level: 5, speedupPercent: 5 },
];

export const ISLAND_LEVELS = ISLAND_BUFF_LEVELS.map((l) => l.level);

export function getIslandSpeedupPercent(level: number | null): number {
  if (level == null) return 0;
  return ISLAND_BUFF_LEVELS.find((l) => l.level === level)?.speedupPercent ?? 0;
}
