'use client';

import { useEffect, useState } from 'react';

interface GiftCode {
  id: string;
  code: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function AdminGiftCodesPage() {
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const loadCodes = () => {
    setLoading(true);
    fetch('/api/gift-codes')
      .then((r) => r.json())
      .then((data) => setCodes(data.codes ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(loadCodes, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/gift-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({
          kind: 'error',
          text: data.reason === 'code_already_exists' ? 'That code was already added.' : 'Failed to add the code.',
        });
        return;
      }

      const redeemed = (data.redeemed ?? []) as { fid: string; status: string }[];
      const succeeded = redeemed.filter((r) => r.status === 'SUCCESS').length;
      setFeedback({
        kind: 'success',
        text:
          redeemed.length === 0
            ? 'Code added. No one is enrolled yet, so nothing to redeem.'
            : `Code added and redeemed to ${succeeded}/${redeemed.length} enrolled players.`,
      });
      setNewCode('');
      loadCodes();
    } catch {
      setFeedback({ kind: 'error', text: 'Network error -- try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/gift-codes/sync', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSyncFeedback({
          kind: 'error',
          text: data.reason === 'community_api_unreachable' ? "Couldn't reach the community code list -- try again shortly." : 'Sync failed.',
        });
        return;
      }

      const added = (data.newlyAdded ?? []) as { code: string; redeemed: number; total: number }[];
      setSyncFeedback({
        kind: 'success',
        text:
          added.length === 0
            ? `Checked ${data.checked} community codes -- nothing new.`
            : `Found ${added.length} new code${added.length === 1 ? '' : 's'}: ${added.map((a) => a.code).join(', ')}.`,
      });
      loadCodes();
    } catch {
      setSyncFeedback({ kind: 'error', text: 'Network error -- try again.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleToggle = async (c: GiftCode) => {
    setTogglingId(c.id);
    try {
      const nextStatus = c.status === 'active' ? 'inactive' : 'active';
      const res = await fetch(`/api/gift-codes/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setCodes((prev) => prev.map((code) => (code.id === c.id ? { ...code, status: nextStatus } : code)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4" dir="ltr">
      <h1 className="section-title">Gift Codes</h1>

      <div className="dashboard-card p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-parchment-100">Community Code Sync</p>
            <p className="text-xs text-parchment-400">
              A GitHub Action checks for new codes automatically every ~15 minutes. Use this to check right now.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={syncing}
            className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-2 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors disabled:opacity-50"
          >
            {syncing ? 'Checking…' : 'Sync Now'}
          </button>
        </div>
        {syncFeedback && (
          <p className={`text-xs ${syncFeedback.kind === 'success' ? 'text-moss-500' : 'text-ember-500'}`}>
            {syncFeedback.text}
          </p>
        )}
      </div>

      <form onSubmit={handleAdd} className="dashboard-card p-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-parchment-400">New code</span>
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="e.g. JP26SUMMER"
            className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm font-mono text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600"
          />
        </label>
        <button
          type="submit"
          disabled={submitting || !newCode.trim()}
          className="btn-gradient focus-ring rounded-md py-2.5 text-sm disabled:opacity-50"
        >
          {submitting ? 'Adding & redeeming…' : 'Add & Redeem to All Enrolled'}
        </button>
        {feedback && (
          <p className={`text-xs ${feedback.kind === 'success' ? 'text-moss-500' : 'text-ember-500'}`}>
            {feedback.text}
          </p>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-parchment-500 text-center py-6">Loading…</p>
      ) : codes.length === 0 ? (
        <p className="text-sm text-parchment-500 text-center py-6">No codes yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {codes.map((c) => (
            <div key={c.id} className="dashboard-card p-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-gold-300">{c.code}</p>
                <span
                  className={`inline-block mt-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    c.status === 'active'
                      ? 'border-moss-500/40 bg-moss-500/15 text-moss-500'
                      : 'border-ember-600/40 bg-ember-500/15 text-ember-500'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(c)}
                disabled={togglingId === c.id}
                className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1.5 text-xs text-parchment-300 hover:border-gold-600 transition-colors disabled:opacity-50"
              >
                {c.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
