import type { Master } from './masterTypes';
import { costForAffinityRange, costForTalentRange, costForSkillRange, costForResearchRange, formatLearnDuration } from './masterCalc';

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

/** Everything needed to fully max a Master, for the Compare view -- every
 * number here is a real (0, max] sum from the same calc functions the
 * planner itself uses, never a separate/guessed formula. "Talent + Skills
 * Power" is deliberately not called "Max Power": the source site has no
 * flat Power column on the Affinity table, so a full combined power figure
 * (which would also fold in level/class power) isn't backed by real data. */
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

  const maxResearchLevel = master.research.reduce((m, p) => Math.max(m, p.levelEnd), 0);
  const research = costForResearchRange(master, 0, maxResearchLevel);

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
    totalEmblemsToMax: affinity.totalEmblems + (research?.totalEmblems ?? 0),
    maxManuscripts: manuscripts,
    maxLearningXP: learningXP,
    maxLearnDuration: formatLearnDuration(learningXP),
  };
}
