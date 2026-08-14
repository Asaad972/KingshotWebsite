'use client';

import { useState } from 'react';
import { RALLY_TOWNS } from '@/lib/rallyTowns';

interface RallyMapProps {
  /** townId -> how many players currently march from that town. */
  townCounts: Record<string, number>;
  /** The town whose position is currently being edited for one specific player, if any. */
  editingTownId?: string | null;
  onSelectTown: (townId: string) => void;
}

export default function RallyMap({ townCounts, editingTownId, onSelectTown }: RallyMapProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative w-full rounded border border-stone-700 bg-stone-950 overflow-hidden ${
        imageError ? 'aspect-[5/6]' : ''
      }`}
    >
      {imageError ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="text-xs text-parchment-500">
            Map image not added yet — save it as public/rally/map.png
          </p>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/rally/map.png"
          alt="KingShot map — tap a castle to add the next player"
          className="block w-full h-auto select-none"
          draggable={false}
          onError={() => setImageError(true)}
        />
      )}

      {RALLY_TOWNS.map((town) => {
        const count = townCounts[town.id] ?? 0;
        const isEditTarget = editingTownId === town.id;
        let stateClasses = 'border-gold-300/80 bg-gold-500/10 hover:bg-gold-500/25 hover:border-gold-300';
        if (count > 0) stateClasses = 'border-gold-400 bg-gold-500/30 hover:bg-gold-500/40';
        if (isEditTarget) stateClasses += ' ring-2 ring-moss-500/80';

        return (
          <button
            key={town.id}
            type="button"
            onClick={() => onSelectTown(town.id)}
            aria-label={count > 0 ? `Add another player from this town (${count} already here)` : 'Add a player from this town'}
            className={`focus-ring absolute rounded-full border-2 transition-colors flex items-center justify-center ${stateClasses}`}
            style={{
              left: `${town.hotspot.xPercent}%`,
              top: `${town.hotspot.yPercent}%`,
              width: `${town.hotspot.widthPercent}%`,
              height: `${town.hotspot.heightPercent}%`,
            }}
          >
            {count > 0 && (
              <span className="text-stone-950 text-xs font-bold leading-none">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
