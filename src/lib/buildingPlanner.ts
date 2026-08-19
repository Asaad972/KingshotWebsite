import type { Building, BuildingCost } from './buildingTypes';
import { BUILDINGS, DEPENDENCY_BUILDING_IDS, levelIndex } from './buildings';

export interface PlanCost {
  wood: number;
  bread: number;
  stone: number;
  iron: number;
  truegold: number;
  temperedTruegold: number;
}

function emptyCost(): PlanCost {
  return { wood: 0, bread: 0, stone: 0, iron: 0, truegold: 0, temperedTruegold: 0 };
}

function addCost(a: PlanCost, b: BuildingCost): void {
  a.wood += b.wood ?? 0;
  a.bread += b.bread ?? 0;
  a.stone += b.stone ?? 0;
  a.iron += b.iron ?? 0;
  a.truegold += b.truegold ?? 0;
  a.temperedTruegold += b.temperedTruegold ?? 0;
}

/** Sums cost/time across levels (fromIndex, toIndex] -- i.e. every level
 * strictly after fromIndex up to and including toIndex. fromIndex of -1
 * means "from scratch" (include level 0 of the array onward). Never
 * counts a level the user has already completed. */
function sumRange(building: Building, fromIndex: number, toIndex: number): { cost: PlanCost; timeSeconds: number } {
  const cost = emptyCost();
  let timeSeconds = 0;
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    const lvl = building.levels[i];
    if (!lvl) continue;
    addCost(cost, lvl.cost);
    timeSeconds += lvl.timeSeconds;
  }
  return { cost, timeSeconds };
}

export interface UpgradeCard {
  buildingId: string;
  fromLevel: string; // 'None' if not built yet
  toLevel: string;
  cost: PlanCost;
  timeSeconds: number;
}

/** Sensible default "current level" for every dependency building given
 * only the player's current Town Center level: the highest level any Town
 * Center step at or below that has ever required of it. Not a guess --
 * it's the logical floor a player must already be at to have reached that
 * TC level at all. Returns null for a building TC has never referenced
 * yet (nothing to assume). */
export function defaultOtherLevels(currentTC: string): Record<string, string | null> {
  const tc = BUILDINGS.townCenter;
  const curIdx = levelIndex(tc, currentTC);
  const defaults: Record<string, string | null> = {};
  for (const id of DEPENDENCY_BUILDING_IDS) defaults[id] = null;

  const bestIndexByBuilding: Record<string, number> = {};
  for (let i = 0; i <= curIdx; i++) {
    for (const req of tc.levels[i].requirements) {
      const other = BUILDINGS[req.buildingId];
      if (!other) continue;
      const idx = levelIndex(other, req.level);
      if (idx < 0) continue;
      if (bestIndexByBuilding[req.buildingId] === undefined || idx > bestIndexByBuilding[req.buildingId]) {
        bestIndexByBuilding[req.buildingId] = idx;
      }
    }
  }
  for (const [id, idx] of Object.entries(bestIndexByBuilding)) {
    defaults[id] = BUILDINGS[id].levels[idx].level;
  }
  return defaults;
}

export function costForBuildingRange(buildingId: string, currentLevel: string | null, targetLevel: string): UpgradeCard | null {
  const building = BUILDINGS[buildingId];
  if (!building) return null;
  const fromIdx = currentLevel ? levelIndex(building, currentLevel) : -1;
  const toIdx = levelIndex(building, targetLevel);
  if (toIdx < 0 || toIdx <= fromIdx) return null;
  const { cost, timeSeconds } = sumRange(building, fromIdx, toIdx);
  return {
    buildingId,
    fromLevel: fromIdx >= 0 ? building.levels[fromIdx].level : 'None',
    toLevel: building.levels[toIdx].level,
    cost,
    timeSeconds,
  };
}

export interface BuildingPlan {
  townCenter: UpgradeCard;
  required: UpgradeCard[];
  optionalIds: string[];
  total: PlanCost & { timeSeconds: number };
}

/** The whole point of this feature: walk Town Center from currentTC
 * (exclusive) to targetTC (inclusive), and for every dependency named
 * along the way, automatically pull in whatever THAT building still needs
 * too -- recursively in spirit, though in practice one level is enough
 * since every dependency building's own Truegold-tier requirement only
 * ever points back at Town Center itself (already satisfied by
 * definition, since we're planning relative to that same TC target). */
export function buildPlan(
  currentTC: string,
  targetTC: string,
  currentLevels: Record<string, string | null>
): BuildingPlan | null {
  const tc = BUILDINGS.townCenter;
  const curIdx = levelIndex(tc, currentTC);
  const tgtIdx = levelIndex(tc, targetTC);
  if (curIdx < 0 || tgtIdx < 0 || tgtIdx <= curIdx) return null;

  const { cost: tcCost, timeSeconds: tcTime } = sumRange(tc, curIdx, tgtIdx);
  const townCenterCard: UpgradeCard = {
    buildingId: 'townCenter',
    fromLevel: tc.levels[curIdx].level,
    toLevel: tc.levels[tgtIdx].level,
    cost: tcCost,
    timeSeconds: tcTime,
  };

  const bestIndexByBuilding: Record<string, number> = {};
  for (let i = curIdx + 1; i <= tgtIdx; i++) {
    for (const req of tc.levels[i].requirements) {
      const other = BUILDINGS[req.buildingId];
      if (!other) continue;
      const idx = levelIndex(other, req.level);
      if (idx < 0) continue;
      if (bestIndexByBuilding[req.buildingId] === undefined || idx > bestIndexByBuilding[req.buildingId]) {
        bestIndexByBuilding[req.buildingId] = idx;
      }
    }
  }

  const required: UpgradeCard[] = [];
  for (const [buildingId, reqIdx] of Object.entries(bestIndexByBuilding)) {
    const building = BUILDINGS[buildingId];
    const currentLevel = currentLevels[buildingId] ?? null;
    const card = costForBuildingRange(buildingId, currentLevel, building.levels[reqIdx].level);
    if (card) required.push(card);
  }
  // Stable order for display: same order dependency ids are declared in.
  required.sort((a, b) => DEPENDENCY_BUILDING_IDS.indexOf(a.buildingId as any) - DEPENDENCY_BUILDING_IDS.indexOf(b.buildingId as any));

  const requiredIds = new Set(required.map((r) => r.buildingId));
  const optionalIds = DEPENDENCY_BUILDING_IDS.filter((id) => !requiredIds.has(id));

  const total = emptyCost() as PlanCost & { timeSeconds: number };
  total.timeSeconds = 0;
  addCost(total, townCenterCard.cost);
  total.timeSeconds += townCenterCard.timeSeconds;
  for (const card of required) {
    addCost(total, card.cost);
    total.timeSeconds += card.timeSeconds;
  }

  return { townCenter: townCenterCard, required, optionalIds, total };
}

/** All levels of a building the current/target dropdowns should offer --
 * for Town Center this means only the "clean" endpoints (whole levels and
 * tier-completing TG levels), never the 4 intermediate stages of a
 * Truegold tier. The planner still walks every intermediate stage
 * internally when summing cost -- it just isn't a selectable target on
 * its own, matching how the user described picking a target ("TC 30",
 * "TG 1"), not a mid-tier stage.
 *
 * Levels 1-9 are excluded entirely: they gate on buildings outside the
 * planner's tracked set (Sawmill, House, Quarry, etc.) with no available
 * data, so exposing them here would silently understate what they need. */
export function selectableTownCenterLevels(): string[] {
  return BUILDINGS.townCenter.levels
    .map((l) => l.level)
    .filter((l) => !/-\d$/.test(l))
    .filter((l) => l.startsWith('TG') || Number(l) >= 10);
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0s';
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && d === 0) parts.push(`${s}s`);
  return parts.length > 0 ? parts.join(' ') : '0s';
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

export const BUILDING_LABELS: Record<string, string> = {
  townCenter: 'Town Center',
  embassy: 'Embassy',
  academy: 'Academy',
  barracks: 'Barracks',
  range: 'Range',
  stable: 'Stable',
  commandCenter: 'Command Center',
  guardStation: 'Guard Station',
};
