// Shared types for all 3 Research Tree branches (Economy, Growth, Battle).
// Growth/Battle mix flat stat bonuses (e.g. "+1,800 Infirmary Capacity",
// "+320 Deployment Capacity") in with percentage ones (Economy is 100%
// percent-based), hence effectValue + effectIsPercent instead of a single
// "effectPercent" number.

export type ResourceCost = { bread: number; wood: number; stone: number; iron: number; gold: number };

export interface ResearchLevel {
  level: number;
  cost: ResourceCost;
  timeSeconds: number;
  power: number;
  effectValue: number;
  effectIsPercent: boolean;
  /** Academy hall level required to unlock researching this level. */
  academyLevel: number;
}

export interface ResearchPrereq {
  techId: string;
  level: number;
}

export interface ResearchTech {
  id: string;
  name: string;
  /** Groups techs into tree lanes/branches for layout + icon choice --
   * plain string per tree (Economy: 'bread-output' etc; Growth/Battle: the
   * tech's own base name, e.g. 'Weapons Prep'). No meaning in-game itself. */
  category: string;
  desc: string;
  effectRange: string;
  maxLevel: number;
  unlockAcademyLevel: number;
  /** Other techs in the SAME tree (+ their level) that must be researched
   * first. Cross-system requirements (Academy level, troop-tier upgrades
   * from outside this tree) are not represented here. */
  prereqs: ResearchPrereq[];
  levels: ResearchLevel[];
}
