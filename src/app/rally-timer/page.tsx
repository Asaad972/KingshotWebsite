'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import UTCClock from '@/components/UTCClock';
import IsometricCastleMap from '@/components/rally/IsometricCastleMap';
import RallyPlayerRow from '@/components/RallyPlayerRow';
import RallyTimingPanel from '@/components/RallyTimingPanel';
import RallyResults from '@/components/RallyResults';
import { computeRallyPlan, formatUtcHms, formatCountdown, clampRallyOffset, type RallyPlayerInput } from '@/lib/rally';
import { getPetBuffSpeedupPercent } from '@/lib/petBuffs';
import PasswordGate from '@/components/PasswordGate';

const FORMATION_OPTIONS_MINUTES = [5, 3, 2, 1];

function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function RallyTimerContent() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const [prepMinutes, setPrepMinutes] = useState(1);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [formationMinutes, setFormationMinutes] = useState(5);

  const [players, setPlayers] = useState<RallyPlayerInput[]>([]);
  const [marchSpeedPercent, setMarchSpeedPercent] = useState(0);

  // The player with the longest (buffed) march time is the one who has to
  // open earliest -- the target needs enough runway ahead of "now" for that
  // player's open time to still be in the future, or every player's Open
  // Rally time would land in the past the instant the target is set.
  const maxEffectiveMarchSeconds = useMemo(() => {
    return players.reduce((max, p) => {
      if (p.marchTimeSeconds == null) return max;
      const speedup = getPetBuffSpeedupPercent(p.petBuffLevel);
      return Math.max(max, p.marchTimeSeconds * (1 - speedup / 100));
    }, 0);
  }, [players]);

  // Target Arrival = the moment this was captured + Preparation Delay + Rally
  // Formation Time + the longest march time among current players. It's a
  // fixed snapshot (not continuously recomputed against "now"), otherwise
  // the countdown would never actually count down -- re-press the button
  // below to restart the clock from the current moment (e.g. after changing
  // the delay, formation time, or a player's march time).
  const [targetArrival, setTargetArrival] = useState<Date | null>(null);
  const setTargetToNow = () => {
    if (!now) return;
    setTargetArrival(
      new Date(now.getTime() + (prepMinutes * 60 + prepSeconds + formationMinutes * 60 + maxEffectiveMarchSeconds) * 1000)
    );
  };
  // Set an initial target the moment the clock is ready, so the tool is
  // immediately useful without requiring an extra click.
  const initialized = useRef(false);
  useEffect(() => {
    if (now && !initialized.current) {
      initialized.current = true;
      setTargetArrival(
        new Date(now.getTime() + (prepMinutes * 60 + prepSeconds + formationMinutes * 60 + maxEffectiveMarchSeconds) * 1000)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  // When set, the NEXT map click updates this player's town instead of
  // appending a brand new player.
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const updatePlayer = (id: string, patch: Partial<RallyPlayerInput>) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  // Applies against the latest pending state (not a closed-over render
  // value), so rapid successive nudges always accumulate correctly.
  const stepOffset = (id: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, offsetSeconds: clampRallyOffset(p.offsetSeconds + delta) } : p))
    );
  };

  const addBlankPlayer = () => {
    const id = makeId();
    setPlayers((prev) => [
      ...prev,
      { id, name: '', townCoord: null, marchTimeSeconds: null, offsetSeconds: 0, petBuffLevel: null, islandLevel: null },
    ]);
    setEditingPlayerId(id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setEditingPlayerId((cur) => (cur === id ? null : cur));
  };

  const movePlayer = (id: string, direction: -1 | 1) => {
    setPlayers((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      const swapWith = index + direction;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  };

  const requestTownChange = (id: string) => {
    setEditingPlayerId(id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Clicking (or typing coordinates into) the Kingdom Map either updates the
  // player currently being edited, or (the common case) appends a brand new
  // player assigned to that town -- #1 First, then #2, #3... one per tap.
  const handleSetPlayerTown = (playerId: string, coord: { x: number; y: number }, marchTimeSeconds: number) => {
    updatePlayer(playerId, { townCoord: coord, marchTimeSeconds });
    setEditingPlayerId(null);
  };

  const handleAddPlayerAtTown = (coord: { x: number; y: number }, marchTimeSeconds: number) => {
    setPlayers((prev) => [
      ...prev,
      { id: makeId(), name: '', townCoord: coord, marchTimeSeconds, offsetSeconds: 0, petBuffLevel: null, islandLevel: null },
    ]);
  };

  const editingPlayer = players.find((p) => p.id === editingPlayerId) ?? null;

  const plan = useMemo(() => {
    if (!targetArrival) return null;
    return computeRallyPlan({
      targetArrival,
      formationSeconds: formationMinutes * 60,
      preparationSeconds: prepMinutes * 60 + prepSeconds,
      players,
    });
  }, [targetArrival, formationMinutes, prepMinutes, prepSeconds, players]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="text-lg font-semibold text-parchment-100 mb-4">Rally Timer</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-5 items-start">
        <div className="flex flex-col gap-5 min-w-0 order-1 lg:order-none">
          <div className="dashboard-card p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-parchment-100">Configuration</h2>

            {now && <UTCClock />}

            <div>
              <p className="text-xs text-parchment-400 mb-1.5">
                Preparation Delay <span className="text-parchment-500">— time to prepare before opening rallies</span>
              </p>
              <div className="flex items-center gap-1.5">
                <NumberField label="Min" value={prepMinutes} onChange={setPrepMinutes} />
                <span className="text-parchment-500">:</span>
                <NumberField label="Sec" value={prepSeconds} onChange={setPrepSeconds} max={59} />
              </div>
            </div>

            <div>
              <p className="text-xs text-parchment-400 mb-1.5">Rally Formation Time</p>
              <div className="grid grid-cols-4 gap-1.5">
                {FORMATION_OPTIONS_MINUTES.map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setFormationMinutes(min)}
                    className={`focus-ring rounded border py-2 text-sm font-semibold transition-colors ${
                      formationMinutes === min
                        ? 'border-gold-400 bg-gold-500 text-stone-950'
                        : 'border-stone-700 text-parchment-300 hover:border-gold-600'
                    }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded border border-stone-700 bg-stone-950 p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-parchment-400">Target Arrival Time</p>
                <p className="font-mono text-lg text-gold-300">
                  {targetArrival ? `${formatUtcHms(targetArrival)} UTC` : '—'}
                </p>
                <p className="text-[11px] text-parchment-500">
                  = now + preparation delay + rally formation time + longest march time
                </p>
              </div>
              <button
                type="button"
                onClick={setTargetToNow}
                className="focus-ring shrink-0 rounded-md bg-gold-500 px-3 py-2 text-xs font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
              >
                Set to Now + Delay
              </button>
            </div>
            {players.length > 0 && (
              <p className="text-[11px] text-parchment-500 -mt-2">
                Longest march right now: <span className="font-mono text-parchment-300">{formatCountdown(maxEffectiveMarchSeconds)}</span> — re-press
                the button above after adding players or changing march times so the target stays ahead of them.
              </p>
            )}
          </div>

          <div ref={mapRef} className="flex flex-col gap-2">
            {editingPlayer && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-moss-500 font-semibold">
                  Editing {editingPlayer.name.trim() || `player #${players.findIndex((p) => p.id === editingPlayer.id) + 1}`}
                </p>
                <button
                  type="button"
                  onClick={() => setEditingPlayerId(null)}
                  className="focus-ring rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            <IsometricCastleMap
              players={players}
              editingPlayerId={editingPlayerId}
              marchSpeedPercent={marchSpeedPercent}
              onChangeMarchSpeedPercent={setMarchSpeedPercent}
              onSetPlayerTown={handleSetPlayerTown}
              onAddPlayerAtTown={handleAddPlayerAtTown}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-parchment-100">Players — hit order</h2>
              <button
                type="button"
                onClick={addBlankPlayer}
                className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:border-gold-600 transition-colors"
              >
                + Add Player
              </button>
            </div>

            {players.length === 0 ? (
              <p className="text-sm text-parchment-500 py-6 text-center">Tap the map above to add your first player.</p>
            ) : (
              players.map((player, i) => (
                <RallyPlayerRow
                  key={player.id}
                  player={player}
                  index={i}
                  isLast={i === players.length - 1}
                  isEditingTown={editingPlayerId === player.id}
                  onChangeName={(name) => updatePlayer(player.id, { name })}
                  onChangePetBuffLevel={(level) => updatePlayer(player.id, { petBuffLevel: level })}
                  onChangeIslandLevel={(level) => updatePlayer(player.id, { islandLevel: level })}
                  onChangeMarchTime={(seconds) => updatePlayer(player.id, { marchTimeSeconds: seconds })}
                  onRequestTownChange={() => requestTownChange(player.id)}
                  onMoveUp={() => movePlayer(player.id, -1)}
                  onMoveDown={() => movePlayer(player.id, 1)}
                  onRemove={() => removePlayer(player.id)}
                />
              ))
            )}
          </div>

          <RallyTimingPanel
            players={players}
            onChangeOffset={(id, seconds) => updatePlayer(id, { offsetSeconds: seconds })}
            onStepOffset={stepOffset}
          />
        </div>

        <div className="order-2 lg:order-none">{plan && now && <RallyResults plan={plan} now={now} />}</div>
      </div>
    </div>
  );
}

export default function RallyTimerPage() {
  return (
    <PasswordGate password="HeroIsMyKing" storageKey="kingshot_rally_timer_unlocked">
      <RallyTimerContent />
    </PasswordGate>
  );
}

function NumberField({
  label,
  value,
  onChange,
  max = 99,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <label className="flex flex-col items-center gap-1">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
        className="focus-ring w-14 rounded border border-stone-700 bg-stone-950 px-1 py-2 text-center font-mono text-sm text-parchment-100 focus:border-gold-600"
      />
      <span className="text-[10px] text-parchment-500">{label}</span>
    </label>
  );
}
