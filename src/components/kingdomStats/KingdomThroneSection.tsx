'use client';

import { resolveAvatarUrl, type KingdomOfficeHolder } from '@/lib/kingshotStatsApi';

const powerFormatter = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 });
function formatPower(n: number): string {
  return powerFormatter.format(n);
}

function OfficeCard({
  office,
  highlight,
  tone,
  onSelectPlayer,
}: {
  office: KingdomOfficeHolder;
  highlight?: boolean;
  tone?: 'ember';
  onSelectPlayer: (uid: number) => void;
}) {
  const iconSrc = resolveAvatarUrl(office.icon_url);
  const avatarSrc = resolveAvatarUrl(office.avatar_url);
  const borderTone = tone === 'ember' ? 'border-ember-600/30' : 'border-stone-700';

  if (office.vacant || office.uid == null) {
    return (
      <div className={`rounded border ${borderTone} bg-stone-950 p-2 flex flex-col items-center text-center gap-1 opacity-50`}>
        {iconSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={iconSrc} alt="" className="h-7 w-7" />
        ) : (
          <span className="h-7 w-7 rounded bg-stone-800" aria-hidden />
        )}
        <p className="text-[11px] font-semibold text-parchment-400 truncate w-full">{office.role}</p>
        <p className="text-[10px] text-parchment-600">Vacant</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelectPlayer(office.uid!)}
      className={`focus-ring rounded border ${borderTone} bg-stone-950 p-2 flex flex-col items-center text-center gap-1 hover:border-gold-600 transition-colors ${
        highlight ? 'ring-1 ring-gold-500/40' : ''
      }`}
    >
      {iconSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconSrc} alt="" className="h-6 w-6" />
      )}
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarSrc} alt="" className="h-9 w-9 rounded object-cover" />
      ) : (
        <span className="h-9 w-9 rounded bg-stone-800" aria-hidden />
      )}
      <p className="text-[11px] font-semibold text-parchment-400 truncate w-full">{office.role}</p>
      <p className="text-xs font-bold text-parchment-100 truncate w-full">{office.nick_name}</p>
      {office.alliance_abbr && <p className="text-[10px] text-parchment-500">[{office.alliance_abbr}]</p>}
      {office.power != null && <p className="text-[10px] text-cyan-300 tabular-nums">{formatPower(office.power)}</p>}
    </button>
  );
}

/** A kingdom's King / Ministers / Offenders -- who (if anyone) currently
 * holds each office. Vacant offices render dimmed with no click target;
 * filled ones open GovernorProfileModal like everywhere else. */
export default function KingdomThroneSection({
  king,
  ministers,
  offenders,
  onSelectPlayer,
}: {
  king: KingdomOfficeHolder | null;
  ministers: KingdomOfficeHolder[];
  offenders: KingdomOfficeHolder[];
  onSelectPlayer: (uid: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {king && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-400 mb-1.5">King</p>
          <div className="max-w-[140px]">
            <OfficeCard office={king} highlight onSelectPlayer={onSelectPlayer} />
          </div>
        </div>
      )}

      {ministers.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-parchment-400 mb-1.5">Ministers</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ministers.map((m) => (
              <OfficeCard key={m.office_id} office={m} onSelectPlayer={onSelectPlayer} />
            ))}
          </div>
        </div>
      )}

      {offenders.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ember-500 mb-1.5">Offenders</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {offenders.map((o) => (
              <OfficeCard key={o.office_id} office={o} tone="ember" onSelectPlayer={onSelectPlayer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
