import { ECONOMY_TECHS, getEconomyTech } from './researchEconomyData';
import { GROWTH_TECHS, getGrowthTech } from './researchGrowthData';
import { BATTLE_TECHS, getBattleTech } from './researchBattleData';
import type { ResearchTech } from './researchTypes';

export type TreeId = 'economy' | 'growth' | 'battle';

/** Icon key resolved to an actual component in ResearchIcons.tsx -- kept as
 * a plain string here so this data file stays framework-agnostic. */
export type IconKey = 'bread' | 'wood' | 'stone' | 'iron' | 'sword' | 'shield' | 'heart' | 'flag' | 'crosshair' | 'gear';

export interface TreeDef {
  id: TreeId;
  label: string;
  techs: ResearchTech[];
  /** Display order for the tree's category lanes/legend. */
  categoryOrder: string[];
  categoryIcon: Record<string, IconKey>;
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
      'Bread Output': 'bread',
      'Food Foraging': 'bread',
      'Wood Output': 'wood',
      'Wood Gathering': 'wood',
      'Stone Output': 'stone',
      'Stone Gathering': 'stone',
      'Iron Output': 'iron',
      'Iron Mining': 'iron',
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
      Bandaging: 'heart',
      'Ward Expansion': 'heart',
      'Camp Expansion': 'flag',
      'Command Tactics': 'flag',
      'Trainer Tools': 'gear',
      'Tool Enhancement': 'gear',
      'Tooling Up': 'gear',
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
      'Weapons Prep': 'sword',
      'Reprisal Tactics': 'sword',
      'Precision Targeting': 'sword',
      'Cavalry Charge': 'sword',
      'Defensive Formations': 'shield',
      'Picket Lines': 'shield',
      'Bulwark Formations': 'shield',
      'Special Defensive Training': 'shield',
      'Survival Techniques': 'heart',
      'Shield Upgrade': 'heart',
      'Leathercraft': 'heart',
      'Fortified Mail': 'heart',
      'Assault Techniques': 'crosshair',
      'Close Combat': 'crosshair',
      'Targeted Sniping': 'crosshair',
      'Lance Upgrade': 'crosshair',
      'Regimental Expansion': 'flag',
    },
    getTech: getBattleTech,
  },
};

export const TREE_ORDER: TreeId[] = ['growth', 'economy', 'battle'];
