'use client';

import type { GearSlotId } from '@/lib/gearData';
import { CHARM_SLOTS, getCharmLevel } from '@/lib/charmData';
import CharmLevelDropdown from './CharmLevelDropdown';

export default function CharmSlotGroup({
  gearSlotId,
  gearSlotLabel,
  icon,
  selections,
  onSelectLevel,
}: {
  gearSlotId: GearSlotId;
  gearSlotLabel: string;
  icon: React.ReactNode;
  selections: Record<string, { currentId: string; targetId: string }>;
  onSelectLevel: (charmSlotId: string, mode: 'current' | 'target', levelId: string) => void;
}) {
  const charms = CHARM_SLOTS.filter((c) => c.gearSlotId === gearSlotId);

  return (
    <div className="dashboard-card p-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-md bg-stone-800 border border-stone-700 p-1.5 text-parchment-300">{icon}</div>
        <p className="text-sm font-semibold text-parchment-100">{gearSlotLabel}</p>
      </div>
      <div className="flex flex-col gap-2">
        {charms.map((charm) => {
          const current = getCharmLevel(selections[charm.id].currentId);
          return (
            <div key={charm.id} className="grid grid-cols-2 gap-2 rounded border border-stone-700 bg-stone-800 p-2">
              <div className="col-span-2 text-[10px] font-medium text-parchment-400">{charm.label}</div>
              <CharmLevelDropdown
                label="Current"
                levelId={selections[charm.id].currentId}
                onSelect={(levelId) => onSelectLevel(charm.id, 'current', levelId)}
              />
              <CharmLevelDropdown
                label="Target"
                levelId={selections[charm.id].targetId}
                onSelect={(levelId) => onSelectLevel(charm.id, 'target', levelId)}
                minOrder={current?.order ?? 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
