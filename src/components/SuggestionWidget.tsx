'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const MAX_LENGTH = 2000;

/** Small floating "Suggestion?" button in the corner, on every page -- opens
 * a tiny form that posts to /api/suggestions. No login, no identity
 * collected beyond the current page path (for context). Hidden on /admin
 * since that's where the site owner already is, not where they'd send
 * themselves a suggestion. */
export default function SuggestionWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (pathname?.startsWith('/admin')) return null;

  const reset = () => {
    setOpen(false);
    setMessage('');
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), page: pathname }),
      });
      const data = await res.json();
      setStatus(data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-4 end-4 z-50">
      {open && (
        <div className="mb-2 w-72 dashboard-card p-3.5 shadow-lg">
          {status === 'sent' ? (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <p className="text-sm font-semibold text-moss-500">Thanks for the suggestion!</p>
              <button
                type="button"
                onClick={reset}
                className="focus-ring text-xs text-parchment-400 hover:text-parchment-200 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-parchment-100">Got a suggestion?</p>
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Close"
                  className="focus-ring rounded text-parchment-500 hover:text-ember-500 transition-colors"
                >
                  ✕
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="What should we add or fix?"
                rows={4}
                autoFocus
                className="focus-ring w-full resize-none rounded border border-stone-700 bg-stone-950 px-2.5 py-2 text-sm text-parchment-100 placeholder:text-parchment-500 focus:border-gold-600"
              />
              {status === 'error' && <p className="text-xs text-ember-500">Something went wrong -- try again.</p>}
              <button
                type="submit"
                disabled={!message.trim() || status === 'sending'}
                className="focus-ring w-full rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring flex items-center gap-1.5 rounded-full border border-gold-600/50 bg-stone-900 px-3.5 py-2.5 text-xs font-semibold text-gold-300 shadow-lg hover:border-gold-500 hover:bg-stone-800 transition-colors icon-glow-gold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path
              d="M12 3C7 3 3 6.6 3 11c0 2.4 1.2 4.5 3.1 5.9L5.5 20l3.8-1.5c.9.3 1.8.4 2.7.4 5 0 9-3.6 9-8S17 3 12 3Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Suggestion?
        </button>
      )}
    </div>
  );
}
