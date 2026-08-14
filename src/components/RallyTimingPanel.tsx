'use client';

import type { RallyPlayerInput } from '@/lib/rally';
import RallyOffsetSlider from './RallyOffsetSlider';

interface RallyTimingPanelProps {
  players: RallyPlayerInput[];
  onChangeOffset: (id: string, seconds: number) => void;
  onStepOffset: (id: string, delta: number) => void;
}

export default function RallyTimingPanel({ players, onChangeOffset, onStepOffset }: RallyTimingPanelProps) {
  if (players.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <h2 className="text-sm font-semibold text-parchment-100">Arrival Timing</h2>
        <p className="text-xs text-parchment-400">Adjust when each player arrives relative to the one before them.</p>
      </div>

      <div className="dashboard-card p-3 flex flex-col gap-3.5">
        {players.map((player, i) => (
          <div key={player.id} className={i > 0 ? 'pt-3.5 border-t border-stone-800' : ''}>
            <p className="text-sm font-semibold text-parchment-100 truncate mb-1.5">
              {i === 0 ? '#1 · ' : `#${i + 1} · `}
              {player.name.trim() || `Player ${i + 1}`}
            </p>
            {i === 0 ? (
              <p className="text-xs text-parchment-500">Fixed — defines the target arrival time for everyone else.</p>
            ) : (
              <RallyOffsetSlider
                value={player.offsetSeconds}
                onChange={(v) => onChangeOffset(player.id, v)}
                onStep={(delta) => onStepOffset(player.id, delta)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
