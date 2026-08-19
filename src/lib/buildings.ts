import type { Building } from './buildingTypes';
import { townCenterBuilding } from './buildingData/townCenter';
import { embassyBuilding } from './buildingData/embassy';
import { academyBuilding } from './buildingData/academy';
import { barracksBuilding } from './buildingData/barracks';
import { rangeBuilding } from './buildingData/range';
import { stableBuilding } from './buildingData/stable';
import { commandCenterBuilding } from './buildingData/commandCenter';
import { guardStationBuilding } from './buildingData/guardStation';

/** Every building the planner knows about. Town Center is the "spine" --
 * the only one you pick a current/target level for directly. Embassy,
 * Academy, Barracks, Range, Stable, and Command Center are the buildings
 * Town Center's own levels can name as requirements. Guard Station never
 * gates a Town Center level (TC7 only unlocks its existence) so it only
 * ever shows up as an optional add. */
export const BUILDINGS: Record<string, Building> = {
  townCenter: townCenterBuilding,
  embassy: embassyBuilding,
  academy: academyBuilding,
  barracks: barracksBuilding,
  range: rangeBuilding,
  stable: stableBuilding,
  commandCenter: commandCenterBuilding,
  guardStation: guardStationBuilding,
};

/** Every building except Town Center itself -- these are the ones that can
 * appear as a "required" or "optional" card in a plan. */
export const DEPENDENCY_BUILDING_IDS = [
  'embassy',
  'academy',
  'barracks',
  'range',
  'stable',
  'commandCenter',
  'guardStation',
] as const;

export function getBuilding(id: string): Building | undefined {
  return BUILDINGS[id];
}

/** Index of a level string within a building's own levels array -- the
 * only valid way to compare/walk levels, since Truegold stage names
 * ('TG3-2') aren't numerically sortable. -1 if not found. */
export function levelIndex(building: Building, level: string): number {
  return building.levels.findIndex((l) => l.level === level);
}

/** Town Center's appearance changes at each Truegold tier -- the 4
 * intermediate stages of a tier ('30-1'..'30-4', 'TG1-1'..'TG1-4', ...)
 * already look like the tier they're building toward, so they share that
 * tier's image with the tier-completing level itself. Levels 1-30 use the
 * building's normal image. */
export function townCenterLevelImage(level: string): string {
  const match = level.match(/^(?:(\d+)-\d|TG(\d+)(?:-\d)?)$/);
  if (!match) return townCenterBuilding.image;
  const tier = match[1] ? 1 : Number(match[2]) + (level.includes('-') ? 1 : 0);
  return `/buildings/tg${tier}.png`;
}
