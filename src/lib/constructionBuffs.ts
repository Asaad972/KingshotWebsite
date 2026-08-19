/** Same Buffs pattern as the Research Tree's speed buffs (src/lib/
 * researchCalc.ts) -- a free-form % input plus fixed-% toggles/select,
 * all stacking additively before dividing the total time once at the
 * end. constructionSpeedPercent is the manually-typed one (own gear/VIP/
 * whatever isn't covered by a named checkpoint below); the rest are
 * fixed-% checkpoints. */
export interface ConstructionSpeedBuffs {
  constructionSpeedPercent: number;
  doubleTime: boolean;
  petSkillPercent: number;
  chiefMinister: boolean;
  kingSkill: boolean;
}

export const DOUBLE_TIME_PERCENT = 20;
export const CHIEF_MINISTER_PERCENT = 10;
export const KING_SKILL_PERCENT = 15;
export const PET_SKILL_PERCENTS = [5, 7, 9, 10, 15];

export function defaultConstructionSpeedBuffs(): ConstructionSpeedBuffs {
  return { constructionSpeedPercent: 0, doubleTime: false, petSkillPercent: 0, chiefMinister: false, kingSkill: false };
}

export function constructionSpeedMultiplier(buffs: ConstructionSpeedBuffs): number {
  return (
    1 +
    buffs.constructionSpeedPercent / 100 +
    (buffs.doubleTime ? DOUBLE_TIME_PERCENT : 0) / 100 +
    buffs.petSkillPercent / 100 +
    (buffs.chiefMinister ? CHIEF_MINISTER_PERCENT : 0) / 100 +
    (buffs.kingSkill ? KING_SKILL_PERCENT : 0) / 100
  );
}
