'use client';

import { useState } from 'react';
import {
  formatCountdown,
  formatUtcHms,
  getRallyCountdownState,
  buildDiscordRallyText,
  type RallyPlan,
  type RallyCountdownState,
} from '@/lib/rally';

interface RallyResultsProps {
  plan: RallyPlan;
  now: Date;
  onSetTargetToNow: () => void;
}

export default function RallyResults({ plan, now, onSetTargetToNow }: RallyResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildDiscordRallyText(plan));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable -- button just won't flip to "Copied".
    }
  };

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4 sm:sticky sm:top-4">
      <div>
        <h2 className="text-sm font-semibold text-gold-300">RALLY PLAN</h2>
        <p className="text-xs text-parchment-400 mt-1.5">
          Target: <span className="font-mono text-parchment-100">{formatUtcHms(plan.targetArrival)} UTC</span>
        </p>
        {plan.startPreparing && (
          <p className="text-xs text-parchment-400">
            Start Preparing: <span className="font-mono text-parchment-100">{formatUtcHms(plan.startPreparing)} UTC</span>
          </p>
        )}
      </div>

      {plan.players.length === 0 ? (
        <p className="text-sm text-parchment-500 py-4 text-center">Add at least one player.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {plan.players.map((p, i) => {
            const state = getRallyCountdownState(p.rallyOpenTime, now);
            return (
              <div key={p.id} className="rounded border border-stone-700 bg-stone-950 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-parchment-100 truncate">
                    {i + 1}. {p.name.trim() || `Player ${i + 1}`}
                  </span>
                  <CountdownBadge state={state} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-parchment-400">
                  <span>
                    Open: <span className="font-mono text-parchment-200">{p.rallyOpenTime ? formatUtcHms(p.rallyOpenTime) : '—'}</span>
                  </span>
                  <span>
                    Arrival: <span className="font-mono text-parchment-200">{formatUtcHms(p.arrivalTime)}</span>
                    {i > 0 && (
                      <span className="text-gold-300">
                        {' '}
                        {p.offsetSeconds >= 0 ? '+' : ''}
                        {p.offsetSeconds}s
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSetTargetToNow}
          className="focus-ring shrink-0 rounded-md border border-stone-700 px-3 py-2.5 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
        >
          Set to Now + Delay
        </button>
        <button
          onClick={handleCopy}
          disabled={plan.players.length === 0}
          className="focus-ring flex-1 rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {copied ? 'Copied!' : 'Copy Results'}
        </button>
      </div>
    </div>
  );
}

function CountdownBadge({ state }: { state: RallyCountdownState }) {
  if (state.kind === 'no-town') {
    return <span className="text-[11px] text-parchment-500 shrink-0">No town</span>;
  }
  if (state.kind === 'waiting') {
    return (
      <span className="text-[11px] font-mono text-sky-400 shrink-0 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]">
        OPEN IN: {formatCountdown(state.secondsUntilOpen)}
      </span>
    );
  }
  if (state.kind === 'open-now') {
    return (
      <span className="text-[11px] font-semibold text-moss-500 shrink-0 drop-shadow-[0_0_7px_rgba(63,174,114,0.65)]">
        OPEN NOW
      </span>
    );
  }
  return (
    <span className="text-[11px] font-mono text-ember-500 shrink-0 drop-shadow-[0_0_6px_rgba(226,80,63,0.5)]">
      LATE BY: {formatCountdown(state.secondsLate)}
    </span>
  );
}
