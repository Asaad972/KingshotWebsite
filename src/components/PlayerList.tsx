'use client';

import { useI18n } from '@/lib/i18n';
import { formatUtcDate, formatUtcTime } from '@/lib/slots';
import StatusBadge from './StatusBadge';

export interface PlayerResult {
  application_id: string;
  player_name: string;
  player_id: string | null;
  alliance: string;
  status: string;
  requested_times: Array<{ time: string; request_status: string }>;
  accepted_time: string | null;
}

function StatusPill({ status }: { status: string }) {
  const { t } = useI18n();
  if (status === 'accepted') return <StatusBadge tone="moss">{t('admin.statusAssigned')}</StatusBadge>;
  if (status === 'rejected') return <StatusBadge tone="ember">{t('admin.statusRejected')}</StatusBadge>;
  return <StatusBadge tone="sky">{t('admin.statusWaiting')}</StatusBadge>;
}

export default function PlayerList({ results }: { results: PlayerResult[] }) {
  const { t, locale } = useI18n();

  if (results.length === 0) {
    return <p className="text-parchment-400 py-8 text-center">{t('admin.searchNoResults')}</p>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block dashboard-card overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-700 text-start text-xs uppercase tracking-wide text-parchment-400">
              <th className="px-4 py-3 text-start font-medium">{t('admin.playerCol')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('admin.requestedSlotsCol')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('admin.statusCol')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('admin.assignedTimeCol')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.application_id} className="border-b border-stone-800/60 last:border-0">
                <td className="px-4 py-3">
                  <span className="text-parchment-100 font-semibold">{r.player_name}</span>
                </td>
                <td className="px-4 py-3 text-parchment-300 tabular-nums">
                  {r.requested_times.length} {t('admin.requested')}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {r.accepted_time ? (
                    <span className="text-gold-300">
                      {formatUtcTime(r.accepted_time)} · {formatUtcDate(r.accepted_time, locale ?? 'en')}
                    </span>
                  ) : (
                    <span className="text-parchment-500">{t('admin.notAcceptedYet')}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {results.map((r) => (
          <div key={r.application_id} className="dashboard-card p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-semibold text-parchment-100">{r.player_name}</p>
              <StatusPill status={r.status} />
            </div>
            <p className="text-xs text-parchment-400 mb-1">
              {r.requested_times.length} {t('admin.requested')}
            </p>
            {r.accepted_time ? (
              <p className="text-sm text-gold-300 tabular-nums">
                {formatUtcTime(r.accepted_time)} UTC{' '}
                <span className="text-xs text-parchment-400">· {formatUtcDate(r.accepted_time, locale ?? 'en')}</span>
              </p>
            ) : (
              <p className="text-sm text-parchment-500">{t('admin.notAcceptedYet')}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
