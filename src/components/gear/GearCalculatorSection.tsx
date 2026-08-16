'use client';

import { useMemo, useState } from 'react';
import { GEAR_SLOTS, type GearSlotId } from '@/lib/gearData';
import { calcGearPlan, type GearSelections } from '@/lib/gearCalc';
import GearSlotCard from './GearSlotCard';
import GearLevelSelector from './GearLevelSelector';
import GearMaterialsPanel from './GearMaterialsPanel';
import GearTroopStatsPanel from './GearTroopStatsPanel';
import { CapIcon, WatchIcon, CoatIcon, PantsIcon, BeltIcon, StaffIcon, CrownIcon } from './GearIcons';

const SLOT_ICONS: Record<GearSlotId, React.ReactNode> = {
  cap: <CapIcon />,
  watch: <WatchIcon />,
  coat: <CoatIcon />,
  pants: <PantsIcon />,
  belt: <BeltIcon />,
  staff: <StaffIcon />,
};

function makeEmptySelections(): GearSelections {
  const out = {} as GearSelections;
  for (const slot of GEAR_SLOTS) out[slot.id] = { currentId: 'base', targetId: 'base' };
  return out;
}

/**
 * Governor Gear Calculator -- an isolated, self-contained feature (this
 * component + src/lib/gearData.ts + src/lib/gearCalc.ts + everything in
 * src/components/gear/). To remove it entirely: delete this folder, the
 * two lib files, the /gear-calculator page, and its one link on the home
 * page's Explore grid. Nothing else in the app imports from here.
 */
export default function GearCalculatorSection() {
  const [selections, setSelections] = useState<GearSelections>(makeEmptySelections);
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [selector, setSelector] = useState<{ slotId: GearSlotId; mode: 'current' | 'target' } | null>(null);

  const plan = useMemo(() => calcGearPlan(selections), [selections]);

  const openSelector = (slotId: GearSlotId, mode: 'current' | 'target') => setSelector({ slotId, mode });
  const closeSelector = () => setSelector(null);

  const handleSelectLevel = (levelId: string) => {
    if (!selector) return;
    setSelections((prev) => ({
      ...prev,
      [selector.slotId]: { ...prev[selector.slotId], [selector.mode === 'current' ? 'currentId' : 'targetId']: levelId },
    }));
  };

  const handleReset = () => {
    setSelections(makeEmptySelections());
    setOwned({});
  };

  const handleChangeOwned = (materialId: string, value: number) => {
    setOwned((prev) => ({ ...prev, [materialId]: value }));
  };

  const slotLabel = (id: GearSlotId) => GEAR_SLOTS.find((s) => s.id === id)!.label;

  const renderSlot = (slotId: GearSlotId) => (
    <GearSlotCard
      slotId={slotId}
      label={slotLabel(slotId)}
      icon={SLOT_ICONS[slotId]}
      currentId={selections[slotId].currentId}
      targetId={selections[slotId].targetId}
      onOpenSelector={openSelector}
    />
  );

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">Governor Gear Calculator</h1>
          <p className="text-xs text-parchment-500 mt-0.5">Experimental -- material costs and % bonuses are real, sourced from the gear database.</p>
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
        {/* Equipment layout */}
        <div className="dashboard-card p-4">
          {/* Mobile (<640px): plain 2-column grid, reading order. */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {renderSlot('cap')}
            {renderSlot('watch')}
            {renderSlot('coat')}
            {renderSlot('pants')}
            {renderSlot('belt')}
            {renderSlot('staff')}
          </div>

          {/* Desktop/tablet (>=640px): diamond layout around a center crown. */}
          <div className="hidden sm:grid grid-cols-3 grid-rows-4 gap-4 place-items-center max-w-md mx-auto">
            <div className="col-start-2 row-start-1 w-full">{renderSlot('cap')}</div>
            <div className="col-start-1 row-start-2 w-full">{renderSlot('coat')}</div>
            <div className="col-start-2 row-start-2 flex items-center justify-center text-gold-400/70">
              <CrownIcon />
            </div>
            <div className="col-start-3 row-start-2 w-full">{renderSlot('watch')}</div>
            <div className="col-start-1 row-start-3 w-full">{renderSlot('belt')}</div>
            <div className="col-start-3 row-start-3 w-full">{renderSlot('pants')}</div>
            <div className="col-start-2 row-start-4 w-full">{renderSlot('staff')}</div>
          </div>
        </div>

        {/* Calculations sidebar */}
        <div className="flex flex-col gap-3">
          <GearMaterialsPanel required={plan.materials} owned={owned} onChangeOwned={handleChangeOwned} />
          <GearTroopStatsPanel
            currentTotalAttrPercent={plan.currentTotalAttrPercent}
            targetTotalAttrPercent={plan.targetTotalAttrPercent}
          />
        </div>
      </div>

      {selector && (
        <GearLevelSelector
          slotLabel={slotLabel(selector.slotId)}
          mode={selector.mode}
          selectedId={selector.mode === 'current' ? selections[selector.slotId].currentId : selections[selector.slotId].targetId}
          onSelect={handleSelectLevel}
          onClose={closeSelector}
        />
      )}
    </div>
  );
}
