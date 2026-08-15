'use client';

import { useEffect, useState } from 'react';

interface GiftCode {
  id: string;
  code: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface RedeemResult {
  code: string;
  status: string;
}

const SUCCESS_LIKE = new Set(['SUCCESS', 'RECEIVED', 'SAME_TYPE_EXCHANGE']);

function formatFoundDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function GiftCodesPage() {
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [fid, setFid] = useState('');
  const [kid, setKid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gift-codes')
      .then((r) => r.json())
      .then((data) => setCodes(data.codes ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/redeem/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: fid.trim(), kid: kid.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const message =
          data.reason === 'player_not_found'
            ? "Couldn't find that Player ID -- double-check it and try again."
            : data.reason === 'wrong_kingdom'
            ? "That Kingdom ID doesn't match this Player ID -- double-check your kingdom number."
            : data.reason === 'fid_and_kid_required'
            ? 'Enter both your Player ID and Kingdom ID.'
            : data.reason === 'fid_and_kid_must_be_numeric'
            ? 'Player ID and Kingdom ID should be numbers only.'
            : 'Something went wrong -- try again in a moment.';
        setFeedback({ kind: 'error', text: message });
        return;
      }

      const results: RedeemResult[] = data.results ?? [];
      const redeemed = results.filter((r) => r.status === 'SUCCESS').length;
      const already = results.filter((r) => r.status !== 'SUCCESS' && SUCCESS_LIKE.has(r.status)).length;

      setFeedback({
        kind: 'success',
        text:
          results.length === 0
            ? "Enrolled. No active codes right now -- you'll get the next one automatically."
            : `Enrolled. ${redeemed} code${redeemed === 1 ? '' : 's'} redeemed, ${already} already claimed.`,
      });
      setFid('');
      setKid('');
    } catch {
      setFeedback({ kind: 'error', text: 'Network error -- try again in a moment.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
    } catch {
      // Clipboard permission denied -- button just won't flip to "Copied".
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="text-lg font-semibold text-parchment-100 mb-1">Gift Codes</h1>
      <p className="text-sm text-parchment-400 mb-4">
        Add your Player ID once and every active code gets redeemed for you automatically -- new codes too, as soon
        as they're added.
      </p>

      <form onSubmit={handleEnroll} className="dashboard-card p-4 flex flex-col gap-3 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment-400">Player ID</span>
            <input
              type="text"
              inputMode="numeric"
              value={fid}
              onChange={(e) => setFid(e.target.value)}
              placeholder="e.g. 12345678"
              className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment-400">Kingdom ID</span>
            <input
              type="text"
              inputMode="numeric"
              value={kid}
              onChange={(e) => setKid(e.target.value)}
              placeholder="e.g. 1781"
              className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={submitting || !fid.trim() || !kid.trim()}
          className="focus-ring rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add to Auto-Redeem'}
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
            <div
              key={c.id}
              className={`dashboard-card p-3 flex items-center justify-between gap-3 ${
                c.status === 'inactive' ? 'border-ember-600/30' : ''
              }`}
            >
              <div>
                <p className="font-mono text-sm font-semibold text-gold-300">{c.code}</p>
                <div className="flex items-center gap-2 mt-1">
                  {c.status === 'active' && (
                    <span className="inline-block rounded border border-moss-500/40 bg-moss-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-moss-500 shadow-[0_0_8px_-2px_rgba(63,174,114,0.5)]">
                      Active
                    </span>
                  )}
                  <span className="text-xs text-parchment-500">Found {formatFoundDate(c.created_at)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(c.code)}
                className="focus-ring shrink-0 rounded border border-stone-700 px-2.5 py-1.5 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
              >
                {copiedCode === c.code ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
