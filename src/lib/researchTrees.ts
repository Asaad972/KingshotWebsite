import { ECONOMY_TECHS, getEconomyTech } from './researchEconomyData';
import { GROWTH_TECHS, getGrowthTech } from './researchGrowthData';
import { BATTLE_TECHS, getBattleTech } from './researchBattleData';
import type { ResearchTech } from './researchTypes';

export type TreeId = 'economy' | 'growth' | 'battle';

export interface CategoryIcon {
  src: string;
  alt: string;
}

export interface TreeDef {
  id: TreeId;
  label: string;
  techs: ResearchTech[];
  /** Display order for the tree's category lanes/legend. */
  categoryOrder: string[];
  /** One real icon per category, provided by the user (the Economy/Growth/
   * Battle ones are kingshotdata.com's own per-tech-line icons; the 5 base
   * resource icons live in ResearchIcons.tsx and are reused here for any
   * category without dedicated artwork yet). */
  categoryIcon: Record<string, CategoryIcon>;
  getTech: (id: string) => ResearchTech | undefined;
}

export const TREES: Record<TreeId, TreeDef> = {
  economy: {
    id: 'economy',
    label: 'Economy',
    techs: ECONOMY_TECHS,
    categoryOrder: [
      'Bread Output',
      'Food Foraging',
      'Wood Output',
      'Wood Gathering',
      'Stone Output',
      'Stone Gathering',
      'Iron Output',
      'Iron Mining',
    ],
    categoryIcon: {
      'Bread Output': { src: '/research/economy/bread-output.png', alt: 'Bread Output' },
      'Food Foraging': { src: '/research/economy/food-foraging.png', alt: 'Food Foraging' },
      'Wood Output': { src: '/research/economy/wood-output.png', alt: 'Wood Output' },
      'Wood Gathering': { src: '/research/economy/wood-gathering.png', alt: 'Wood Gathering' },
      'Stone Output': { src: '/research/economy/stone-output.png', alt: 'Stone Output' },
      'Stone Gathering': { src: '/research/economy/stone-gathering.png', alt: 'Stone Gathering' },
      // No dedicated icon file for this one yet -- falls back to the plain
      // iron resource icon until one's provided.
      'Iron Output': { src: '/research/resources/iron.png', alt: 'Iron Output' },
      'Iron Mining': { src: '/research/economy/iron-mining.png', alt: 'Iron Mining' },
    },
    getTech: getEconomyTech,
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    techs: GROWTH_TECHS,
    categoryOrder: [
      'Bandaging',
      'Ward Expansion',
      'Camp Expansion',
      'Command Tactics',
      'Trainer Tools',
      'Tool Enhancement',
      'Tooling Up',
    ],
    categoryIcon: {
      Bandaging: { src: '/research/growth/bandaging.png', alt: 'Bandaging' },
      'Ward Expansion': { src: '/research/growth/ward-expansion.png', alt: 'Ward Expansion' },
      'Camp Expansion': { src: '/research/growth/camp-expansion.png', alt: 'Camp Expansion' },
      'Command Tactics': { src: '/research/growth/command-tactics.png', alt: 'Command Tactics' },
      'Trainer Tools': { src: '/research/growth/trainer-tools.png', alt: 'Trainer Tools' },
      'Tool Enhancement': { src: '/research/growth/tool-enhancement.png', alt: 'Tool Enhancement' },
      'Tooling Up': { src: '/research/growth/tooling-up.png', alt: 'Tooling Up' },
    },
    getTech: getGrowthTech,
  },
  battle: {
    id: 'battle',
    label: 'Battle',
    techs: BATTLE_TECHS,
    categoryOrder: [
      'Weapons Prep',
      'Reprisal Tactics',
      'Precision Targeting',
      'Cavalry Charge',
      'Defensive Formations',
      'Picket Lines',
      'Bulwark Formations',
      'Special Defensive Training',
      'Survival Techniques',
      'Assault Techniques',
      'Regimental Expansion',
      'Close Combat',
      'Targeted Sniping',
      'Lance Upgrade',
      'Shield Upgrade',
      'Leathercraft',
      'Fortified Mail',
    ],
    categoryIcon: {
      'Weapons Prep': { src: '/research/battle/weapons-prep.png', alt: 'Weapons Prep' },
      'Reprisal Tactics': { src: '/research/battle/reprisal-tactics.png', alt: 'Reprisal Tactics' },
      'Precision Targeting': { src: '/research/battle/precision-targeting.png', alt: 'Precision Targeting' },
      'Cavalry Charge': { src: '/research/battle/cavalry-charge.png', alt: 'Cavalry Charge' },
      'Defensive Formations': { src: '/research/battle/defensive-formations.png', alt: 'Defensive Formations' },
      'Picket Lines': { src: '/research/battle/picket-lines.png', alt: 'Picket Lines' },
      'Bulwark Formations': { src: '/research/battle/bulwark-formations.png', alt: 'Bulwark Formations' },
      'Special Defensive Training': {
        src: '/research/battle/special-defensive-training.png',
        alt: 'Special Defensive Training',
      },
      'Survival Techniques': { src: '/research/battle/survival-techniques.png', alt: 'Survival Techniques' },
      'Assault Techniques': { src: '/research/battle/assault-techniques.png', alt: 'Assault Techniques' },
      'Regimental Expansion': { src: '/research/battle/regimental-expansion.png', alt: 'Regimental Expansion' },
      'Close Combat': { src: '/research/battle/close-combat.png', alt: 'Close Combat' },
      'Targeted Sniping': { src: '/research/battle/targeted-sniping.png', alt: 'Targeted Sniping' },
      'Lance Upgrade': { src: '/research/battle/lance-upgrade.png', alt: 'Lance Upgrade' },
      'Shield Upgrade': { src: '/research/battle/shield-upgrade.png', alt: 'Shield Upgrade' },
      Leathercraft: { src: '/research/battle/leathercraft.png', alt: 'Leathercraft' },
      'Fortified Mail': { src: '/research/battle/fortified-mail.png', alt: 'Fortified Mail' },
    },
    getTech: getBattleTech,
  },
};

export const TREE_ORDER: TreeId[] = ['growth', 'economy', 'battle'];
