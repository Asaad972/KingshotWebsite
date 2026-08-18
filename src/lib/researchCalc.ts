import type { ResearchTech, ResourceCost } from './researchTypes';

export interface TechLevelState {
  current: number;
  target: number;
}

/** techId -> { current, target } -- 0 means "not researched yet". Each tree
 * (Economy/Growth/Battle) keeps its own plan, persisted under its own
 * localStorage key -- see ResearchTreeSection. */
export type ResearchPlan = Record<string, TechLevelState>;

export function defaultResearchPlan(techs: ResearchTech[]): ResearchPlan {
  return Object.fromEntries(techs.map((t) => [t.id, { current: 0, target: 0 }]));
}

export function techsInCategory(techs: ResearchTech[], category: string): ResearchTech[] {
  return techs.filter((t) => t.category === category);
}

/** Other techs in the same tree that list this one as a prerequisite -- the
 * reverse of `tech.prereqs`, used to draw "what does researching this
 * unlock" lines. */
export function getDependents(techs: ResearchTech[], techId: string): ResearchTech[] {
  return techs.filter((t) => t.prereqs.some((p) => p.techId === techId));
}

/** "Bread Output +4% to +13.5%" -> "Bread Output" -- the stat name a tech's
 * bonus applies to, with everything from the first signed number onward cut
 * off. Handles percent ranges, flat-number ones (e.g. "Training Capacity +2
 * to +7"), and single-value ones (e.g. "March Queue +1") the same way.
 * A handful of techs (e.g. Trainer Tools) have no stat name in effectRange
 * at all on the source site -- it just starts straight at "+2.2% to
 * +7.4%" -- so those fall back to a cleaned-up description instead. */
export function statLabel(tech: ResearchTech): string {
  const m = tech.effectRange.match(/^(.*?)\s*[+-][\d.,]/);
  const label = m ? m[1].trim() : tech.effectRange;
  if (label) return label;
  return tech.desc.replace(/^(Enhances|Increases|Accelerates)\s+/, '').replace(/\.$/, '');
}

/** Each tech's longest-path distance from a root (a tech with no in-tree
 * prerequisites). This is the in-game tree's actual branching structure --
 * a tech unlocked by multiple lines sits one row below whichever
 * prerequisite is deeper, matching the single trunk that splits and
 * re-merges (Economy), or the several independent trunks that do the same
 * (Growth/Battle, where some tiers gate on external troop upgrades instead
 * of the previous tier of the same tech). */
export function computeDepths(techs: ResearchTech[]): Record<string, number> {
  const depth: Record<string, number> = {};
  const byId = Object.fromEntries(techs.map((t) => [t.id, t]));
  function get(id: string): number {
    if (depth[id] !== undefined) return depth[id];
    const t = byId[id];
    if (!t || !t.prereqs.length) return (depth[id] = 0);
    depth[id] = 0; // cycle guard, this data has none
    return (depth[id] = 1 + Math.max(...t.prereqs.map((p) => get(p.techId))));
  }
  for (const t of techs) get(t.id);
  return depth;
}

const MAX_ROW_WIDTH = 3;

/** Techs grouped into rows for the tree's visual layout, capped at
 * MAX_ROW_WIDTH per row and split by *real* prerequisite structure --
 * NOT just by raw depth number. Growth/Battle have several independent
 * trunks running in parallel (some tiers gate on external troop upgrades
 * instead of the previous tier of the same tech, so those chains have no
 * in-tree edge connecting them to anything else), each with its own local
 * branch/merge shape (e.g. two techs converging into one, or one
 * fanning out into three) -- unrelated trunks that merely happen to share
 * a depth number must never end up sharing a row, or the row would show
 * techs side by side that have nothing to do with each other.
 *
 * Approach: split into connected components (via prereqs, undirected) so
 * each independent trunk lays out on its own, then within a component walk
 * depth by depth, ordering each depth's techs by where their prerequisite
 * sat in the previous row (so real siblings stay adjacent and a merge sits
 * next to both its parents) before chunking into rows of MAX_ROW_WIDTH. */
export function groupByDepth(techs: ResearchTech[]): ResearchTech[][] {
  const byId = new Map(techs.map((t) => [t.id, t]));
  const depth = computeDepths(techs);

  const parent = new Map<string, string>();
  const find = (id: string): string => {
    let root = id;
    while (parent.get(root) !== root) root = parent.get(root)!;
    let cur = id;
    while (parent.get(cur) !== root) {
      const next = parent.get(cur)!;
      parent.set(cur, root);
      cur = next;
    }
    return root;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  for (const t of techs) parent.set(t.id, t.id);
  for (const t of techs) {
    for (const p of t.prereqs) {
      if (byId.has(p.techId)) union(t.id, p.techId);
    }
  }

  const components = new Map<string, ResearchTech[]>();
  for (const t of techs) {
    const root = find(t.id);
    if (!components.has(root)) components.set(root, []);
    components.get(root)!.push(t);
  }

  const rows: ResearchTech[][] = [];
  for (const comp of components.values()) {
    const byDepth = new Map<number, ResearchTech[]>();
    for (const t of comp) {
      const d = depth[t.id];
      if (!byDepth.has(d)) byDepth.set(d, []);
      byDepth.get(d)!.push(t);
    }
    const depths = Array.from(byDepth.keys()).sort((a, b) => a - b);

    let prevRank = new Map<string, number>();
    for (const d of depths) {
      let level = byDepth.get(d)!;
      if (prevRank.size) {
        level = [...level].sort((a, b) => {
          const ra = Math.min(...a.prereqs.map((p) => prevRank.get(p.techId) ?? Infinity));
          const rb = Math.min(...b.prereqs.map((p) => prevRank.get(p.techId) ?? Infinity));
          return ra - rb;
        });
      }
      for (let i = 0; i < level.length; i += MAX_ROW_WIDTH) {
        rows.push(level.slice(i, i + MAX_ROW_WIDTH));
      }
      prevRank = new Map(level.map((t, i) => [t.id, i]));
    }
  }
  return rows;
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
  techsTotal: number;
}

/** Sums every level strictly after `current` up to and including `target`
 * for each tech (mirrors the incremental-cost pattern used by the gear/charm
 * calculators), plus overall completion stats across the whole tree. */
export function calcResearchPlan(techs: ResearchTech[], plan: ResearchPlan): ResearchPlanTotals {
  const cost = emptyCost();
  let timeSeconds = 0;
  let powerGained = 0;
  let levelsCurrent = 0;
  let levelsTarget = 0;
  let levelsMax = 0;
  let techsMaxedCurrent = 0;

  for (const tech of techs) {
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

  return { cost, timeSeconds, powerGained, levelsCurrent, levelsTarget, levelsMax, techsMaxedCurrent, techsTotal: techs.length };
}

export interface CategoryBonus {
  category: string;
  label: string;
  /** Whether this category's stat is a percentage (Economy, most of
   * Battle/Growth) or a flat number (e.g. Training Capacity, Infirmary
   * Capacity, Deployment Capacity, March Queue). */
  isPercent: boolean;
  /** Bonus gained specifically from techs you've set an active goal for
   * (target > current) -- NOT the absolute total including stuff already
   * maxed with no pending goal. Only counts what you're actually choosing
   * to upgrade right now. */
  gain: number;
}

/** Bonus gained per category from active upgrade goals only. A tech sitting
 * at some current level with no goal beyond it (including one marked
 * "already maxed" via the quick-tap pill) contributes nothing here -- this
 * is specifically "what do I get from the upgrades I'm planning," not a
 * running total of everything already researched. */
export function calcCategoryBonuses(techs: ResearchTech[], categoryOrder: string[], plan: ResearchPlan): CategoryBonus[] {
  return categoryOrder.map((category) => {
    const catTechs = techsInCategory(techs, category);
    let gain = 0;
    let isPercent = true;
    for (const tech of catTechs) {
      if (tech.levels[0]) isPercent = tech.levels[0].effectIsPercent;
      const state = plan[tech.id] ?? { current: 0, target: 0 };
      if (state.target <= state.current) continue;
      const curLv = tech.levels[state.current - 1];
      const tgtLv = tech.levels[state.target - 1];
      const curEffect = curLv ? curLv.effectValue : 0;
      const tgtEffect = tgtLv ? tgtLv.effectValue : 0;
      gain += tgtEffect - curEffect;
    }
    return { category, label: catTechs[0] ? statLabel(catTechs[0]) : category, isPercent, gain: round2(gain) };
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
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
