'use client';

import { useMemo, useState } from 'react';
import { GEAR_SLOTS, type GearSlotId } from '@/lib/gearData';
import { CHARM_SLOTS } from '@/lib/charmData';
import { calcCharmPlan, type CharmSelections } from '@/lib/charmCalc';
import CharmSlotGroup from './CharmSlotGroup';
import CharmMaterialsPanel from './CharmMaterialsPanel';
import CharmTroopStatsPanel from './CharmTroopStatsPanel';
import { CapIcon, WatchIcon, CoatIcon, PantsIcon, BeltIcon, StaffIcon } from './CharmIcons';

const SLOT_ICONS: Record<GearSlotId, React.ReactNode> = {
  cap: <CapIcon />,
  watch: <WatchIcon />,
  coat: <CoatIcon />,
  pants: <PantsIcon />,
  belt: <BeltIcon />,
  staff: <StaffIcon />,
};

function makeEmptySelections(): CharmSelections {
  const out: CharmSelections = {};
  for (const charm of CHARM_SLOTS) out[charm.id] = { currentId: 'base', targetId: 'base' };
  return out;
}

/**
 * Governor Charm Calculator -- an isolated, self-contained feature (this
 * component + src/lib/charmData.ts + src/lib/charmCalc.ts + everything in
 * src/components/charm/). To remove it entirely: delete this folder, the
 * two lib files, the /charm-calculator page, and its one link on the home
 * page's Explore grid. Nothing else in the app imports from here.
 */
export default function CharmCalculatorSection() {
  const [selections, setSelections] = useState<CharmSelections>(makeEmptySelections);
  const [owned, setOwned] = useState<Record<string, number>>({});

  const plan = useMemo(() => calcCharmPlan(selections), [selections]);

  const handleSelectLevel = (charmSlotId: string, mode: 'current' | 'target', levelId: string) => {
    setSelections((prev) => ({
      ...prev,
      [charmSlotId]: { ...prev[charmSlotId], [mode === 'current' ? 'currentId' : 'targetId']: levelId },
    }));
  };

  const handleReset = () => {
    setSelections(makeEmptySelections());
    setOwned({});
  };

  const handleChangeOwned = (materialId: string, value: number) => {
    setOwned((prev) => ({ ...prev, [materialId]: value }));
  };

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">Governor Charm Calculator</h1>
          <p className="text-xs text-parchment-500 mt-0.5">
            Experimental -- material costs and % bonuses are real, sourced from the charm database.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GEAR_SLOTS.map((slot) => (
            <CharmSlotGroup
              key={slot.id}
              gearSlotId={slot.id}
              gearSlotLabel={slot.label}
              icon={SLOT_ICONS[slot.id]}
              selections={selections}
              onSelectLevel={handleSelectLevel}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <CharmMaterialsPanel required={plan.materials} owned={owned} onChangeOwned={handleChangeOwned} />
          <CharmTroopStatsPanel troopStats={plan.troopStats} />
        </div>
      </div>
    </div>
  );
}
