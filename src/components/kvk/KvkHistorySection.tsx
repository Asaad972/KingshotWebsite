'use client';

import { useEffect, useState } from 'react';
import type { KvkMatch, KingdomServerInfo } from '@/lib/kvkApi';

type Status = 'idle' | 'loading' | 'error' | 'not_found' | 'ready';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysUntil(iso: string): number {
  const ms = new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86_400_000);
}

export default function KvkHistorySection({ defaultKingdom }: { defaultKingdom: number }) {
  const [input, setInput] = useState(String(defaultKingdom));
  const [kingdomId, setKingdomId] = useState<number | null>(null);
  const [matches, setMatches] = useState<KvkMatch[]>([]);
  const [server, setServer] = useState<KingdomServerInfo | null>(null);
  const [nextKvk, setNextKvk] = useState<{ date: string } | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const search = async (id: number) => {
    setStatus('loading');
    setKingdomId(id);
    try {
      const res = await fetch(`/api/kvk?kingdom=${id}`);
      const data = await res.json();
      if (!data.success) {
        setStatus('error');
        return;
      }
      setMatches(data.matches);
      setServer(data.server ?? null);
      setNextKvk(data.nextKvk ?? null);
      setStatus(data.matches.length === 0 ? 'not_found' : 'ready');
    } catch {
      setStatus('error');
    }
  };

  // Immediately useful without requiring a click first.
  useEffect(() => {
    search(defaultKingdom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(input);
    if (!Number.isInteger(id) || id < 1 || id > 9999) return;
    search(id);
  };

  const castleWins = matches.filter((m) => m.castle_winner === kingdomId).length;
  const castleLosses = matches.length - castleWins;
  const castleWinRate = matches.length > 0 ? Math.round((castleWins / matches.length) * 100) : 0;

  const prepWins = matches.filter((m) => m.prep_winner === kingdomId).length;
  const prepLosses = matches.length - prepWins;
  const prepWinRate = matches.length > 0 ? Math.round((prepWins / matches.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {nextKvk && (
        <div className="flex items-center gap-3 rounded-xl border border-cyan-600/40 bg-cyan-500/5 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <rect x="3" y="5" width="18" height="16" rx="2" strokeLinejoin="round" />
              <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-400">Next KvK (projected)</p>
            <p className="text-sm font-bold text-parchment-100">{formatDate(nextKvk.date)}</p>
          </div>
          <span className="chip !border-cyan-500/50 !text-cyan-300 shrink-0">
            {daysUntil(nextKvk.date) === 0 ? 'Today' : `in ${daysUntil(nextKvk.date)} days`}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={9999}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Kingdom #"
          className="focus-ring w-32 rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm font-mono text-parchment-100 focus:border-gold-600"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="focus-ring rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-sm text-ember-500 py-4">
          Couldn't reach the KingShot.net API right now -- try again in a moment.
        </p>
      )}

      {status === 'not_found' && kingdomId != null && (
        <div className="py-4">
          <p className="text-sm text-parchment-400">No recorded KvK matches found for Kingdom #{kingdomId}.</p>
          {server && (
            <p className="text-xs text-parchment-500 mt-1">Opened {formatDate(server.openTime)}.</p>
          )}
        </div>
      )}

      {status === 'ready' && kingdomId != null && (
        <>
          <div className="dashboard-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="label-eyebrow">Kingdom #{kingdomId}</p>
                {server && (
                  <p className="text-xs text-parchment-400 mt-0.5">
                    Opened {formatDate(server.openTime)}
                    {server.isExclusive && ' · Exclusive server'}
                  </p>
                )}
              </div>
              <p className="text-xs text-parchment-500">{matches.length} recorded KvK matches</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-400">Prep Phase</p>
                <p className="text-xl font-bold text-parchment-100 tabular-nums">
                  {prepWins}W – {prepLosses}L{' '}
                  <span className="text-sm font-semibold text-parchment-400">({prepWinRate}%)</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-400">Castle Phase</p>
                <p className="text-xl font-bold text-parchment-100 tabular-nums">
                  {castleWins}W – {castleLosses}L{' '}
                  <span className="text-sm font-semibold text-parchment-400">({castleWinRate}%)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {matches.map((m) => {
              const prepWon = m.prep_winner === kingdomId;
              const castleWon = m.castle_winner === kingdomId;
              const opponent = m.kingdom_a === kingdomId ? m.kingdom_b : m.kingdom_a;
              const isAttacker = m.attacker === kingdomId;
              return (
                <div
                  key={m.kvk_id}
                  className="dashboard-card p-3.5 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div>
                    <p className="text-sm font-semibold text-parchment-100">
                      {m.kvk_title ?? `Season ${m.season_id}`}{' '}
                      <span className="text-parchment-500 font-normal">vs Kingdom #{opponent}</span>
                    </p>
                    <p className="text-xs text-parchment-500">
                      {formatDate(m.season_date)} · {isAttacker ? 'Attacker' : 'Defender'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`chip ${prepWon ? '!border-moss-500/50 !text-moss-500' : '!border-ember-500/50 !text-ember-500'}`}
                    >
                      Prep {prepWon ? 'Won' : 'Lost'}
                    </span>
                    <span
                      className={`chip ${castleWon ? '!border-moss-500/50 !text-moss-500' : '!border-ember-500/50 !text-ember-500'}`}
                    >
                      Castle {castleWon ? 'Won' : 'Lost'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
