import { ECONOMY_TECHS, getEconomyTech, type ResearchCategory, type ResearchTech, type ResourceCost } from './researchEconomyData';

export interface TechLevelState {
  current: number;
  target: number;
}

/** techId -> { current, target } -- 0 means "not researched yet". */
export type ResearchPlan = Record<string, TechLevelState>;

export function defaultResearchPlan(): ResearchPlan {
  return Object.fromEntries(ECONOMY_TECHS.map((t) => [t.id, { current: 0, target: 0 }]));
}

/** Lanes shown top-to-bottom in the tree: each resource's Output (production
 * rate) lane directly above its Gathering (collection speed) lane, in the
 * same Bread/Wood/Stone/Iron order used elsewhere in the app (see
 * RESOURCE_ICONS in TroopCalculatorSection). */
export const LANE_ORDER: ResearchCategory[] = [
  'bread-output',
  'bread-gathering',
  'wood-output',
  'wood-gathering',
  'stone-output',
  'stone-gathering',
  'iron-output',
  'iron-gathering',
];

export const CATEGORY_LABELS: Record<ResearchCategory, string> = {
  'bread-output': 'Bread Output',
  'bread-gathering': 'Bread Gathering',
  'wood-output': 'Wood Output',
  'wood-gathering': 'Wood Gathering',
  'stone-output': 'Stone Output',
  'stone-gathering': 'Stone Gathering',
  'iron-output': 'Iron Output',
  'iron-gathering': 'Iron Gathering',
};

export const CATEGORY_RESOURCE: Record<ResearchCategory, 'bread' | 'wood' | 'stone' | 'iron'> = {
  'bread-output': 'bread',
  'bread-gathering': 'bread',
  'wood-output': 'wood',
  'wood-gathering': 'wood',
  'stone-output': 'stone',
  'stone-gathering': 'stone',
  'iron-output': 'iron',
  'iron-gathering': 'iron',
};

/** Techs in a lane, already in their natural I/II/III... order (source order). */
export function techsInLane(category: ResearchCategory): ResearchTech[] {
  return ECONOMY_TECHS.filter((t) => t.category === category);
}

function emptyCost(): ResourceCost {
  return { bread: 0, wood: 0, stone: 0, iron: 0, gold: 0 };
}

export interface ResearchPlanTotals {
  cost: ResourceCost;
  timeSeconds: number;
  powerGained: number;
  levelsCurrent: number;
  levelsTarget: number;
  levelsMax: number;
  techsMaxedCurrent: number;
}

/** Sums every level strictly after `current` up to and including `target`
 * for each tech (mirrors the incremental-cost pattern used by the gear/charm
 * calculators), plus overall completion stats across all 44 techs. */
export function calcResearchPlan(plan: ResearchPlan): ResearchPlanTotals {
  const cost = emptyCost();
  let timeSeconds = 0;
  let powerGained = 0;
  let levelsCurrent = 0;
  let levelsTarget = 0;
  let levelsMax = 0;
  let techsMaxedCurrent = 0;

  for (const tech of ECONOMY_TECHS) {
    const state = plan[tech.id] ?? { current: 0, target: 0 };
    const current = Math.max(0, Math.min(state.current, tech.maxLevel));
    const target = Math.max(current, Math.min(state.target, tech.maxLevel));

    levelsCurrent += current;
    levelsTarget += target;
    levelsMax += tech.maxLevel;
    if (current >= tech.maxLevel) techsMaxedCurrent += 1;

    for (const lv of tech.levels) {
      if (lv.level <= current || lv.level > target) continue;
      cost.bread += lv.cost.bread;
      cost.wood += lv.cost.wood;
      cost.stone += lv.cost.stone;
      cost.iron += lv.cost.iron;
      cost.gold += lv.cost.gold;
      timeSeconds += lv.timeSeconds;
      powerGained += lv.power;
    }
  }

  return { cost, timeSeconds, powerGained, levelsCurrent, levelsTarget, levelsMax, techsMaxedCurrent };
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export function formatResearchDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s === 0) return 'Instant';
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!days && !hours && seconds) parts.push(`${seconds}s`);
  return parts.length ? parts.join(' ') : '0s';
}

export { getEconomyTech };
