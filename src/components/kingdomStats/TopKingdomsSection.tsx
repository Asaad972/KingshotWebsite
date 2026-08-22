'use client';

import { useEffect, useState } from 'react';
import type { TopKingdom } from '@/lib/kingshotStatsApi';

type Status = 'loading' | 'error' | 'ready';

const powerFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });
function formatPower(n: number): string {
  return powerFormatter.format(n);
}

const HEALTH_TONE: Record<string, string> = {
  soft: '!border-ember-500/50 !text-ember-500',
  quiet: '!border-ember-500/50 !text-ember-500',
  fair: '!border-gold-500/50 !text-gold-400',
  stable: '!border-cyan-500/50 !text-cyan-300',
  good: '!border-moss-500/50 !text-moss-500',
  strong: '!border-moss-500/50 !text-moss-500',
};

/** Real, live kingdom rankings by total power -- shown inline as a
 * toggle-able panel on the Kingdom Power Leaderboard rather than its own
 * page, so picking one flows straight into that same leaderboard. */
export default function TopKingdomsSection({ onSelectKingdom }: { onSelectKingdom: (kid: number) => void }) {
  const [kingdoms, setKingdoms] = useState<TopKingdom[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    fetch('/api/top-kingdoms')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setStatus('error');
          return;
        }
        setKingdoms(data.kingdoms);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading') {
    return <p className="text-sm text-parchment-500 py-6 text-center">Loading…</p>;
  }
  if (status === 'error') {
    return <p className="text-sm text-ember-500 py-4">Couldn't reach the leaderboard data right now -- try again in a moment.</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {kingdoms.map((k, i) => (
        <button
          key={k.kid}
          type="button"
          onClick={() => onSelectKingdom(k.kid)}
          className="focus-ring dashboard-card p-3 flex items-center gap-3 w-full text-left hover:border-gold-600/50 transition-colors"
        >
          <span className="w-8 shrink-0 text-center text-sm font-bold text-parchment-500 tabular-nums">#{i + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-parchment-100">Kingdom #{k.kid}</p>
            <p className="text-xs text-parchment-500">
              {k.player_count.toLocaleString()} players · {k.alliance_count.toLocaleString()} alliances
            </p>
          </div>
          {k.health && <span className={`chip shrink-0 ${HEALTH_TONE[k.health.tone] ?? ''}`}>{k.health.grade}</span>}
          <p className="shrink-0 text-sm font-bold text-gold-300 tabular-nums w-16 text-right">{formatPower(k.power)}</p>
        </button>
      ))}
    </div>
  );
}
