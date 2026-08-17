import { TROOP_TIERS, getTroopTier, type TroopType, type ResourceCost } from './troopData';

export type CalcMode = 'train' | 'promote';
export type CalcType = 'time' | 'quantity';

export interface SpeedBuffs {
  /** Free-form training speed % from research/gear/hero etc. */
  trainingSpeedPercent: number;
  kingdomSkill: boolean;
  nobleAdvisor: boolean;
  kvkBonus: boolean;
  /** Saul's skill -- a flat 15% discount on resource costs, not a speed buff. */
  saulSkill: boolean;
}

const KINGDOM_SKILL_PERCENT = 30;
const NOBLE_ADVISOR_PERCENT = 50;
const KVK_BONUS_PERCENT = 25;
const SAUL_SKILL_COST_DISCOUNT_PERCENT = 15;

const TROOP_TYPES: TroopType[] = ['infantry', 'cavalry', 'archer'];

/** Total time is divided by this multiplier -- every buff stacks additively
 * before being applied, matching the reference calculator's own formula. */
export function speedMultiplier(buffs: SpeedBuffs): number {
  return (
    1 +
    buffs.trainingSpeedPercent / 100 +
    (buffs.kingdomSkill ? KINGDOM_SKILL_PERCENT : 0) / 100 +
    (buffs.nobleAdvisor ? NOBLE_ADVISOR_PERCENT : 0) / 100 +
    (buffs.kvkBonus ? KVK_BONUS_PERCENT : 0) / 100
  );
}

function costFraction(buffs: SpeedBuffs): number {
  return buffs.saulSkill ? 1 - SAUL_SKILL_COST_DISCOUNT_PERCENT / 100 : 1;
}

/** Promoting only costs/takes the INCREMENTAL amount beyond the current
 * tier (you already paid for the base troop) -- training from scratch uses
 * the target tier's full cumulative amount. Clamped at 0 so an invalid
 * target-below-current selection can't produce negative results. */
function perUnitCost(troopType: TroopType, mode: CalcMode, targetTierId: string, currentTierId?: string): ResourceCost {
  const target = getTroopTier(targetTierId);
  const current = mode === 'promote' ? getTroopTier(currentTierId) : undefined;
  if (!target) return { bread: 0, wood: 0, stone: 0, iron: 0 };

  if (mode === 'promote') {
    const currentCost = current?.cost[troopType];
    return {
      bread: Math.max(0, target.cost[troopType].bread - (currentCost?.bread ?? 0)),
      wood: Math.max(0, target.cost[troopType].wood - (currentCost?.wood ?? 0)),
      stone: Math.max(0, target.cost[troopType].stone - (currentCost?.stone ?? 0)),
      iron: Math.max(0, target.cost[troopType].iron - (currentCost?.iron ?? 0)),
    };
  }

  return target.cost[troopType];
}

export interface TroopPlanResult {
  quantity: number;
  timeSeconds: number;
  /** Resource cost, broken out per troop type since Infantry/Cavalry/Archer
   * genuinely cost different amounts even though time/power/points don't
   * differ between them. */
  costByType: Record<TroopType, ResourceCost>;
  power: number;
  kvkPoints: number;
  sgPoints: number;
}

/** calcType 'time': given a troop quantity, find the time+resources needed.
 * calcType 'quantity': given available speed-up seconds, find the max
 * troops trainable in that time. */
export function calcTroopPlan(params: {
  mode: CalcMode;
  calcType: CalcType;
  currentTierId?: string;
  targetTierId: string;
  quantity: number;
  availableSeconds: number;
  buffs: SpeedBuffs;
}): TroopPlanResult | null {
  const { mode, calcType, currentTierId, targetTierId, quantity, availableSeconds, buffs } = params;
  const target = getTroopTier(targetTierId);
  if (!target) return null;
  const current = mode === 'promote' ? getTroopTier(currentTierId) : undefined;

  const buildTimePerUnit = mode === 'promote' ? Math.max(0, target.buildTime - (current?.buildTime ?? 0)) : target.buildTime;
  const powerPerUnit = mode === 'promote' ? Math.max(0, target.power - (current?.power ?? 0)) : target.power;

  const mult = speedMultiplier(buffs);
  const finalQuantity =
    calcType === 'quantity'
      ? buildTimePerUnit > 0
        ? Math.floor((availableSeconds * mult) / buildTimePerUnit)
        : 0
      : Math.max(0, Math.floor(quantity));
  const timeSeconds = calcType === 'quantity' ? availableSeconds : Math.floor((buildTimePerUnit * finalQuantity) / mult);

  const discount = costFraction(buffs);
  const costByType = Object.fromEntries(
    TROOP_TYPES.map((troopType) => {
      const perUnit = perUnitCost(troopType, mode, targetTierId, currentTierId);
      return [
        troopType,
        {
          bread: Math.floor(perUnit.bread * finalQuantity * discount),
          wood: Math.floor(perUnit.wood * finalQuantity * discount),
          stone: Math.floor(perUnit.stone * finalQuantity * discount),
          iron: Math.floor(perUnit.iron * finalQuantity * discount),
        },
      ];
    })
  ) as Record<TroopType, ResourceCost>;

  return {
    quantity: finalQuantity,
    timeSeconds,
    costByType,
    power: powerPerUnit * finalQuantity,
    kvkPoints: target.kvkPoints * finalQuantity,
    sgPoints: target.sgPoints * finalQuantity,
  };
}

/** Tiers strictly above `currentTierId`'s order -- used to keep the Target
 * dropdown from offering a nonsensical downgrade in Promote mode. */
export function tiersAbove(currentTierId: string | undefined): typeof TROOP_TIERS {
  const current = getTroopTier(currentTierId);
  if (!current) return TROOP_TIERS;
  return TROOP_TIERS.filter((t) => t.order > current.order);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
