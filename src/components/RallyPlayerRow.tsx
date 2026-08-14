'use client';

import type { RallyPlayerInput } from '@/lib/rally';
import { formatCountdown } from '@/lib/rally';
import type { RallyTown } from '@/lib/rallyTowns';
import { PET_BUFF_LEVELS, getPetBuffSpeedupPercent } from '@/lib/petBuffs';
import { ISLAND_LEVELS } from '@/lib/islandDecor';

interface RallyPlayerRowProps {
  player: RallyPlayerInput;
  index: number;
  isLast: boolean;
  town: RallyTown | null;
  isEditingTown: boolean;
  onChangeName: (name: string) => void;
  onChangePetBuffLevel: (level: number | null) => void;
  onChangeIslandLevel: (level: number | null) => void;
  onChangeMarchTime: (seconds: number) => void;
  onRequestTownChange: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function RallyPlayerRow({
  player,
  index,
  isLast,
  town,
  isEditingTown,
  onChangeName,
  onChangePetBuffLevel,
  onChangeIslandLevel,
  onChangeMarchTime,
  onRequestTownChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RallyPlayerRowProps) {
  const isFirst = index === 0;
  const speedupPercent = getPetBuffSpeedupPercent(player.petBuffLevel);
  const marchMinutes = player.marchTimeSeconds != null ? Math.floor(player.marchTimeSeconds / 60) : 0;
  const marchSeconds = player.marchTimeSeconds != null ? player.marchTimeSeconds % 60 : 0;
  const effectiveMarchTimeSeconds =
    player.marchTimeSeconds != null ? player.marchTimeSeconds * (1 - speedupPercent / 100) : null;

  const setMarch = (mm: number, ss: number) => onChangeMarchTime(mm * 60 + ss);

  return (
    <div className={`dashboard-card p-3 flex flex-col gap-2.5 ${isEditingTown ? 'ring-2 ring-moss-500/80' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gold-300">
          {isFirst ? '#1 · First' : `#${index + 1}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move up in hit order"
            className="focus-ring rounded border border-stone-700 h-6 w-6 flex items-center justify-center text-parchment-300 hover:border-gold-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move down in hit order"
            className="focus-ring rounded border border-stone-700 h-6 w-6 flex items-center justify-center text-parchment-300 hover:border-gold-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove player"
            className="focus-ring rounded border border-stone-700 h-6 w-6 flex items-center justify-center text-ember-500 hover:border-ember-500/60 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <input
          type="text"
          value={player.name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Player name…"
          className="focus-ring flex-1 min-w-[130px] rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600"
        />
        <select
          value={player.petBuffLevel ?? ''}
          onChange={(e) => onChangePetBuffLevel(e.target.value ? Number(e.target.value) : null)}
          aria-label="Pet buff level"
          className={`focus-ring w-24 shrink-0 rounded border bg-stone-950 px-1.5 py-2 text-xs focus:border-gold-600 ${
            player.petBuffLevel != null ? 'border-moss-500/80 text-moss-500 font-semibold' : 'border-stone-700 text-parchment-400'
          }`}
        >
          <option value="">No buff</option>
          {PET_BUFF_LEVELS.map((l) => (
            <option key={l.level} value={l.level}>
              Pet Lv.{l.level} +{l.speedupPercent}%
            </option>
          ))}
        </select>
        <select
          value={player.islandLevel ?? ''}
          onChange={(e) => onChangeIslandLevel(e.target.value ? Number(e.target.value) : null)}
          aria-label="Pet island decoration level"
          className={`focus-ring w-20 shrink-0 rounded border bg-stone-950 px-1.5 py-2 text-xs focus:border-gold-600 ${
            player.islandLevel != null ? 'border-sky-500/80 text-sky-400 font-semibold' : 'border-stone-700 text-parchment-400'
          }`}
        >
          <option value="">No island</option>
          {ISLAND_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              Island Lv.{lvl}
            </option>
          ))}
        </select>
      </div>

      {isEditingTown ? (
        <p className="text-xs text-moss-500 font-semibold">↑ Tap a castle on the map to set this player's town</p>
      ) : town ? (
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-parchment-300">
            Town: <span className="text-gold-300">Castle {town.id.split('-')[1]}</span>
          </span>
          <button
            type="button"
            onClick={onRequestTownChange}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
          >
            Change Town
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onRequestTownChange}
          className="focus-ring w-full rounded border border-dashed border-stone-600 px-3 py-2 text-sm text-parchment-300 hover:border-gold-600 transition-colors"
        >
          Choose Town (fills march time)
        </button>
      )}

      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-parchment-300 shrink-0">March Time</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={99}
            value={marchMinutes}
            onChange={(e) => setMarch(Math.max(0, Math.min(99, Number(e.target.value) || 0)), marchSeconds)}
            aria-label="March time minutes"
            className="focus-ring w-12 rounded border border-stone-700 bg-stone-950 px-1 py-1.5 text-center font-mono text-xs text-parchment-100 focus:border-gold-600"
          />
          <span className="text-parchment-500">:</span>
          <input
            type="number"
            min={0}
            max={59}
            value={marchSeconds}
            onChange={(e) => setMarch(marchMinutes, Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
            aria-label="March time seconds"
            className="focus-ring w-12 rounded border border-stone-700 bg-stone-950 px-1 py-1.5 text-center font-mono text-xs text-parchment-100 focus:border-gold-600"
          />
        </div>
      </div>
      {speedupPercent > 0 && player.marchTimeSeconds != null && (
        <p className="text-xs text-moss-500 -mt-1.5">
          With pet buff: <span className="font-mono">{formatCountdown(effectiveMarchTimeSeconds!)}</span> (−{speedupPercent}%)
        </p>
      )}
    </div>
  );
}
