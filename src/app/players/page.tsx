'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import PlayerDirectoryList from '@/components/players/PlayerDirectoryList';
import PlayerProfileForm from '@/components/players/PlayerProfileForm';
import type { PlayerProfile } from '@/lib/players';

/**
 * Player Directory -- an isolated, self-reported feature (this page +
 * src/components/players/* + src/lib/players.ts + src/app/api/players/**).
 * Every profile is whatever the player themselves typed in and chose to
 * submit (upsert by player_id, no login) -- nothing here is scraped or
 * bot-collected. To remove it entirely: delete this folder, that lib file,
 * those components, and the api/players routes. Nothing else imports from
 * here.
 */
export default function PlayersPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerProfile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const load = async (q: string) => {
    setLoading(true);
    try {
      const url = q.trim() ? `/api/players?q=${encodeURIComponent(q.trim())}` : '/api/players';
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => load(query), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div>
          <h1 className="text-lg font-semibold text-parchment-100">{t('players.title')}</h1>
          <p className="text-xs text-parchment-400 mt-0.5">{t('players.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="focus-ring shrink-0 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
        >
          {t('players.addProfileButton')}
        </button>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('players.searchPlaceholder')}
        className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600 mb-5"
      />

      {loading ? (
        <p className="text-parchment-400 text-sm py-8 text-center">{t('common.loading')}</p>
      ) : (
        <PlayerDirectoryList results={results || []} />
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4"
          onClick={() => setFormOpen(false)}
        >
          <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <PlayerProfileForm
              onClose={() => setFormOpen(false)}
              onSaved={() => {
                setFormOpen(false);
                load(query);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
