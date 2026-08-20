'use client';

import { useMemo, useState } from 'react';
import { GEAR_SLOTS, getGearLevel, type GearSlotId } from '@/lib/gearData';
import { calcGearPlan, type GearSelections } from '@/lib/gearCalc';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { useProfiles } from '@/lib/useProfiles';
import ProfileBar from '@/components/shared/ProfileBar';
import GearSlotCard from './GearSlotCard';
import GearLevelDropdown from './GearLevelDropdown';
import GearMaterialsPanel from './GearMaterialsPanel';
import GearTroopStatsPanel from './GearTroopStatsPanel';
import { CapIcon, WatchIcon, CoatIcon, PantsIcon, BeltIcon, StaffIcon, CrownIcon } from './GearIcons';

interface SavedState {
  selections: GearSelections;
  owned: Record<string, number>;
}

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
  const [selections, setSelections] = useLocalStorageState<GearSelections>('governorGear:selections', makeEmptySelections());
  const [owned, setOwned] = useLocalStorageState<Record<string, number>>('governorGear:owned', {});
  const { profiles, saveProfile, deleteProfile } = useProfiles<SavedState>('governorGear:profiles');
  // Last value picked in the Quick set row -- purely so the dropdown's own
  // label reflects the pick instead of reverting to "Choose..." (this
  // doesn't represent real per-slot state, which can differ slot to slot).
  const [bulkCurrentId, setBulkCurrentId] = useState('');
  const [bulkTargetId, setBulkTargetId] = useState('');

  const plan = useMemo(() => calcGearPlan(selections), [selections]);

  const handleSelectLevel = (slotId: GearSlotId, mode: 'current' | 'target', levelId: string) => {
    setSelections((prev) => {
      const sel = prev[slotId];
      if (mode === 'target') {
        return { ...prev, [slotId]: { ...sel, targetId: levelId } };
      }
      // Raising Current past the existing Target brings Target up with it --
      // the Target dropdown itself already refuses to go below Current, so
      // this is the only direction that needs auto-correcting.
      const newCurrent = getGearLevel(levelId);
      const existingTarget = getGearLevel(sel.targetId);
      const targetId = newCurrent && existingTarget && newCurrent.order > existingTarget.order ? levelId : sel.targetId;
      return { ...prev, [slotId]: { currentId: levelId, targetId } };
    });
  };

  const handleBulkSetCurrent = (levelId: string) => {
    const newCurrent = getGearLevel(levelId);
    setSelections((prev) => {
      const next = { ...prev };
      for (const slot of GEAR_SLOTS) {
        const existingTarget = getGearLevel(next[slot.id].targetId);
        const targetId = newCurrent && existingTarget && newCurrent.order > existingTarget.order ? levelId : next[slot.id].targetId;
        next[slot.id] = { currentId: levelId, targetId };
      }
      return next;
    });
    setBulkCurrentId(levelId);
  };

  const handleBulkSetTarget = (levelId: string) => {
    const newTarget = getGearLevel(levelId);
    setSelections((prev) => {
      const next = { ...prev };
      for (const slot of GEAR_SLOTS) {
        const existingCurrent = getGearLevel(next[slot.id].currentId);
        const currentId = newTarget && existingCurrent && newTarget.order < existingCurrent.order ? levelId : next[slot.id].currentId;
        next[slot.id] = { currentId, targetId: levelId };
      }
      return next;
    });
    setBulkTargetId(levelId);
  };

  const handleReset = () => {
    setSelections(makeEmptySelections());
    setOwned({});
    setBulkCurrentId('');
    setBulkTargetId('');
  };

  const handleChangeOwned = (materialId: string, value: number) => {
    setOwned((prev) => ({ ...prev, [materialId]: value }));
  };

  const renderSlot = (slotId: GearSlotId) => (
    <GearSlotCard
      slotId={slotId}
      icon={SLOT_ICONS[slotId]}
      currentId={selections[slotId].currentId}
      targetId={selections[slotId].targetId}
      showHint={slotId === 'cap'}
      onSelectLevel={handleSelectLevel}
    />
  );

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title">Governor Gear Calculator</h1>
          <p className="text-xs text-parchment-400 mt-0.5">Experimental -- material costs and % bonuses are real, sourced from the gear database.</p>
        </div>
        <div className="flex items-center gap-2">
          <ProfileBar
            profiles={profiles}
            onSave={(name) => saveProfile(name, { selections, owned })}
            onLoad={(data) => {
              setSelections(data.selections);
              setOwned(data.owned);
            }}
            onDelete={deleteProfile}
          />
          <button
            type="button"
            onClick={handleReset}
            className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="dashboard-card p-3 flex flex-col gap-2 mt-3">
        <p className="text-xs font-semibold text-parchment-300">Quick set (applies to all 6 pieces)</p>
        <div className="grid grid-cols-2 gap-2 max-w-sm">
          <GearLevelDropdown id="bulk-current" label="Set all Current" levelId={bulkCurrentId} placeholder="Choose..." onSelect={handleBulkSetCurrent} />
          <GearLevelDropdown id="bulk-target" label="Set all Target" levelId={bulkTargetId} placeholder="Choose..." onSelect={handleBulkSetTarget} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start mt-3">
        {/* Equipment layout */}
        <div className="dashboard-card p-4">
          {/* Mobile (<640px): single column -- each card needs ~200px for
              its Current -> arrow -> Target row, which a 2-column grid can't
              give it without the images spilling into the next column. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {renderSlot('cap')}
            {renderSlot('watch')}
            {renderSlot('coat')}
            {renderSlot('pants')}
            {renderSlot('belt')}
            {renderSlot('staff')}
          </div>

          {/* Desktop/tablet (>=640px): 3 slots per side around a center emblem, matching the in-game layout. */}
          <div className="hidden sm:flex items-center justify-center gap-6 lg:gap-10 max-w-2xl mx-auto py-4">
            <div className="flex flex-col gap-4 w-32">
              {renderSlot('cap')}
              {renderSlot('coat')}
              {renderSlot('belt')}
            </div>
            <div className="h-20 w-20 shrink-0 text-gold-400/60 self-center">
              <CrownIcon />
            </div>
            <div className="flex flex-col gap-4 w-32">
              {renderSlot('watch')}
              {renderSlot('pants')}
              {renderSlot('staff')}
            </div>
          </div>
        </div>

        {/* Calculations sidebar */}
        <div className="flex flex-col gap-3">
          <GearMaterialsPanel required={plan.materials} owned={owned} onChangeOwned={handleChangeOwned} scoreGained={plan.scoreGained} />
          <GearTroopStatsPanel troopStats={plan.troopStats} />
        </div>
      </div>
    </div>
  );
}
