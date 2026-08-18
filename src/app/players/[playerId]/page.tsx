'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { formatStat, type PlayerProfile } from '@/lib/players';

export default function PlayerProfilePage({ params }: { params: { playerId: string } }) {
  const { t } = useI18n();
  // undefined = still loading, null = fetched and not found.
  const [profile, setProfile] = useState<PlayerProfile | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/players/${encodeURIComponent(params.playerId)}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProfile(data.profile ?? null);
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      });
    return () => {
      cancelled = true;
    };
  }, [params.playerId]);

  if (profile === undefined) {
    return <p className="text-center text-parchment-400 py-16">{t('common.loading')}</p>;
  }

  if (profile === null) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <p className="text-parchment-300 mb-4">{t('players.notFound')}</p>
        <Link
          href="/players"
          className="focus-ring inline-block rounded-md border border-stone-700 px-5 py-2 text-sm text-parchment-100 hover:border-gold-600 transition-colors"
        >
          {t('players.backToDirectory')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-8">
      <Link
        href="/players"
        className="focus-ring inline-block mb-4 text-xs text-parchment-400 hover:text-gold-300 transition-colors"
      >
        ← {t('players.backToDirectory')}
      </Link>

      <div className="dashboard-card p-6 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold text-parchment-100">{profile.player_name}</h1>
          <p className="text-xs text-parchment-500">
            ID {profile.player_id} · {t('players.fieldKingdom')} {profile.kingdom}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat label={t('players.fieldAlliance')} value={profile.alliance || '—'} />
          <Stat label={t('players.fieldPower')} value={formatStat(profile.power)} />
          <Stat label={t('players.fieldKills')} value={formatStat(profile.kills)} />
          <Stat label={t('players.fieldVipLevel')} value={profile.vip_level != null ? String(profile.vip_level) : '—'} />
          <Stat label={t('players.fieldFurnaceLevel')} value={profile.furnace_level || '—'} />
        </div>

        <p className="text-[11px] text-parchment-500">
          {t('players.lastUpdated')} {new Date(profile.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-stone-700 bg-stone-950 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-parchment-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gold-300 tabular-nums">{value}</p>
    </div>
  );
}
