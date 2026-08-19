export interface AffinityLevel {
  level: number; // 0..100
  /** Points required to reach this level from the previous one (0 at level 0). */
  cost: number;
  /** Master Emblems spent when reaching this level -- only non-zero at levels 10,20,...,100. */
  emblems: number;
  /** Relationship status reached at this level (e.g. "Acquaintance 1"), only at the same 10-level marks as emblems. */
  statusName: string | null;
  /** Raw cumulative stat text achieved at this level (e.g. "Squad ATK +2.85%"), not a delta. */
  statText: string | null;
  /** True at levels 10,20,...,100 -- an advancement checkpoint. */
  isMilestone: boolean;
}

export type SkillRequirement =
  | { type: 'affinity'; value: number; text: string }
  | { type: 'skillPower'; value: number; text: string }
  | { type: 'other'; value: null; text: string };

export interface SkillLevel {
  level: number;
  valuesText: string;
  power: number;
  learningXP: number;
  manuscripts: number;
  requirement: SkillRequirement | null;
}

export interface Skill {
  name: string;
  /** Affinity needed to unlock this skill's level 1 -- derived as the smallest
   * affinity gate found anywhere in its own level table (the site doesn't
   * always repeat it on row 1). */
  unlockAffinity: number;
  levels: SkillLevel[];
}

export interface TalentLevel {
  level: number;
  valuesText: string;
  power: number;
}

export interface Talent {
  name: string;
  levels: TalentLevel[];
}

export interface ResearchMilestone {
  researchLevel: number;
  statName: string;
  amount: string;
}

export interface ResearchPath {
  tree: number;
  name: string;
  tier: string;
  levelStart: number;
  levelEnd: number;
  researches: number;
  emblemsPerResearch: number;
  emblemsTotal: number;
  powerTotal: number;
  progressBuffText: string;
  pathStatsText: string;
  milestones: ResearchMilestone[];
}

export interface Master {
  id: string;
  name: string;
  type: string;
  image: string;
  maxAffinity: number;
  maxStatus: string;
  affinity: AffinityLevel[];
  talent: Talent;
  skills: Skill[];
  research: ResearchPath[];
}
