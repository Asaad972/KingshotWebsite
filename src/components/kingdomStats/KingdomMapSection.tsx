'use client';

import { useEffect, useState } from 'react';
import type { KingdomMapData, MapAlliance, MapCity } from '@/lib/kingshotStatsApi';
import KingdomMapCanvas from './KingdomMapCanvas';
import GovernorProfileModal from './GovernorProfileModal';

type Status = 'loading' | 'error' | 'not_found' | 'ready';
type RefreshState = 'idle' | 'requesting' | 'polling' | 'blocked' | 'error';

const MAX_POLLS = 60; // ~2 minutes at 2s each -- a safety net, not the expected case

export default function KingdomMapSection({ defaultKingdom }: { defaultKingdom: number }) {
  const [input, setInput] = useState(String(defaultKingdom));
  const [kingdomId, setKingdomId] = useState<number | null>(null);
  const [map, setMap] = useState<KingdomMapData | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const [nameQuery, setNameQuery] = useState('');
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [allianceFilter, setAllianceFilter] = useState<string | null>(null);

  const [refreshState, setRefreshState] = useState<RefreshState>('idle');
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const search = async (id: number, opts?: { fresh?: boolean; preserveView?: boolean }) => {
    setStatus('loading');
    setKingdomId(id);
    if (!opts?.preserveView) {
      setFocusPoint(null);
      setNameQuery('');
      setAllianceFilter(null);
    }
    try {
      const res = await fetch(`/api/kingdom-map?kingdom=${id}${opts?.fresh ? '&fresh=1' : ''}`);
      const data = await res.json();
      if (!data.success) {
        setStatus(data.reason === 'not_found' ? 'not_found' : 'error');
        return;
      }
      setMap(data.map);
      setStatus(data.map.cities.length === 0 ? 'not_found' : 'ready');
    } catch {
      setStatus('error');
    }
  };

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

  const handleRefresh = async () => {
    if (kingdomId == null) return;
    setRefreshState('requesting');
    setRefreshMessage(null);
    try {
      const res = await fetch(`/api/kingdom-map/refresh?kingdom=${kingdomId}`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setRefreshState('blocked');
        setRefreshMessage(
          data.reason === 'cooldown'
            ? 'This kingdom was just refreshed -- try again in a few minutes.'
            : "Couldn't start a refresh right now -- try again later."
        );
        return;
      }

      setRefreshState('polling');
      const token = data.token as string | null;

      // The exact response shape wasn't confirmed against a live call
      // before shipping (we don't fire extra triggers just to check a
      // field name) -- without a token we can't poll their status
      // endpoint, so fall back to a fixed wait then a single fresh
      // reload instead of guessing at a broken poll loop.
      if (!token) {
        setRefreshMessage('Refreshing the map…');
        setTimeout(async () => {
          setRefreshMessage(null);
          setRefreshState('idle');
          await search(kingdomId, { fresh: true, preserveView: true });
        }, 10000);
        return;
      }

      let polls = 0;
      const poll = async () => {
        polls += 1;
        try {
          const statusRes = await fetch(`/api/kingdom-map/refresh-status?kingdom=${kingdomId}&token=${encodeURIComponent(token)}`);
          const statusData = await statusRes.json();
          const jobStatus = statusData.success ? statusData.status : null;
          const stillRunning = jobStatus && (jobStatus.status === 'running' || jobStatus.status === 'queued');

          if (stillRunning && polls < MAX_POLLS) {
            setRefreshMessage(
              jobStatus.queue_position ? `Queued (position ${jobStatus.queue_position})…` : 'Refreshing the map…'
            );
            setTimeout(poll, 2000);
            return;
          }

          // Job finished (or we gave up waiting) -- reload the map data
          // either way, since a scan may have completed even if our last
          // status check didn't land cleanly.
          setRefreshMessage(null);
          setRefreshState('idle');
          await search(kingdomId, { fresh: true, preserveView: true });
        } catch {
          setRefreshState('error');
          setRefreshMessage("Lost track of the refresh -- reload the page to check the map's current state.");
        }
      };

      poll();
    } catch {
      setRefreshState('error');
      setRefreshMessage("Couldn't start a refresh right now -- try again later.");
    }
  };

  const query = nameQuery.trim().toLowerCase();
  const governorMatches: MapCity[] =
    map && query.length > 0
      ? map.cities.filter((c) => c.nick_name.toLowerCase().includes(query) || String(c.fid).includes(query)).slice(0, 6)
      : [];
  const allianceMatches: MapAlliance[] =
    map && query.length > 0
      ? map.alliances.filter((a) => a.abbr.toLowerCase().includes(query) || a.name.toLowerCase().includes(query)).slice(0, 4)
      : [];

  const visibleCities = allianceFilter ? map?.cities.filter((c) => c.alliance_abbr === allianceFilter) ?? [] : map?.cities ?? [];
  const visibleAlliances = allianceFilter ? map?.alliances.filter((a) => a.abbr === allianceFilter) ?? [] : map?.alliances ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
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

        {status === 'ready' && map && (
          <div className="relative flex-1 min-w-[160px]">
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Find a governor (name or ID) or alliance…"
              className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-cyan-500"
            />
            {query.length > 0 && governorMatches.length === 0 && allianceMatches.length === 0 && (
              <p className="mt-1 text-xs text-parchment-500">
                No matches on this kingdom's map -- filters as you type, no need to press a button.
              </p>
            )}
            {(governorMatches.length > 0 || allianceMatches.length > 0) && (
              <div className="absolute z-20 mt-1 w-full dashboard-card p-1.5 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
                {allianceMatches.map((a) => (
                  <button
                    key={a.aid}
                    type="button"
                    onClick={() => {
                      setAllianceFilter(a.abbr);
                      setFocusPoint({ x: a.cx, y: a.cy });
                      setNameQuery('');
                    }}
                    className="focus-ring rounded px-2 py-1.5 text-left text-sm hover:bg-stone-800 transition-colors"
                  >
                    <span className="chip !border-cyan-500/50 !text-cyan-300 mr-1.5">Alliance</span>
                    <span className="text-parchment-100 font-semibold">[{a.abbr}]</span>{' '}
                    <span className="text-parchment-500">{a.name} · {a.city_count} cities</span>
                  </button>
                ))}
                {governorMatches.map((c) => (
                  <button
                    key={c.uid}
                    type="button"
                    onClick={() => {
                      setFocusPoint({ x: c.x, y: c.y });
                      setNameQuery('');
                    }}
                    className="focus-ring rounded px-2 py-1.5 text-left text-sm text-parchment-200 hover:bg-stone-800 transition-colors"
                  >
                    {c.nick_name}
                    <span className="text-parchment-500"> {c.alliance_abbr ? `[${c.alliance_abbr}]` : ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {allianceFilter && (
          <span className="chip !border-gold-500/50 !text-gold-300 shrink-0">
            [{allianceFilter}] only
            <button
              type="button"
              onClick={() => setAllianceFilter(null)}
              aria-label="Clear alliance filter"
              className="focus-ring ml-1.5"
            >
              ✕
            </button>
          </span>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-ember-500 py-4">Couldn't reach the map data right now -- try again in a moment.</p>
      )}
      {status === 'not_found' && kingdomId != null && (
        <p className="text-sm text-parchment-400 py-4">No map data found for Kingdom #{kingdomId}.</p>
      )}

      {status === 'ready' && map && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-parchment-500">
              Kingdom #{map.kid} · {visibleCities.length.toLocaleString()} of {map.cities.length.toLocaleString()} cities shown ·{' '}
              {map.alliances.length.toLocaleString()} alliances -- drag to pan, scroll or +/− to zoom, click a city for that
              governor's profile.
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshState === 'requesting' || refreshState === 'polling'}
              className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs font-semibold text-parchment-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors disabled:opacity-50"
            >
              {refreshState === 'requesting' || refreshState === 'polling' ? 'Refreshing…' : 'Refresh Map'}
            </button>
          </div>
          {refreshMessage && (
            <p className={`text-xs ${refreshState === 'blocked' || refreshState === 'error' ? 'text-ember-500' : 'text-cyan-300'}`}>
              {refreshMessage}
            </p>
          )}
          <KingdomMapCanvas
            cities={visibleCities}
            alliances={visibleAlliances}
            legendAlliances={map.alliances}
            bounds={map.bounds}
            focusPoint={focusPoint}
            onSelectCity={setSelectedUid}
            activeAllianceAbbr={allianceFilter}
            onSelectAlliance={(abbr) => {
              if (allianceFilter === abbr) {
                setAllianceFilter(null);
                return;
              }
              setAllianceFilter(abbr);
              const a = map.alliances.find((x) => x.abbr === abbr);
              if (a) setFocusPoint({ x: a.cx, y: a.cy });
            }}
          />
        </>
      )}

      <GovernorProfileModal uid={selectedUid} onClose={() => setSelectedUid(null)} />
    </div>
  );
}
