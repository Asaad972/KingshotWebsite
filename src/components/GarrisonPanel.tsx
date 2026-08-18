'use client';

import { useState } from 'react';
import {
  formatCountdown,
  formatUtcHms,
  getGarrisonCountdownState,
  buildDiscordGarrisonText,
  type GarrisonPlan,
  type GarrisonCountdownState,
} from '@/lib/rally';
import type { WorldPoint } from '@/lib/isometricMap';

interface GarrisonPanelProps {
  enemyTown: WorldPoint;
  enemyMarchTimeSeconds: number | null;
  hasRallyOpened: boolean;
  plan: GarrisonPlan | null;
  now: Date;
  bufferSeconds: number;
  onChangeBufferSeconds: (v: number) => void;
  onMarkRallyOpened: () => void;
  onCancelRally: () => void;
  onClearEnemy: () => void;
}

/** Shows when to send reinforcement so it lands a configurable buffer
 * relative to the enemy's hit. Reinforcing your own castle is a direct
 * march with no formation delay, but the ENEMY's incoming hit still needs
 * one, since they're rallying to attack -- that's added once, when their
 * rally opens. The countdown itself doesn't start until `onMarkRallyOpened`
 * is pressed -- marking the enemy's town on the map only records where
 * they are, since their rally may not have opened yet. `onCancelRally`
 * rewinds back to "waiting" (keeping the scouted town) for when people
 * cancel and reopen their rally to confuse defenders. */
export default function GarrisonPanel({
  enemyTown,
  enemyMarchTimeSeconds,
  hasRallyOpened,
  plan,
  now,
  bufferSeconds,
  onChangeBufferSeconds,
  onMarkRallyOpened,
  onCancelRally,
  onClearEnemy,
}: GarrisonPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(buildDiscordGarrisonText(plan));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable -- button just won't flip to "Copied".
    }
  };

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4 border border-red-900/50">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-red-400">GARRISON TIMER</h2>
          <p className="text-xs text-parchment-400 mt-1.5">
            Enemy town: <span className="font-mono text-parchment-100">{enemyTown.x}:{enemyTown.y}</span>
            {enemyMarchTimeSeconds != null && (
              <>
                {' '}· march <span className="font-mono text-parchment-100">{formatCountdown(enemyMarchTimeSeconds)}</span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClearEnemy}
          className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-red-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {!hasRallyOpened || !plan ? (
        <div className="rounded border border-red-900/50 bg-stone-950 p-3 flex flex-col gap-2.5">
          <p className="text-xs text-parchment-400">
            Their rally still needs to form before they march — press this the moment you see their rally actually open.
          </p>
          <button
            type="button"
            onClick={onMarkRallyOpened}
            className="focus-ring w-full rounded-md bg-red-600 py-2.5 text-sm font-semibold text-stone-950 hover:bg-red-500 transition-colors"
          >
            Enemy Rally Opened Now
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-parchment-400">
                Enemy hits: <span className="font-mono text-parchment-100">{formatUtcHms(plan.enemyArrivalTime)} UTC</span>
              </p>
              <p className="text-xs text-parchment-400">
                {plan.enemyArrivalTime.getTime() - now.getTime() > 0 ? (
                  <>
                    Incoming in{' '}
                    <span className="font-mono text-red-400">
                      {formatCountdown((plan.enemyArrivalTime.getTime() - now.getTime()) / 1000)}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-parchment-500">Hit time has passed</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelRally}
              className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-red-600 transition-colors"
            >
              Enemy Canceled Rally
            </button>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-parchment-400">
              Garrison lands this many seconds <span className="text-parchment-500">(negative = before the hit, positive = after)</span>
            </span>
            <input
              type="number"
              value={bufferSeconds}
              onChange={(e) => onChangeBufferSeconds(Number(e.target.value) || 0)}
              className="focus-ring w-24 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 focus:border-red-600"
            />
          </label>
          <p className="text-[11px] text-parchment-500 -mt-2">Send time = enemy hit + buffer − march time</p>

          {plan.senders.length === 0 ? (
            <p className="text-sm text-parchment-500 py-4 text-center">Add reinforcements with a town set on the Kingdom Map above.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {plan.senders.map((s, i) => {
                const state = getGarrisonCountdownState(s.sendTime, now);
                return (
                  <div key={s.id} className="rounded border border-stone-700 bg-stone-950 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-parchment-100 truncate">
                        {i + 1}. {s.name.trim() || `Player ${i + 1}`}
                      </span>
                      <GarrisonBadge state={state} />
                    </div>
                    <div className="mt-1 text-xs text-parchment-400">
                      Send at:{' '}
                      <span className="font-mono text-parchment-200">{s.sendTime ? formatUtcHms(s.sendTime) : '—'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleCopy}
            disabled={plan.senders.length === 0}
            className="focus-ring w-full rounded-md bg-red-600 py-2.5 text-sm font-semibold text-stone-950 hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
        </>
      )}
    </div>
  );
}

function GarrisonBadge({ state }: { state: GarrisonCountdownState }) {
  if (state.kind === 'no-town') {
    return <span className="text-[11px] text-parchment-500 shrink-0">No town</span>;
  }
  if (state.kind === 'waiting') {
    return (
      <span className="text-[11px] font-mono text-sky-400 shrink-0 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]">
        SEND IN: {formatCountdown(state.secondsUntilSend)}
      </span>
    );
  }
  if (state.kind === 'send-now') {
    return (
      <span className="text-[11px] font-semibold text-moss-500 shrink-0 drop-shadow-[0_0_7px_rgba(63,174,114,0.65)]">
        SEND NOW
      </span>
    );
  }
  return (
    <span className="text-[11px] font-mono text-ember-500 shrink-0 drop-shadow-[0_0_6px_rgba(226,80,63,0.5)]">
      MISSED BY: {formatCountdown(state.secondsMissed)}
    </span>
  );
}
