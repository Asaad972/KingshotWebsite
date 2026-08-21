// Real in-game screenshots (user-provided) -- one photo per charm LEVEL,
// shared across every charm slot of that troop type (a charm's art depends
// on its level and troop type, not on which of the 3 slots or which of the
// 2 gear pieces it's attached to -- unlike gear, which has one photo set
// per individual piece).
import type { TroopType } from './gearData';

const LEVEL_IMAGES: Partial<Record<TroopType, Partial<Record<number, string>>>> = {
  cavalry: {
    1: '/charm/levels/cavalry/cavalry_lvl1.webp',
    2: '/charm/levels/cavalry/cavalry_lvl2.webp',
    3: '/charm/levels/cavalry/cavalry_lvl3.webp',
    4: '/charm/levels/cavalry/cavalry_lvl4.webp',
    5: '/charm/levels/cavalry/cavalry_lvl5.webp',
    6: '/charm/levels/cavalry/cavalry_lvl6.webp',
    7: '/charm/levels/cavalry/cavalry_lvl7.webp',
    8: '/charm/levels/cavalry/cavalry_lvl8.webp',
    9: '/charm/levels/cavalry/cavalry_lvl9.webp',
    10: '/charm/levels/cavalry/cavalry_lvl10.webp',
    11: '/charm/levels/cavalry/cavalry_lvl11.webp',
    12: '/charm/levels/cavalry/cavalry_lvl12.webp',
    13: '/charm/levels/cavalry/cavalry_lvl13.webp',
    14: '/charm/levels/cavalry/cavalry_lvl14.webp',
    15: '/charm/levels/cavalry/cavalry_lvl15.webp',
    16: '/charm/levels/cavalry/cavalry_lvl16.webp',
    17: '/charm/levels/cavalry/cavalry_lvl17.webp',
    18: '/charm/levels/cavalry/cavalry_lvl18.webp',
    19: '/charm/levels/cavalry/cavalry_lvl19.webp',
    20: '/charm/levels/cavalry/cavalry_lvl20.webp',
    21: '/charm/levels/cavalry/cavalry_lvl21.webp',
    22: '/charm/levels/cavalry/cavalry_lvl22.webp',
  },
  infantry: {
    1: '/charm/levels/infantry/infantry_lvl1.webp',
    2: '/charm/levels/infantry/infantry_lvl2.webp',
    3: '/charm/levels/infantry/infantry_lvl3.webp',
    4: '/charm/levels/infantry/infantry_lvl4.webp',
    5: '/charm/levels/infantry/infantry_lvl5.webp',
    6: '/charm/levels/infantry/infantry_lvl6.webp',
    7: '/charm/levels/infantry/infantry_lvl7.webp',
    8: '/charm/levels/infantry/infantry_lvl8.webp',
    9: '/charm/levels/infantry/infantry_lvl9.webp',
    10: '/charm/levels/infantry/infantry_lvl10.webp',
    11: '/charm/levels/infantry/infantry_lvl11.webp',
    12: '/charm/levels/infantry/infantry_lvl12.webp',
    13: '/charm/levels/infantry/infantry_lvl13.webp',
    14: '/charm/levels/infantry/infantry_lvl14.webp',
    15: '/charm/levels/infantry/infantry_lvl15.webp',
    16: '/charm/levels/infantry/infantry_lvl16.webp',
    17: '/charm/levels/infantry/infantry_lvl17.webp',
    18: '/charm/levels/infantry/infantry_lvl18.webp',
    19: '/charm/levels/infantry/infantry_lvl19.webp',
    20: '/charm/levels/infantry/infantry_lvl20.webp',
    21: '/charm/levels/infantry/infantry_lvl21.webp',
    22: '/charm/levels/infantry/infantry_lvl22.webp',
  },
};

export function imageForCharmLevel(troopType: TroopType, order: number): string | undefined {
  return LEVEL_IMAGES[troopType]?.[order];
}

export function hasRealCharmPhotos(troopType: TroopType): boolean {
  return Object.keys(LEVEL_IMAGES[troopType] ?? {}).length > 0;
}
