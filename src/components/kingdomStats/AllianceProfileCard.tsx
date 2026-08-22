'use client';

import { resolveAvatarUrl, type AllianceProfile } from '@/lib/kingshotStatsApi';

const powerFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });
function formatPower(n: number): string {
  return powerFormatter.format(n);
}

/** Alliance roster + info popup -- same shared-card pattern as
 * GovernorProfileCard, opened from a leaderboard alliance tag or the map's
 * alliance search. Clicking a member reuses GovernorProfileModal, so the
 * two profile types stay one click apart in either direction. */
export default function AllianceProfileCard({
  alliance,
  onClose,
  onSelectMember,
}: {
  alliance: AllianceProfile;
  onClose?: () => void;
  onSelectMember: (uid: number) => void;
}) {
  const flagSrc = resolveAvatarUrl(alliance.flag_url);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {flagSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flagSrc} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />
          ) : (
            <span className="h-12 w-12 shrink-0 rounded bg-stone-800" aria-hidden />
          )}
          <div>
            <p className="text-sm font-bold text-parchment-100">
              [{alliance.abbr}] {alliance.name}
            </p>
            <p className="text-xs text-parchment-500">
              Kingdom #{alliance.kid} · Led by {alliance.leader_name}
              {alliance.power_rank ? ` · Power rank #${alliance.power_rank}` : ''}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-400">Power</p>
          <p className="text-lg font-bold text-parchment-100 tabular-nums">{formatPower(alliance.power)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-400">Members</p>
          <p className="text-lg font-bold text-parchment-100 tabular-nums">
            {alliance.count}/{alliance.member_max}
          </p>
        </div>
        {alliance.language_label && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400">Language</p>
            <p className="text-lg font-bold text-parchment-100">{alliance.language_label}</p>
          </div>
        )}
      </div>

      {alliance.notice && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1">Notice</p>
          <p className="text-xs text-parchment-300 whitespace-pre-wrap line-clamp-4">{alliance.notice}</p>
        </div>
      )}

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1.5">
          Members ({alliance.members.length})
        </p>
        <div className="max-h-72 overflow-y-auto flex flex-col gap-1 pr-1">
          {alliance.members.map((m) => {
            const memberAvatar = resolveAvatarUrl(m.avatar_url);
            return (
              <button
                key={m.uid}
                type="button"
                onClick={() => onSelectMember(m.uid)}
                className="focus-ring flex items-center gap-2.5 rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-left hover:border-gold-600 transition-colors"
              >
                {memberAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={memberAvatar} alt="" className="h-7 w-7 shrink-0 rounded object-cover" />
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded bg-stone-800" aria-hidden />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-parchment-100 truncate">{m.nick_name}</p>
                  <p className="text-[11px] text-parchment-500">
                    {m.alliance_rank_label ?? ''}
                    {m.kills != null ? ` · ${formatPower(m.kills)} kills` : ''}
                  </p>
                </div>
                <p className="text-xs font-bold text-cyan-300 tabular-nums shrink-0">{formatPower(m.power)}</p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-parchment-500">may lag behind the live game</p>
    </div>
  );
}
