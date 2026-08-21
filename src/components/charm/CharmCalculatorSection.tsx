'use client';

import { useMemo, useState } from 'react';
import { GEAR_SLOTS, TROOP_LABELS, type GearSlotId, type TroopType } from '@/lib/gearData';
import { CHARM_SLOTS, getCharmLevel } from '@/lib/charmData';
import { calcCharmPlan, type CharmSelections } from '@/lib/charmCalc';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { useProfiles } from '@/lib/useProfiles';
import ProfileBar from '@/components/shared/ProfileBar';
import CharmSlotCard from './CharmSlotCard';
import CharmLevelDropdown from './CharmLevelDropdown';
import CharmMaterialsPanel from './CharmMaterialsPanel';
import CharmTroopStatsPanel from './CharmTroopStatsPanel';
import { CapIcon, WatchIcon, CoatIcon, PantsIcon, BeltIcon, StaffIcon } from './CharmIcons';

interface SavedState {
  selections: CharmSelections;
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

const TROOP_ORDER: TroopType[] = ['cavalry', 'infantry', 'archers'];

type BulkScope = 'all' | TroopType;
const BULK_SCOPES: { id: BulkScope; label: string }[] = [
  { id: 'all', label: 'All together' },
  { id: 'cavalry', label: TROOP_LABELS.cavalry },
  { id: 'infantry', label: TROOP_LABELS.infantry },
  { id: 'archers', label: TROOP_LABELS.archers },
];

function makeEmptySelections(): CharmSelections {
  const out: CharmSelections = {};
  for (const charm of CHARM_SLOTS) out[charm.id] = { currentId: 'base', targetId: 'base' };
  return out;
}

function makeEmptyBulkState(): Record<BulkScope, string> {
  return { all: '', cavalry: '', infantry: '', archers: '' };
}

/**
 * Governor Charm Calculator -- an isolated, self-contained feature (this
 * component + src/lib/charmData.ts + src/lib/charmCalc.ts + everything in
 * src/components/charm/). To remove it entirely: delete this folder, the
 * two lib files, the /charm-calculator page, and its one link on the home
 * page's Explore grid. Nothing else in the app imports from here.
 */
export default function CharmCalculatorSection() {
  const [selections, setSelections] = useLocalStorageState<CharmSelections>('governorCharm:selections', makeEmptySelections());
  const [owned, setOwned] = useLocalStorageState<Record<string, number>>('governorCharm:owned', {});
  const { profiles, saveProfile, deleteProfile } = useProfiles<SavedState>('governorCharm:profiles');
  // Last value picked in each Quick set row -- purely so the dropdown's own
  // label reflects the pick instead of reverting to "Choose..." (these don't
  // represent the real per-charm state, which can differ charm to charm).
  const [bulkCurrent, setBulkCurrent] = useState<Record<BulkScope, string>>(makeEmptyBulkState());
  const [bulkTarget, setBulkTarget] = useState<Record<BulkScope, string>>(makeEmptyBulkState());

  const plan = useMemo(() => calcCharmPlan(selections), [selections]);

  const handleSelectLevel = (charmSlotId: string, mode: 'current' | 'target', levelId: string) => {
    setSelections((prev) => {
      const sel = prev[charmSlotId];
      if (mode === 'target') {
        return { ...prev, [charmSlotId]: { ...sel, targetId: levelId } };
      }
      // Raising Current past the existing Target brings Target up with it --
      // the Target dropdown itself already refuses to go below Current, so
      // this is the only direction that needs auto-correcting.
      const newCurrent = getCharmLevel(levelId);
      const existingTarget = getCharmLevel(sel.targetId);
      const targetId = newCurrent && existingTarget && newCurrent.order > existingTarget.order ? levelId : sel.targetId;
      return { ...prev, [charmSlotId]: { currentId: levelId, targetId } };
    });
  };

  const handleBulkSetCurrent = (scope: BulkScope, levelId: string) => {
    const newCurrent = getCharmLevel(levelId);
    setSelections((prev) => {
      const next = { ...prev };
      for (const charm of CHARM_SLOTS) {
        if (scope !== 'all' && charm.troopType !== scope) continue;
        const existingTarget = getCharmLevel(next[charm.id].targetId);
        const targetId = newCurrent && existingTarget && newCurrent.order > existingTarget.order ? levelId : next[charm.id].targetId;
        next[charm.id] = { currentId: levelId, targetId };
      }
      return next;
    });
    setBulkCurrent((prev) => ({ ...prev, [scope]: levelId }));
  };

  const handleBulkSetTarget = (scope: BulkScope, levelId: string) => {
    const newTarget = getCharmLevel(levelId);
    setSelections((prev) => {
      const next = { ...prev };
      for (const charm of CHARM_SLOTS) {
        if (scope !== 'all' && charm.troopType !== scope) continue;
        const existingCurrent = getCharmLevel(next[charm.id].currentId);
        const currentId = newTarget && existingCurrent && newTarget.order < existingCurrent.order ? levelId : next[charm.id].currentId;
        next[charm.id] = { currentId, targetId: levelId };
      }
      return next;
    });
    setBulkTarget((prev) => ({ ...prev, [scope]: levelId }));
  };

  const handleReset = () => {
    setSelections(makeEmptySelections());
    setOwned({});
    setBulkCurrent(makeEmptyBulkState());
    setBulkTarget(makeEmptyBulkState());
  };

  const handleChangeOwned = (materialId: string, value: number) => {
    setOwned((prev) => ({ ...prev, [materialId]: value }));
  };

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title">Governor Charm Calculator</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            Experimental -- material costs and % bonuses are real, sourced from the charm database.
          </p>
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

      <div className="dashboard-card p-3 flex flex-col gap-3 mt-3">
        <p className="text-xs font-semibold text-parchment-300">Quick set</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BULK_SCOPES.map((scope) => (
            <div key={scope.id} className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold text-gold-300">{scope.label}</p>
              <div className="grid grid-cols-2 gap-2">
                <CharmLevelDropdown
                  label="Current"
                  levelId={bulkCurrent[scope.id]}
                  placeholder="Choose..."
                  onSelect={(levelId) => handleBulkSetCurrent(scope.id, levelId)}
                />
                <CharmLevelDropdown
                  label="Target"
                  levelId={bulkTarget[scope.id]}
                  placeholder="Choose..."
                  onSelect={(levelId) => handleBulkSetTarget(scope.id, levelId)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full width so the pictures can be as big as possible; Materials/
          Stats move below instead of squeezing into a side column -- same
          layout change made for the gear picker. */}
      <div className="dashboard-card p-4 md:p-6 mt-3">
        {TROOP_ORDER.map((troopType, i) => {
          const [pieceA, pieceB] = GEAR_SLOTS.filter((s) => s.troopType === troopType);
          const charmsFor = (gearSlotId: GearSlotId) => CHARM_SLOTS.filter((c) => c.gearSlotId === gearSlotId);
          const column = (piece: (typeof GEAR_SLOTS)[number]) => (
            <div className="flex flex-col gap-6">
              {charmsFor(piece.id).map((charm) => (
                <CharmSlotCard
                  key={charm.id}
                  troopType={troopType}
                  icon={SLOT_ICONS[piece.id]}
                  currentId={selections[charm.id].currentId}
                  targetId={selections[charm.id].targetId}
                  showHint={charm.id === 'cap-1'}
                  onSelectLevel={(mode, levelId) => handleSelectLevel(charm.id, mode, levelId)}
                />
              ))}
            </div>
          );
          return (
            <div key={troopType} className={i > 0 ? 'mt-8 pt-8 border-t border-stone-700' : ''}>
              <h2 className="card-title mb-4">{TROOP_LABELS[troopType]}</h2>
              {/* flex-col on mobile so the two pieces' charms just stack in
                  one column (two 112px-wide columns side by side don't fit
                  a phone screen) -- flex-row at sm+ puts them side by side
                  with a divider line between, matching the piece boundary
                  that used to be a "Cap"/"Watch" label. */}
              <div className="flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-8">
                {column(pieceA)}
                <div className="hidden sm:block w-px self-stretch bg-stone-700" />
                {column(pieceB)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <CharmMaterialsPanel required={plan.materials} owned={owned} onChangeOwned={handleChangeOwned} scoreGained={plan.scoreGained} />
        <CharmTroopStatsPanel troopStats={plan.troopStats} />
      </div>
    </div>
  );
}
