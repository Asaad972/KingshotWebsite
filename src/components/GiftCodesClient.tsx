'use client';

import { useState } from 'react';

interface GiftCode {
  id: string;
  code: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface ProgressRow {
  codeId: string;
  code: string;
  status: 'pending' | 'redeeming' | string;
}

const SUCCESS_LIKE = new Set(['SUCCESS', 'RECEIVED', 'SAME_TYPE_EXCHANGE']);

const STATUS_LABEL: Record<string, string> = {
  SUCCESS: 'Redeemed!',
  RECEIVED: 'Already claimed',
  SAME_TYPE_EXCHANGE: 'Already claimed',
  TIME_ERROR: 'Code expired',
  CDK_NOT_FOUND: 'Code invalid',
  USAGE_LIMIT: 'Code limit reached',
};

function formatFoundDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** Small pause between redeem calls, mirroring the server's own pacing --
 * still rate-limit-safe, just visible to the user as live progress now
 * instead of one long silent wait. */
function jitteredDelay(): Promise<void> {
  const ms = 700 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function GiftCodesClient({
  initialCodes,
  initialStats,
}: {
  initialCodes: GiftCode[];
  initialStats: { enrolledPlayers: number; codesRedeemed: number };
}) {
  const [codes, setCodes] = useState<GiftCode[]>(initialCodes);
  const [stats, setStats] = useState(initialStats);
  const [fid, setFid] = useState('');
  const [kid, setKid] = useState('');
  const [phase, setPhase] = useState<'idle' | 'verifying' | 'redeeming' | 'done'>('idle');
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const submitting = phase === 'verifying' || phase === 'redeeming';

  const loadCodes = () => {
    return fetch('/api/gift-codes')
      .then((r) => r.json())
      .then((data) => {
        setCodes(data.codes ?? []);
        if (data.stats) setStats(data.stats);
      });
  };

  const doneCount = progress.filter((r) => r.status !== 'pending' && r.status !== 'redeeming').length;
  const currentlyRedeeming = progress.find((r) => r.status === 'redeeming');
  const progressPercent =
    progress.length > 0 ? Math.min(100, ((doneCount + (currentlyRedeeming ? 0.5 : 0)) / progress.length) * 100) : 0;
  const progressLabel = currentlyRedeeming
    ? `Redeeming ${currentlyRedeeming.code}… (${doneCount + 1}/${progress.length})`
    : phase === 'done' && progress.length > 0
    ? `${doneCount}/${progress.length} codes checked`
    : `${doneCount}/${progress.length}`;

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setProgress([]);
    setPhase('verifying');
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
        const attempts: string[] = data.attempts ?? [];
        const detail = attempts.length > 0 ? ` (server saw: ${attempts.join(', ')})` : '';
        setFeedback({ kind: 'error', text: message + detail });
        setPhase('idle');
        return;
      }

      const activeCodes: { id: string; code: string }[] = data.activeCodes ?? [];
      setFeedback({ kind: 'success', text: '✓ Enrolled! Redeeming your codes…' });
      setFid('');
      setKid('');

      if (activeCodes.length === 0) {
        setFeedback({
          kind: 'success',
          text: "✓ Enrolled. No active codes right now -- you'll get the next one automatically.",
        });
        setPhase('done');
        loadCodes();
        return;
      }

      setPhase('redeeming');
      setProgress(activeCodes.map((c) => ({ codeId: c.id, code: c.code, status: 'pending' })));

      const finalRows: ProgressRow[] = [];
      for (let i = 0; i < activeCodes.length; i++) {
        const c = activeCodes[i];
        setProgress((prev) => prev.map((r) => (r.codeId === c.id ? { ...r, status: 'redeeming' } : r)));

        try {
          const redeemRes = await fetch('/api/redeem/redeem-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentId: data.enrollmentId, fid: data.fid, kid: data.kid, codeId: c.id, code: c.code }),
          });
          const redeemData = await redeemRes.json();
          const status = redeemData.status ?? 'UNKNOWN_API_RESPONSE';
          setProgress((prev) => prev.map((r) => (r.codeId === c.id ? { ...r, status } : r)));
          finalRows.push({ ...c, codeId: c.id, status });
        } catch {
          setProgress((prev) => prev.map((r) => (r.codeId === c.id ? { ...r, status: 'UNKNOWN_API_RESPONSE' } : r)));
          finalRows.push({ codeId: c.id, code: c.code, status: 'UNKNOWN_API_RESPONSE' });
        }

        if (i < activeCodes.length - 1) await jitteredDelay();
      }

      const redeemed = finalRows.filter((r) => r.status === 'SUCCESS').length;
      const already = finalRows.filter((r) => r.status !== 'SUCCESS' && SUCCESS_LIKE.has(r.status)).length;
      setFeedback({
        kind: 'success',
        text: `✓ Enrolled. ${redeemed} code${redeemed === 1 ? '' : 's'} redeemed, ${already} already claimed.`,
      });
      setPhase('done');
      loadCodes();
    } catch {
      setFeedback({ kind: 'error', text: 'Network error -- try again in a moment.' });
      setPhase('idle');
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
      <div className="rounded-md overflow-hidden border border-stone-700 mb-4">
        <div className="bg-gradient-primary px-4 py-4">
          <h1 className="text-lg font-bold text-white">Active Gift Codes</h1>
          <p className="text-sm text-white/90 mt-1">
            Add your Player ID once and every active code gets redeemed for you automatically -- new codes too, as
            soon as they're added.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="dashboard-card p-3 text-center">
          <p className="text-2xl font-bold text-gradient">{stats.enrolledPlayers.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wide text-parchment-400 mt-0.5">Auto-Redeeming</p>
        </div>
        <div className="dashboard-card p-3 text-center">
          <p className="text-2xl font-bold text-gradient">{stats.codesRedeemed.toLocaleString()}</p>
          <p className="text-[10px] uppercase tracking-wide text-parchment-400 mt-0.5">Codes Redeemed</p>
        </div>
      </div>

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
          className="btn-gradient focus-ring rounded-md py-2.5 text-sm disabled:opacity-50"
        >
          {phase === 'verifying' ? 'Verifying Player ID…' : phase === 'redeeming' ? 'Redeeming…' : 'Add to Auto-Redeem'}
        </button>

        {(phase === 'redeeming' || (phase === 'done' && progress.length > 0)) && (
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-parchment-400 text-center">{progressLabel}</p>
          </div>
        )}

        {feedback && (
          <p className={`text-xs ${feedback.kind === 'success' ? 'text-moss-500' : 'text-ember-500'}`}>
            {feedback.text}
          </p>
        )}

        {phase === 'done' && progress.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {progress.map((row) => {
              const isSuccessLike = SUCCESS_LIKE.has(row.status);
              return (
                <div
                  key={row.codeId}
                  className="flex items-center justify-between gap-2 rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5"
                >
                  <span className="font-mono text-xs text-parchment-200">{row.code}</span>
                  <span className={`text-xs font-medium shrink-0 ${isSuccessLike ? 'text-moss-500' : 'text-ember-500'}`}>
                    {STATUS_LABEL[row.status] ?? row.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </form>

      {codes.length === 0 ? (
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
