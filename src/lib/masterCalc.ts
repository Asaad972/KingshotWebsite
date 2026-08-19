import type { Master, Skill, Talent, AffinityLevel, ResearchMilestone } from './masterTypes';

/** Parses a raw cumulative stat string like "Squad ATK +1.58%, Squad DEF +1.58%"
 * into named percent values -- masters differ in which stat(s) they grant
 * and how many, so this never assumes a single fixed stat. */
export function parseStatText(text: string | null): { name: string; percent: number }[] {
  if (!text) return [];
  return text.split(',').map((part) => {
    const m = part.trim().match(/^(.+?)\s*\+([\d.]+)%$/);
    return m ? { name: m[1].trim(), percent: parseFloat(m[2]) } : { name: part.trim(), percent: 0 };
  });
}

export interface AffinityRangeResult {
  totalPoints: number;
  totalEmblems: number;
  checkpoints: AffinityLevel[];
  statsAtCurrent: { name: string; percent: number }[];
  statsAtTarget: { name: string; percent: number }[];
  statsDelta: { name: string; percent: number }[];
  statusReached: string | null;
}

/** Sums points/emblems across (current, target], collects the 10-level
 * advancement checkpoints crossed, and looks up the cumulative stat value
 * at current vs target to report the actual improvement (these are
 * snapshots per level, not deltas to sum). */
export function costForAffinityRange(master: Master, current: number, target: number): AffinityRangeResult | null {
  if (target <= current || target > master.maxAffinity || current < 0) return null;

  let totalPoints = 0;
  let totalEmblems = 0;
  const checkpoints: AffinityLevel[] = [];
  for (let lvl = current + 1; lvl <= target; lvl++) {
    const data = master.affinity[lvl];
    if (!data) continue;
    totalPoints += data.cost;
    totalEmblems += data.emblems;
    if (data.isMilestone) checkpoints.push(data);
  }

  const statsAtCurrent = parseStatText(master.affinity[current]?.statText ?? null);
  const statsAtTarget = parseStatText(master.affinity[target]?.statText ?? null);
  const statsDelta = statsAtTarget.map((t) => {
    const c = statsAtCurrent.find((s) => s.name === t.name);
    return { name: t.name, percent: Math.round((t.percent - (c?.percent ?? 0)) * 100) / 100 };
  });

  const lastCheckpoint = checkpoints[checkpoints.length - 1];
  return {
    totalPoints,
    totalEmblems,
    checkpoints,
    statsAtCurrent,
    statsAtTarget,
    statsDelta,
    statusReached: lastCheckpoint ? lastCheckpoint.statusName : null,
  };
}

export interface SkillRangeResult {
  totalLearningXP: number;
  totalManuscripts: number;
  requiredAffinity: number; // highest affinity gate crossed in this range, 0 if none
  valueAtCurrent: string | null;
  valueAtTarget: string | null;
}

/** Sums Learning XP / Manuscripts across (current, target], and reports the
 * highest Affinity gate crossed so the UI can prompt to include that
 * affinity bump automatically -- per-skill, since gates vary by master AND
 * by skill (some require Affinity, some require the skill's own power). */
export function costForSkillRange(skill: Skill, current: number, target: number): SkillRangeResult | null {
  const maxLevel = skill.levels.length;
  if (target <= current || target > maxLevel || current < 0) return null;

  let totalLearningXP = 0;
  let totalManuscripts = 0;
  let requiredAffinity = 0;
  for (let lvl = current + 1; lvl <= target; lvl++) {
    const data = skill.levels[lvl - 1];
    if (!data) continue;
    totalLearningXP += data.learningXP;
    totalManuscripts += data.manuscripts;
    if (data.requirement?.type === 'affinity') {
      requiredAffinity = Math.max(requiredAffinity, data.requirement.value);
    }
  }
  requiredAffinity = Math.max(requiredAffinity, skill.unlockAffinity);

  const valueAtCurrent = current > 0 ? skill.levels[current - 1]?.valuesText ?? null : null;
  const valueAtTarget = skill.levels[target - 1]?.valuesText ?? null;

  return { totalLearningXP, totalManuscripts, requiredAffinity, valueAtCurrent, valueAtTarget };
}

export interface TalentRangeResult {
  valueAtCurrent: string | null;
  valueAtTarget: string | null;
  powerAtCurrent: number;
  powerAtTarget: number;
  powerGained: number;
}

/** Talent has no material cost data on the source site -- just level
 * snapshots (value + power), so this is a lookup, not a sum. */
export function costForTalentRange(talent: Talent, current: number, target: number): TalentRangeResult | null {
  const maxLevel = talent.levels.length;
  if (target <= current || target > maxLevel || current < 0) return null;

  const currentData = current > 0 ? talent.levels[current - 1] : null;
  const targetData = talent.levels[target - 1];
  if (!targetData) return null;

  return {
    valueAtCurrent: currentData?.valuesText ?? null,
    valueAtTarget: targetData.valuesText,
    powerAtCurrent: currentData?.power ?? 0,
    powerAtTarget: targetData.power,
    powerGained: targetData.power - (currentData?.power ?? 0),
  };
}

export interface ResearchRangeResult {
  totalEmblems: number;
  totalPower: number;
  progressBuffGained: number; // Squad HP % gained, prorated from real per-path totals
  milestonesCrossed: (ResearchMilestone & { pathName: string })[];
  pathsCrossed: string[];
}

/** Special Research spans 1000 levels across named paths with different
 * per-research emblem rates (a real "tree 1 vs tree 2" split, not uniform).
 * Power and the Squad HP progress buff are only published as per-path
 * totals over a known level count, so per-level = total / path length --
 * a real derived rate, not a guess. */
export function costForResearchRange(master: Master, current: number, target: number): ResearchRangeResult | null {
  const maxLevel = master.research.reduce((max, p) => Math.max(max, p.levelEnd), 0);
  if (target <= current || target > maxLevel || current < 0) return null;

  let totalEmblems = 0;
  let totalPower = 0;
  let progressBuffGained = 0;
  const milestonesCrossed: (ResearchMilestone & { pathName: string })[] = [];
  const pathsCrossed = new Set<string>();

  for (const path of master.research) {
    const from = Math.max(current, path.levelStart - 1);
    const to = Math.min(target, path.levelEnd);
    if (to <= from) continue;
    const levelsInRange = to - from;
    totalEmblems += levelsInRange * path.emblemsPerResearch;
    totalPower += (path.powerTotal / path.researches) * levelsInRange;
    const buffPercent = parseFloat(path.progressBuffText.match(/([\d.]+)%/)?.[1] ?? '0');
    progressBuffGained += (buffPercent / path.researches) * levelsInRange;
    pathsCrossed.add(path.name);
    for (const m of path.milestones) {
      if (m.researchLevel > current && m.researchLevel <= target) {
        milestonesCrossed.push({ ...m, pathName: path.name });
      }
    }
  }

  return {
    totalEmblems,
    totalPower: Math.round(totalPower),
    progressBuffGained: Math.round(progressBuffGained * 100) / 100,
    milestonesCrossed,
    pathsCrossed: Array.from(pathsCrossed),
  };
}
