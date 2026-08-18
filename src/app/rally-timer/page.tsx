'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import UTCClock from '@/components/UTCClock';
import IsometricCastleMap from '@/components/rally/IsometricCastleMap';
import RallyPlayerRow from '@/components/RallyPlayerRow';
import RallyTimingPanel from '@/components/RallyTimingPanel';
import RallyResults from '@/components/RallyResults';
import GarrisonPanel from '@/components/GarrisonPanel';
import {
  computeRallyPlan,
  computeGarrisonPlan,
  formatUtcHms,
  formatCountdown,
  clampRallyOffset,
  type RallyPlayerInput,
  type RallyPlayerRole,
} from '@/lib/rally';
import type { WorldPoint } from '@/lib/isometricMap';
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

  // Rally openers feed the attack Rally Plan / Copy Results; reinforcements
  // feed the Garrison Timer -- kept as two views over the same roster so
  // copying the rally callout doesn't drag reinforcement names along.
  const rallyPlayers = players.filter((p) => p.role === 'rally');
  const garrisonPlayers = players.filter((p) => p.role === 'garrison');

  // Garrison Timer: tracks a single incoming enemy town. Marking the town
  // just records WHERE they are -- the countdown itself only starts once
  // you confirm their rally has actually opened (a rally needs the same
  // formation delay as ours before it even starts marching), which is a
  // separate, explicit action so scouting their town early doesn't
  // prematurely start a clock that hasn't begun yet.
  const [enemyTown, setEnemyTown] = useState<WorldPoint | null>(null);
  const [enemyMarchTimeSeconds, setEnemyMarchTimeSeconds] = useState<number | null>(null);
  const [enemyMarchSpeedPercent, setEnemyMarchSpeedPercent] = useState(0);
  const [enemyRallyOpenedAt, setEnemyRallyOpenedAt] = useState<Date | null>(null);
  const [garrisonBufferSeconds, setGarrisonBufferSeconds] = useState(1);

  const handleSetEnemyTown = (coord: WorldPoint, marchTimeSeconds: number) => {
    setEnemyTown(coord);
    setEnemyMarchTimeSeconds(marchTimeSeconds);
    setEnemyRallyOpenedAt(null);
  };

  const markEnemyRallyOpened = () => setEnemyRallyOpenedAt(new Date());
  // Rally-baiting is common -- people cancel and reopen to confuse
  // defenders -- so canceling just rewinds to "waiting", keeping the
  // scouted town/march time intact instead of clearing everything.
  const cancelEnemyRally = () => setEnemyRallyOpenedAt(null);

  const clearEnemy = () => {
    setEnemyTown(null);
    setEnemyMarchTimeSeconds(null);
    setEnemyRallyOpenedAt(null);
  };

  // Enemy Arrival = when their rally opened + the same rally formation
  // delay + their march time -- mirrors how our own rallies and
  // reinforcements are timed.
  const enemyArrivalTime = useMemo(() => {
    if (!enemyRallyOpenedAt || enemyMarchTimeSeconds == null) return null;
    return new Date(enemyRallyOpenedAt.getTime() + formationMinutes * 60 * 1000 + enemyMarchTimeSeconds * 1000);
  }, [enemyRallyOpenedAt, enemyMarchTimeSeconds, formationMinutes]);

  const garrisonPlan = useMemo(() => {
    if (!enemyArrivalTime) return null;
    return computeGarrisonPlan({
      enemyArrivalTime,
      bufferSeconds: garrisonBufferSeconds,
      players: garrisonPlayers,
    });
  }, [enemyArrivalTime, garrisonBufferSeconds, garrisonPlayers]);

  // The player with the longest (buffed) march time is the one who has to
  // open earliest -- the target needs enough runway ahead of "now" for that
  // player's open time to still be in the future, or every player's Open
  // Rally time would land in the past the instant the target is set.
  const maxEffectiveMarchSeconds = useMemo(() => {
    return rallyPlayers.reduce((max, p) => {
      if (p.marchTimeSeconds == null) return max;
      const speedup = getPetBuffSpeedupPercent(p.petBuffLevel);
      return Math.max(max, p.marchTimeSeconds * (1 - speedup / 100));
    }, 0);
  }, [rallyPlayers]);

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

  const addBlankPlayer = (role: RallyPlayerRole) => {
    const id = makeId();
    setPlayers((prev) => [
      ...prev,
      { id, name: '', role, townCoord: null, marchTimeSeconds: null, offsetSeconds: 0, petBuffLevel: null, islandLevel: null },
    ]);
    setEditingPlayerId(id);
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setEditingPlayerId((cur) => (cur === id ? null : cur));
  };

  // Swaps with the nearest neighbor of the SAME role, not just the nearest
  // array neighbor -- rally openers and reinforcements are interleaved in
  // the underlying array, so a plain index swap could reorder across groups.
  const movePlayer = (id: string, direction: -1 | 1) => {
    setPlayers((prev) => {
      const role = prev.find((p) => p.id === id)?.role;
      if (!role) return prev;
      const sameRoleIndices = prev.map((p, i) => (p.role === role ? i : -1)).filter((i) => i !== -1);
      const posInGroup = sameRoleIndices.indexOf(prev.findIndex((p) => p.id === id));
      const swapPos = posInGroup + direction;
      if (swapPos < 0 || swapPos >= sameRoleIndices.length) return prev;
      const iA = sameRoleIndices[posInGroup];
      const iB = sameRoleIndices[swapPos];
      const next = [...prev];
      [next[iA], next[iB]] = [next[iB], next[iA]];
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

  const handleAddPlayerAtTown = (coord: { x: number; y: number }, marchTimeSeconds: number, role: RallyPlayerRole) => {
    setPlayers((prev) => [
      ...prev,
      { id: makeId(), name: '', role, townCoord: coord, marchTimeSeconds, offsetSeconds: 0, petBuffLevel: null, islandLevel: null },
    ]);
  };

  // Undo: clicking back on an already-placed town removes that player
  // entirely, same as pressing the row's own remove button.
  const handleClearPlayerTown = (playerId: string) => {
    removePlayer(playerId);
  };

  const editingPlayer = players.find((p) => p.id === editingPlayerId) ?? null;

  const plan = useMemo(() => {
    if (!targetArrival) return null;
    return computeRallyPlan({
      targetArrival,
      formationSeconds: formationMinutes * 60,
      preparationSeconds: prepMinutes * 60 + prepSeconds,
      players: rallyPlayers,
    });
  }, [targetArrival, formationMinutes, prepMinutes, prepSeconds, rallyPlayers]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="text-lg font-semibold text-parchment-100 mb-4">Rally Timer</h1>

      <div className="flex flex-col gap-5">
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
          {rallyPlayers.length > 0 && (
            <p className="text-[11px] text-parchment-500 -mt-2">
              Longest march right now: <span className="font-mono text-parchment-300">{formatCountdown(maxEffectiveMarchSeconds)}</span> — re-press
              the button above after adding rally openers or changing march times so the target stays ahead of them.
            </p>
          )}
        </div>

        <div ref={mapRef} className="flex flex-col gap-2">
          {editingPlayer && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-moss-500 font-semibold">
                Editing {editingPlayer.role === 'garrison' ? 'reinforcement' : 'rally opener'}{' '}
                {editingPlayer.name.trim() ||
                  `#${(editingPlayer.role === 'garrison' ? garrisonPlayers : rallyPlayers).findIndex((p) => p.id === editingPlayer.id) + 1}`}
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
            onClearPlayerTown={handleClearPlayerTown}
            enemyTown={enemyTown}
            enemyMarchSpeedPercent={enemyMarchSpeedPercent}
            onChangeEnemyMarchSpeedPercent={setEnemyMarchSpeedPercent}
            onSetEnemyTown={handleSetEnemyTown}
            onClearEnemyTown={clearEnemy}
          />
        </div>

        {plan && now && <RallyResults plan={plan} now={now} onSetTargetToNow={setTargetToNow} />}

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-cyan-300">Rally Openers — hit order</h2>
            <button
              type="button"
              onClick={() => addBlankPlayer('rally')}
              className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:border-cyan-500 transition-colors"
            >
              + Add Rally Opener
            </button>
          </div>

          {rallyPlayers.length === 0 ? (
            <p className="text-sm text-parchment-500 py-6 text-center">Tap the map above to add your first rally opener.</p>
          ) : (
            rallyPlayers.map((player, i) => (
              <RallyPlayerRow
                key={player.id}
                player={player}
                index={i}
                isLast={i === rallyPlayers.length - 1}
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
          players={rallyPlayers}
          onChangeOffset={(id, seconds) => updatePlayer(id, { offsetSeconds: seconds })}
          onStepOffset={stepOffset}
        />

        {enemyTown && now && (
          <GarrisonPanel
            enemyTown={enemyTown}
            enemyMarchTimeSeconds={enemyMarchTimeSeconds}
            hasRallyOpened={enemyRallyOpenedAt !== null}
            plan={garrisonPlan}
            now={now}
            bufferSeconds={garrisonBufferSeconds}
            onChangeBufferSeconds={setGarrisonBufferSeconds}
            onMarkRallyOpened={markEnemyRallyOpened}
            onCancelRally={cancelEnemyRally}
            onClearEnemy={clearEnemy}
          />
        )}

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-moss-500">Reinforcements</h2>
            <button
              type="button"
              onClick={() => addBlankPlayer('garrison')}
              className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs font-semibold text-moss-500 hover:border-moss-500 transition-colors"
            >
              + Add Reinforcement
            </button>
          </div>

          {garrisonPlayers.length === 0 ? (
            <p className="text-sm text-parchment-500 py-6 text-center">
              Tap the map above (Reinforcement mode) to add someone who'll garrison, not rally.
            </p>
          ) : (
            garrisonPlayers.map((player, i) => (
              <RallyPlayerRow
                key={player.id}
                player={player}
                index={i}
                isLast={i === garrisonPlayers.length - 1}
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
