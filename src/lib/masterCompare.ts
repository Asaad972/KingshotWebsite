import type { Master } from './masterTypes';
import { costForAffinityRange, costForTalentRange, costForSkillRange, formatLearnDuration } from './masterCalc';

export interface MasterMaxStats {
  id: string;
  name: string;
  type: string;
  image: string;
  maxBuffPercent: number;
  maxBuffStat: string;
  talentSkillsPower: number;
  maxAffinityPoints: number;
  totalEmblemsToMax: number;
  maxManuscripts: number;
  maxLearningXP: number;
  maxLearnDuration: string;
}

/** Everything needed to max a Master, for the Compare view -- every number
 * here is a real (0, max] sum from the same calc functions the planner
 * itself uses, never a separate/guessed formula. "Talent + Skills Power" is
 * deliberately not called "Max Power": the source site has no flat Power
 * column on the Affinity table, so a full combined power figure (which
 * would also fold in level/class power) isn't backed by real data.
 * totalEmblemsToMax is Affinity emblems only -- Special Research costs a
 * flat 14,000 emblems for every master (confirmed on the source site), so
 * folding it in would drown out the one number that actually varies by
 * master and makes masters wrongly tie in the comparison. */
export function getMasterMaxStats(master: Master): MasterMaxStats {
  const affinity = costForAffinityRange(master, 0, master.maxAffinity)!;
  const talentMaxLevel = master.talent.levels.length;
  const talent = costForTalentRange(master.talent, 0, talentMaxLevel)!;

  let manuscripts = 0;
  let learningXP = 0;
  let skillsPower = 0;
  for (const skill of master.skills) {
    const r = costForSkillRange(skill, 0, skill.levels.length)!;
    manuscripts += r.totalManuscripts;
    learningXP += r.totalLearningXP;
    skillsPower += skill.levels[skill.levels.length - 1]?.power ?? 0;
  }

  const buffPercent = Math.max(0, ...affinity.statsAtTarget.map((s) => s.percent));
  const buffStat = affinity.statsAtTarget[0]?.name ?? '';

  return {
    id: master.id,
    name: master.name,
    type: master.type,
    image: master.image,
    maxBuffPercent: buffPercent,
    maxBuffStat: buffStat,
    talentSkillsPower: talent.powerGained + skillsPower,
    maxAffinityPoints: affinity.totalPoints,
    totalEmblemsToMax: affinity.totalEmblems,
    maxManuscripts: manuscripts,
    maxLearningXP: learningXP,
    maxLearnDuration: formatLearnDuration(learningXP),
  };
}
