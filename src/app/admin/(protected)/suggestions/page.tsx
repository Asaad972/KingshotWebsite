'use client';

import { useEffect, useState } from 'react';

interface Suggestion {
  id: string;
  message: string;
  page: string | null;
  created_at: string;
  read_at: string | null;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/suggestions')
      .then((r) => r.json())
      .then((data) => setSuggestions(data.suggestions ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleRead = async (s: Suggestion) => {
    setBusyId(s.id);
    try {
      await fetch(`/api/suggestions/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !s.read_at }),
      });
      load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await fetch(`/api/suggestions/${id}`, { method: 'DELETE' });
      load();
    } finally {
      setBusyId(null);
    }
  };

  const unreadCount = suggestions.filter((s) => !s.read_at).length;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="section-title">Suggestions</h1>
        <p className="text-xs text-parchment-400 mt-0.5">
          Sent from the floating "Suggestion?" widget shown on every page.{' '}
          {unreadCount > 0 && <span className="text-gold-300 font-semibold">{unreadCount} unread</span>}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-parchment-400">Loading…</p>
      ) : suggestions.length === 0 ? (
        <p className="text-sm text-parchment-400">No suggestions yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className={`dashboard-card p-3.5 flex flex-col gap-2 ${s.read_at ? 'opacity-60' : ''}`}
            >
              <p className="text-sm text-parchment-100 whitespace-pre-wrap">{s.message}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs text-parchment-500">
                  {new Date(s.created_at).toLocaleString()}
                  {s.page && <span className="ml-2 text-parchment-600">{s.page}</span>}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => toggleRead(s)}
                    className="focus-ring rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-gold-600 transition-colors disabled:opacity-50"
                  >
                    {s.read_at ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => remove(s.id)}
                    className="focus-ring rounded border border-stone-700 px-2.5 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
