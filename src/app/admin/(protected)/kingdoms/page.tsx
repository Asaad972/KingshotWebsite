'use client';

import { useCallback, useEffect, useState } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';

interface KingdomRow {
  kingdom_id: string;
  slug: string;
  name: string;
  created_at: string;
  total_applications: number;
  last_activity_at: string | null;
}

const STALE_DAYS = 14;

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function formatRelative(iso: string): string {
  const days = daysAgo(iso);
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function AdminKingdomsPage() {
  const [kingdoms, setKingdoms] = useState<KingdomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<KingdomRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/kingdoms', { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setKingdoms(data.kingdoms || []);
      setError(null);
    } catch {
      setError('Something went wrong loading kingdoms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/kingdoms/${pendingDelete.kingdom_id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        setError(data.reason || 'Could not delete this kingdom.');
      }
      setPendingDelete(null);
      await load();
    } catch {
      setError('Could not delete this kingdom.');
    } finally {
      setDeleting(false);
    }
  };

  // Stalest first (never-used or longest since last booking) so the
  // kingdoms most worth reviewing for deletion surface at the top.
  const sorted = [...kingdoms].sort((a, b) => {
    const aTime = new Date(a.last_activity_at ?? a.created_at).getTime();
    const bTime = new Date(b.last_activity_at ?? b.created_at).getTime();
    return aTime - bTime;
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="section-title">Kingdoms</h1>
          <p className="text-xs text-parchment-400 mt-0.5">
            Every self-serve kingdom created via /start. Sorted stalest first.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-ember-600/50 bg-ember-500/10 px-3 py-2 text-sm text-ember-500">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-parchment-400 py-16 text-center">Loading…</p>
      ) : sorted.length === 0 ? (
        <p className="text-parchment-400 py-16 text-center">No kingdoms created yet.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((k) => {
            const effectiveDate = k.last_activity_at ?? k.created_at;
            const stale = daysAgo(effectiveDate) >= STALE_DAYS;
            return (
              <div
                key={k.kingdom_id}
                className={`dashboard-card p-4 flex flex-wrap items-center justify-between gap-3 ${
                  stale ? 'border-ember-600/40' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-parchment-100">{k.name}</p>
                    {stale && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-ember-500 border border-ember-600/50 rounded px-1.5 py-0.5">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-parchment-400 mt-0.5">
                    /k/{k.slug} · created {formatRelative(k.created_at)} ·{' '}
                    {k.total_applications} application{k.total_applications === 1 ? '' : 's'} ·{' '}
                    {k.last_activity_at ? `last booking ${formatRelative(k.last_activity_at)}` : 'never used'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/k/${k.slug}/book`}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded border border-stone-700 px-2.5 py-1.5 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
                  >
                    View booking page
                  </a>
                  <button
                    onClick={() => setPendingDelete(k)}
                    className="focus-ring rounded border border-ember-600/50 px-2.5 py-1.5 text-xs text-ember-500 hover:bg-ember-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        loading={deleting}
        title={`Delete "${pendingDelete?.name}"?`}
        bullets={[
          'Permanently deletes their booking link, admin link, and every application/appointment they have.',
          'This cannot be undone.',
        ]}
        confirmLabel="Delete kingdom"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
