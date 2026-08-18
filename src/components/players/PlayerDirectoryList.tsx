'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { formatStat, type PlayerProfile } from '@/lib/players';

/** Same dual desktop-table / mobile-card layout as the admin Players list
 * (src/components/PlayerList.tsx), just public and search-by-anything
 * instead of admin-gated and status-focused. */
export default function PlayerDirectoryList({ results }: { results: PlayerProfile[] }) {
  const { t } = useI18n();

  if (results.length === 0) {
    return <p className="text-parchment-400 py-8 text-center text-sm">{t('players.noResults')}</p>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block dashboard-card overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-700 text-start text-xs uppercase tracking-wide text-parchment-400">
              <th className="px-4 py-3 text-start font-medium">{t('players.colName')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('players.fieldAlliance')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('players.fieldPower')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('players.fieldKills')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('players.colUpdated')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p) => (
              <tr key={p.player_id} className="border-b border-stone-800/60 last:border-0 hover:bg-stone-800/40 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/players/${encodeURIComponent(p.player_id)}`}
                    className="focus-ring rounded text-parchment-100 font-semibold hover:text-gold-300 transition-colors"
                  >
                    {p.player_name}
                  </Link>
                  <p className="text-[11px] text-parchment-500">ID {p.player_id}</p>
                </td>
                <td className="px-4 py-3 text-parchment-300">{p.alliance || '—'}</td>
                <td className="px-4 py-3 text-gold-300 tabular-nums font-semibold">{formatStat(p.power)}</td>
                <td className="px-4 py-3 text-parchment-300 tabular-nums">{formatStat(p.kills)}</td>
                <td className="px-4 py-3 text-parchment-500 text-xs">{new Date(p.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {results.map((p) => (
          <Link
            key={p.player_id}
            href={`/players/${encodeURIComponent(p.player_id)}`}
            className="focus-ring dashboard-card p-4 flex flex-col gap-1.5 block hover:border-gold-600/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-parchment-100">{p.player_name}</p>
              <span className="text-xs text-parchment-500">ID {p.player_id}</span>
            </div>
            <p className="text-xs text-parchment-400">{p.alliance || '—'}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-parchment-400">
                {t('players.fieldPower')}: <span className="text-gold-300 font-semibold tabular-nums">{formatStat(p.power)}</span>
              </span>
              <span className="text-parchment-400">
                {t('players.fieldKills')}: <span className="text-parchment-200 font-semibold tabular-nums">{formatStat(p.kills)}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
