'use client';

import { useEffect, useState } from 'react';
import { resolveAvatarUrl, PLAYER_LEADERBOARD_TYPES, type KingdomStats, type KingdomRanks } from '@/lib/kingshotStatsApi';
import GovernorProfileModal from './GovernorProfileModal';
import TopKingdomsSection from './TopKingdomsSection';

type Status = 'idle' | 'loading' | 'error' | 'not_found' | 'ready';

const powerFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });

function formatPower(n: number): string {
  return powerFormatter.format(n);
}

/** Different leaderboard types carry different kinds of numbers -- Town
 * Center and Rebel Conquest are small level/stage counters, Mystic Trial
 * is a mid-size score, the rest are power-scale (compact-formatted). */
function formatBoardValue(type: string, value: number): string {
  if (type === '5') return `Lv${value}`;
  if (type === '6') return `Stage ${value}`;
  if (type === '20') return value.toLocaleString();
  return formatPower(value);
}

const HEALTH_TONE: Record<string, string> = {
  soft: '!border-ember-500/50 !text-ember-500',
  quiet: '!border-ember-500/50 !text-ember-500',
  fair: '!border-gold-500/50 !text-gold-400',
  stable: '!border-cyan-500/50 !text-cyan-300',
  good: '!border-moss-500/50 !text-moss-500',
  strong: '!border-moss-500/50 !text-moss-500',
};

function useKingdomLookup(defaultKingdom?: number) {
  const [kingdomId, setKingdomId] = useState<number | null>(null);
  const [stats, setStats] = useState<KingdomStats | null>(null);
  const [ranks, setRanks] = useState<KingdomRanks | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const search = async (id: number) => {
    setStatus('loading');
    setKingdomId(id);
    setRanks(null);
    try {
      const res = await fetch(`/api/kingdom-stats?kingdom=${id}`);
      const data = await res.json();
      if (!data.success) {
        setStatus(data.reason === 'not_found' ? 'not_found' : 'error');
        return;
      }
      setStats(data.stats);
      setStatus('ready');
      // Fetched separately and allowed to fail quietly -- the main
      // power leaderboard above already works without it, this only
      // adds the extra metric tabs when it succeeds.
      fetch(`/api/kingdom-ranks?kingdom=${id}`)
        .then((r) => r.json())
        .then((d) => d.success && setRanks(d.boards))
        .catch(() => {});
    } catch {
      setStatus('error');
    }
  };

  const clear = () => {
    setKingdomId(null);
    setStats(null);
    setRanks(null);
    setStatus('idle');
  };

  useEffect(() => {
    if (defaultKingdom != null) search(defaultKingdom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { kingdomId, stats, ranks, status, search, clear };
}

/** Stat tile that bolds/colors gold when this side beats the other side
 * in a comparison -- purely a visual highlight, `other` is undefined
 * outside compare mode so nothing lights up. */
function StatTile({ label, value, tone, winning }: { label: string; value: string; tone: string; winning?: boolean }) {
  return (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${tone}`}>{label}</p>
      <p className={`text-lg font-bold tabular-nums ${winning ? 'text-gold-300' : 'text-parchment-100'}`}>{value}</p>
    </div>
  );
}

interface DisplayRow {
  key: number;
  rank: number;
  nick_name: string;
  avatar_url: string | null;
  allianceLabel: string;
  valueLabel: string;
  subLabel: string;
}

function KingdomPanel({
  stats,
  ranks,
  metricType,
  playerLimit,
  compareAgainst,
  onSelectPlayer,
}: {
  stats: KingdomStats;
  ranks: KingdomRanks | null;
  metricType: string;
  playerLimit: number;
  compareAgainst?: KingdomStats;
  onSelectPlayer: (uid: number) => void;
}) {
  const beats = (key: 'power' | 'top_power' | 'player_count' | 'alliance_count') =>
    compareAgainst ? stats[key] > compareAgainst[key] : undefined;

  const board = metricType !== '3' ? ranks?.[metricType] : null;
  const metricLabel = PLAYER_LEADERBOARD_TYPES.find((t) => t.type === metricType)?.label ?? 'Personal Power';

  const rows: DisplayRow[] = board
    ? board.rows.map((r) => ({
        key: r.uid,
        rank: r.rank,
        nick_name: r.nick_name,
        avatar_url: r.avatar_url,
        allianceLabel: r.alliance_abbr ? `[${r.alliance_abbr}]` : 'No alliance',
        valueLabel: formatBoardValue(metricType, r.score),
        subLabel: r.tg_label ?? `Lv${r.stove_lv}`,
      }))
    : stats.players.map((p) => ({
        key: p.uid,
        rank: p.rank,
        nick_name: p.nick_name,
        avatar_url: p.avatar_url,
        allianceLabel: p.alliance_abbr ? `[${p.alliance_abbr}] ${p.alliance_name}` : 'No alliance',
        valueLabel: formatPower(p.power),
        subLabel: p.tg_label ?? `Lv${p.stove_lv}`,
      }));

  return (
    <div className="flex flex-col gap-3">
      <div className="dashboard-card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="label-eyebrow">Kingdom #{stats.kid}</p>
            <p className="text-xs text-parchment-400 mt-0.5">
              Global power rank #{stats.rank.toLocaleString()}
              {stats.age_days != null && ` · ${Math.round(stats.age_days)} days old`}
            </p>
          </div>
          {stats.health && (
            <span className={`chip ${HEALTH_TONE[stats.health.tone] ?? ''}`}>
              {stats.health.grade} · {stats.health.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Total Power" value={formatPower(stats.power)} tone="text-cyan-400" winning={beats('power')} />
          <StatTile label="Top Power" value={formatPower(stats.top_power)} tone="text-gold-400" winning={beats('top_power')} />
          <StatTile
            label="Players"
            value={stats.player_count.toLocaleString()}
            tone="text-parchment-400"
            winning={beats('player_count')}
          />
          <StatTile
            label="Alliances"
            value={stats.alliance_count.toLocaleString()}
            tone="text-parchment-400"
            winning={beats('alliance_count')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-parchment-500 px-1">
          Top {Math.min(playerLimit, rows.length)} players by {metricLabel}
        </p>
        {rows.slice(0, playerLimit).map((row) => {
          const src = resolveAvatarUrl(row.avatar_url);
          return (
            <button
              key={row.key}
              type="button"
              onClick={() => onSelectPlayer(row.key)}
              className="focus-ring dashboard-card p-2.5 flex items-center gap-3 w-full text-left hover:border-gold-600/50 transition-colors"
            >
              <span className="w-6 shrink-0 text-center text-xs font-bold text-parchment-500 tabular-nums">{row.rank}</span>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" className="h-8 w-8 shrink-0 rounded object-cover" />
              ) : (
                <span className="h-8 w-8 shrink-0 rounded bg-stone-800" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-parchment-100 truncate">{row.nick_name}</p>
                <p className="text-xs text-parchment-500 truncate">{row.allianceLabel}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-gold-300 tabular-nums">{row.valueLabel}</p>
                <p className="text-[11px] text-parchment-500">{row.subLabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function KingdomLeaderboardSection({ defaultKingdom }: { defaultKingdom: number }) {
  const primary = useKingdomLookup(defaultKingdom);
  const compare = useKingdomLookup();

  const [input, setInput] = useState(String(defaultKingdom));
  const [compareInput, setCompareInput] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [showTopKingdoms, setShowTopKingdoms] = useState(false);
  const [metricType, setMetricType] = useState('3');
  const [selectedUid, setSelectedUid] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(input);
    if (!Number.isInteger(id) || id < 1 || id > 9999) return;
    primary.search(id);
  };

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(compareInput);
    if (!Number.isInteger(id) || id < 1 || id > 9999) return;
    compare.search(id);
  };

  const isComparing = showCompare && compare.status === 'ready' && !!compare.stats;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
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
            disabled={primary.status === 'loading'}
            className="focus-ring rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {primary.status === 'loading' ? 'Searching…' : 'Search'}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTopKingdoms((v) => !v)}
              className={`focus-ring rounded border px-3 py-2 text-xs font-semibold transition-colors ${
                showTopKingdoms
                  ? 'border-gold-500 bg-gold-500/15 text-gold-300'
                  : 'border-stone-700 text-parchment-300 hover:border-gold-600/60'
              }`}
            >
              Top Kingdoms
            </button>
            {!showCompare && (
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                className="focus-ring rounded border border-stone-700 px-3 py-2 text-xs font-semibold text-parchment-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors"
              >
                + Compare kingdom
              </button>
            )}
          </div>
        </form>

        {showTopKingdoms && (
          <div className="dashboard-card p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gold-300">Top Kingdoms by Power</p>
              <button
                type="button"
                onClick={() => setShowTopKingdoms(false)}
                aria-label="Close"
                className="focus-ring rounded border border-stone-700 px-2 py-1 text-xs text-parchment-400 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <TopKingdomsSection
              onSelectKingdom={(kid) => {
                setInput(String(kid));
                primary.search(kid);
                setShowTopKingdoms(false);
              }}
            />
          </div>
        )}

        {showCompare && (
          <form onSubmit={handleCompareSubmit} className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 shrink-0">vs</span>
            <input
              type="number"
              min={1}
              max={9999}
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              placeholder="Kingdom #"
              className="focus-ring w-32 rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm font-mono text-parchment-100 focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={compare.status === 'loading'}
              className="focus-ring rounded-md border border-cyan-600/50 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
            >
              {compare.status === 'loading' ? 'Loading…' : 'Compare'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCompare(false);
                setCompareInput('');
                compare.clear();
              }}
              aria-label="Remove comparison"
              className="focus-ring ml-auto rounded border border-stone-700 px-2.5 py-2 text-xs text-parchment-400 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
            >
              ✕
            </button>
          </form>
        )}

        {compare.status === 'error' && (
          <p className="text-xs text-ember-500">Couldn't reach the comparison kingdom's data -- try again.</p>
        )}
        {compare.status === 'not_found' && compare.kingdomId != null && (
          <p className="text-xs text-parchment-400">No leaderboard data found for Kingdom #{compare.kingdomId}.</p>
        )}
      </div>

      {primary.status === 'error' && (
        <p className="text-sm text-ember-500 py-4">Couldn't reach the leaderboard data right now -- try again in a moment.</p>
      )}

      {primary.status === 'not_found' && primary.kingdomId != null && (
        <p className="text-sm text-parchment-400 py-4">No leaderboard data found for Kingdom #{primary.kingdomId}.</p>
      )}

      {primary.status === 'ready' && primary.stats && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {PLAYER_LEADERBOARD_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => setMetricType(t.type)}
                className={`focus-ring shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  metricType === t.type
                    ? 'border-gold-500 bg-gold-500/15 text-gold-300'
                    : 'border-stone-700 text-parchment-400 hover:border-gold-600/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className={isComparing ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}>
            <KingdomPanel
              stats={primary.stats}
              ranks={primary.ranks}
              metricType={metricType}
              playerLimit={isComparing ? 15 : 50}
              compareAgainst={isComparing ? compare.stats! : undefined}
              onSelectPlayer={setSelectedUid}
            />
            {isComparing && (
              <KingdomPanel
                stats={compare.stats!}
                ranks={compare.ranks}
                metricType={metricType}
                playerLimit={15}
                compareAgainst={primary.stats}
                onSelectPlayer={setSelectedUid}
              />
            )}
          </div>
        </>
      )}

      <GovernorProfileModal uid={selectedUid} onClose={() => setSelectedUid(null)} />
    </div>
  );
}
