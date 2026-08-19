'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import PlayerList, { type PlayerResult } from '@/components/PlayerList';

export default function AdminPlayersPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerResult[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = query.trim()
          ? `/api/admin/search?q=${encodeURIComponent(query.trim())}`
          : '/api/admin/search?all=1';
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        setResults(data.results || []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <h1 className="section-title mb-4">{t('admin.playersTitle')}</h1>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('admin.searchPlaceholder')}
        className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600 mb-5"
      />

      {loading ? (
        <p className="text-parchment-400 text-sm py-8 text-center">{t('common.loading')}</p>
      ) : (
        <PlayerList results={results || []} />
      )}
    </div>
  );
}
