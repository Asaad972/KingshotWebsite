'use client';

import { resolveAvatarUrl, type PlayerProfile } from '@/lib/kingshotStatsApi';

const powerFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });
function formatPower(n: number): string {
  return powerFormatter.format(n);
}

function formatLastSeen(epochSeconds: number | null): string {
  if (!epochSeconds) return 'Unknown';
  const diffMs = Date.now() - epochSeconds * 1000;
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/** Full governor profile card -- avatar/name/alliance header, core stats,
 * Trial Towers, and Arena Defense. Shared between the standalone Governor
 * Search page and the popup opened by clicking a name on a kingdom
 * leaderboard, so both stay in sync automatically. */
export default function GovernorProfileCard({
  profile,
  onClose,
  closeLabel = 'Close',
  onRefresh,
  refreshing,
}: {
  profile: PlayerProfile;
  onClose?: () => void;
  closeLabel?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const avatarSrc = resolveAvatarUrl(profile.upload_image ? `/cdn/avatar/${profile.upload_image}` : null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
          ) : (
            <span className="h-12 w-12 shrink-0 rounded bg-stone-800" aria-hidden />
          )}
          <div>
            <p className="text-sm font-bold text-parchment-100">
              {profile.nick_name}
              {profile.is_vip_active && <span className="ml-1.5 chip !border-gold-500/50 !text-gold-400">VIP</span>}
            </p>
            <p className="text-xs text-parchment-500">
              Kingdom #{profile.kid}
              {profile.alliance_abbr ? ` · [${profile.alliance_abbr}] ${profile.alliance_name}` : ' · No alliance'}
              {profile.alliance_rank ? ` · Rank ${profile.alliance_rank}` : ''}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
          >
            {closeLabel}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-400">Power</p>
          <p className="text-lg font-bold text-parchment-100 tabular-nums">{formatPower(profile.power)}</p>
          {profile.power_rank && <p className="text-[11px] text-parchment-500">Kingdom rank #{profile.power_rank}</p>}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-400">Kills</p>
          <p className="text-lg font-bold text-parchment-100 tabular-nums">
            {profile.kills != null ? formatPower(profile.kills) : '—'}
          </p>
          {profile.kills_rank && <p className="text-[11px] text-parchment-500">Kingdom rank #{profile.kills_rank}</p>}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400">TC Level</p>
          <p className="text-lg font-bold text-parchment-100 tabular-nums">{profile.stove_lv}</p>
          {profile.stove_rank && <p className="text-[11px] text-parchment-500">Kingdom rank #{profile.stove_rank}</p>}
        </div>
        {profile.mystic_trial != null && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400">Mystic Trial</p>
            <p className="text-lg font-bold text-parchment-100 tabular-nums">{profile.mystic_trial.toLocaleString()}</p>
            {profile.mystic_rank && <p className="text-[11px] text-parchment-500">Kingdom rank #{profile.mystic_rank}</p>}
          </div>
        )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400">Last Seen</p>
          <p className="text-lg font-bold text-parchment-100">{formatLastSeen(profile.last_seen_at)}</p>
        </div>
      </div>

      {profile.trials.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1.5">Trial Towers</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profile.trials.map((t) => (
              <div key={t.tower_id} className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5">
                <p className="text-xs font-semibold text-parchment-200 truncate">{t.name}</p>
                <p className="text-sm font-bold text-cyan-300 tabular-nums">
                  Stage {t.stage}
                  {t.rank && <span className="text-[11px] font-normal text-parchment-500"> · #{t.rank}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.heroes.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1.5">Arena Defense</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {profile.heroes.map((h) => {
              const heroIcon = resolveAvatarUrl(h.icon);
              return (
                <div key={h.pos} className="rounded border border-stone-700 bg-stone-950 p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    {heroIcon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={heroIcon} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
                    ) : (
                      <span className="h-9 w-9 shrink-0 rounded bg-stone-800" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-parchment-100 truncate">{h.name}</p>
                      <p className="text-[11px] text-parchment-500">
                        {h.starLabel ?? ''} {h.heroLevel != null && `· Lv${h.heroLevel}`}
                      </p>
                    </div>
                  </div>
                  {h.gearTiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-1">
                      {h.gearTiles.map((g, i) => {
                        const gearIcon = resolveAvatarUrl(g.icon);
                        return (
                          <div
                            key={i}
                            title={g.name ?? g.slot}
                            className={`flex items-center gap-1.5 rounded border px-1.5 py-1 ${
                              g.exclusive ? 'border-gold-500/60 bg-gold-500/5' : 'border-stone-700'
                            }`}
                          >
                            {gearIcon ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={gearIcon} alt="" className="h-6 w-6 shrink-0 rounded object-cover" />
                            ) : (
                              <span className="h-6 w-6 shrink-0 rounded bg-stone-800" aria-hidden />
                            )}
                            <div className="min-w-0">
                              <p
                                className={`text-[10px] font-semibold truncate ${
                                  g.exclusive ? 'text-gold-300' : 'text-parchment-300'
                                }`}
                              >
                                {g.slot}
                              </p>
                              <p className="text-[10px] text-parchment-500 truncate">
                                {g.bonus}
                                {g.sublabel ? ` · ${g.sublabel}` : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-parchment-500">may lag behind the live game</p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs font-semibold text-parchment-300 hover:border-cyan-500 hover:text-cyan-300 transition-colors disabled:opacity-50"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        )}
      </div>
    </div>
  );
}
