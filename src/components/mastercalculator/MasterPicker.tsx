'use client';

import { MASTERS, MASTER_ORDER } from '@/lib/masters';
import MasterPortrait from './MasterPortrait';

/** All masters shown visually up front, picture + name -- picking one
 * reveals its planner. Mirrors the Pet Calculator's PetPicker. */
export default function MasterPicker({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {MASTER_ORDER.map((id) => {
        const master = MASTERS[id];
        const isSelected = id === selectedId;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`focus-ring flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
              isSelected ? 'border-gold-500 bg-gold-500/10' : 'border-stone-700 bg-stone-900 hover:border-stone-500'
            }`}
          >
            <MasterPortrait src={master.image} alt={master.name} className="h-16 w-16 rounded-lg" />
            <div className="text-center">
              <p className="text-sm font-semibold text-parchment-100">{master.name}</p>
              <p className="text-[10px] text-parchment-500">{master.type}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
