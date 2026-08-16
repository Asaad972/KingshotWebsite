'use client';

import { useMemo, useState } from 'react';
import { ARMOR_SLOTS, TROOP_LABELS, type ArmorSlotId, type TroopType } from '@/lib/heroGearData';
import { calcHeroGearPlan, type ArmorSelection, type ArmorSelections, type HeroGearMaterials } from '@/lib/heroGearCalc';
import ArmorSlotCard from './ArmorSlotCard';
import WeaponSlotCard from './WeaponSlotCard';
import HeroGearMaterialsPanel from './HeroGearMaterialsPanel';
import HeroGearStatsPanel from './HeroGearStatsPanel';

const TROOP_ORDER: TroopType[] = ['infantry', 'cavalry', 'archers'];

interface TroopGearPlan {
  armor: ArmorSelections;
  weaponCurrent: number;
  weaponTarget: number;
}

function makeEmptyArmorSelections(): ArmorSelections {
  const out = {} as ArmorSelections;
  for (const slot of ARMOR_SLOTS) {
    out[slot.id] = { currentLevel: 0, targetLevel: 0, currentMastery: 0, targetMastery: 0 };
  }
  return out;
}

function makeEmptyTroopPlan(): TroopGearPlan {
  return { armor: makeEmptyArmorSelections(), weaponCurrent: 0, weaponTarget: 0 };
}

function makeEmptyAllPlans(): Record<TroopType, TroopGearPlan> {
  return { infantry: makeEmptyTroopPlan(), cavalry: makeEmptyTroopPlan(), archers: makeEmptyTroopPlan() };
}

/**
 * Hero Gear Calculator -- an isolated, self-contained feature (this
 * component + src/lib/heroGearData.ts + src/lib/heroGearCalc.ts + everything
 * in src/components/heroGear/). To remove it entirely: delete this folder,
 * the two lib files, the /hero-gear-calculator page, its two /public
 * image folders, and its one link on the home page's Explore grid.
 * Nothing else in the app imports from here.
 */
export default function HeroGearCalculatorSection() {
  const [plans, setPlans] = useState<Record<TroopType, TroopGearPlan>>(makeEmptyAllPlans);
  const [activeTroop, setActiveTroop] = useState<TroopType>('infantry');
  const [owned, setOwned] = useState<Record<string, number>>({});

  const resultsByTroop = useMemo(() => {
    const out = {} as Record<TroopType, ReturnType<typeof calcHeroGearPlan>>;
    for (const troop of TROOP_ORDER) {
      const plan = plans[troop];
      out[troop] = calcHeroGearPlan(plan.armor, plan.weaponCurrent, plan.weaponTarget);
    }
    return out;
  }, [plans]);

  const combinedMaterials = useMemo(() => {
    const total: HeroGearMaterials = { xp: 0, mithril: 0, mythicGears: 0, forgehammers: 0 };
    for (const troop of TROOP_ORDER) {
      const m = resultsByTroop[troop].materials;
      total.xp += m.xp;
      total.mithril += m.mithril;
      total.mythicGears += m.mythicGears;
      total.forgehammers += m.forgehammers;
    }
    return total;
  }, [resultsByTroop]);

  const statsByTroop = useMemo(() => {
    const out = {} as Record<TroopType, ReturnType<typeof calcHeroGearPlan>['statBonus']>;
    for (const troop of TROOP_ORDER) out[troop] = resultsByTroop[troop].statBonus;
    return out;
  }, [resultsByTroop]);

  const activePlan = plans[activeTroop];

  const handleArmorChange = (slotId: ArmorSlotId, next: ArmorSelection) => {
    setPlans((prev) => ({ ...prev, [activeTroop]: { ...prev[activeTroop], armor: { ...prev[activeTroop].armor, [slotId]: next } } }));
  };
  const setWeaponCurrent = (v: number) => {
    setPlans((prev) => ({ ...prev, [activeTroop]: { ...prev[activeTroop], weaponCurrent: v } }));
  };
  const setWeaponTarget = (v: number) => {
    setPlans((prev) => ({ ...prev, [activeTroop]: { ...prev[activeTroop], weaponTarget: v } }));
  };

  const handleResetActive = () => {
    setPlans((prev) => ({ ...prev, [activeTroop]: makeEmptyTroopPlan() }));
  };

  const handleChangeOwned = (materialId: string, value: number) => {
    setOwned((prev) => ({ ...prev, [materialId]: value }));
  };

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">Hero Gear Calculator</h1>
          <p className="text-xs text-parchment-500 mt-0.5">
            Experimental -- material costs and % bonuses are real, reverse-engineered from a live reference calculator
            and cross-checked against published gear/mastery tables.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetActive}
          className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
        >
          Reset {TROOP_LABELS[activeTroop]}
        </button>
      </div>

      <div className="flex gap-1.5 rounded-lg bg-stone-900 border border-stone-700 p-1 w-fit mt-2">
        {TROOP_ORDER.map((troop) => (
          <button
            key={troop}
            type="button"
            onClick={() => setActiveTroop(troop)}
            className={`focus-ring rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTroop === troop ? 'bg-gold-500 text-stone-950' : 'text-parchment-300 hover:text-parchment-100'
            }`}
          >
            {TROOP_LABELS[troop]}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARMOR_SLOTS.map((slot) => (
            <ArmorSlotCard
              key={slot.id}
              slotId={slot.id}
              label={slot.label}
              icon={slot.icon}
              selection={activePlan.armor[slot.id]}
              onChange={handleArmorChange}
            />
          ))}
          <WeaponSlotCard
            current={activePlan.weaponCurrent}
            target={activePlan.weaponTarget}
            onChangeCurrent={setWeaponCurrent}
            onChangeTarget={setWeaponTarget}
          />
        </div>

        <div className="flex flex-col gap-3">
          <HeroGearMaterialsPanel required={combinedMaterials} owned={owned} onChangeOwned={handleChangeOwned} />
          <HeroGearStatsPanel statsByTroop={statsByTroop} />
        </div>
      </div>
    </div>
  );
}
