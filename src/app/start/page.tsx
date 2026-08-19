'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
}

interface CreatedKingdom {
  slug: string;
  name: string;
  admin_token: string;
}

export default function StartKingdomPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedKingdom | null>(null);
  const [copiedBook, setCopiedBook] = useState(false);
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [savedConfirmed, setSavedConfirmed] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setAvailable(null);
      return;
    }
    setChecking(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/kingdoms/check?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setAvailable(Boolean(data.available));
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [slug]);

  const slugValid = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/.test(slug);
  const canSubmit = name.trim().length > 0 && slugValid && available === true && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/kingdoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug }),
      });
      const data = await res.json();
      if (data.success) {
        setCreated({ slug: data.slug, name: data.name, admin_token: data.admin_token });
      } else if (data.reason === 'slug_taken') {
        setError('That link is already taken — try a different one.');
        setAvailable(false);
      } else if (data.reason === 'invalid_slug') {
        setError('That link has to be lowercase letters, numbers, and hyphens only (3-30 characters).');
      } else {
        setError('Something went wrong — try again in a moment.');
      }
    } catch {
      setError('Something went wrong — try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const bookLink = `${origin}/k/${created.slug}/book`;
    const adminLink = `${origin}/k/${created.slug}/admin/${created.admin_token}`;

    const copy = async (text: string, which: 'book' | 'admin') => {
      try {
        await navigator.clipboard.writeText(text);
        if (which === 'book') {
          setCopiedBook(true);
          setTimeout(() => setCopiedBook(false), 2000);
        } else {
          setCopiedAdmin(true);
          setTimeout(() => setCopiedAdmin(false), 2000);
        }
      } catch {
        // Clipboard permission denied or unavailable -- the link is still shown for manual copy.
      }
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold text-gold-300 mb-1">{created.name} is set up!</h1>
        <p className="text-sm text-parchment-400 mb-6">Save both links below before you leave this page.</p>

        <div className="rounded border-2 border-ember-600/60 bg-ember-500/10 p-4 mb-5">
          <p className="text-sm font-semibold text-ember-500 mb-1">⚠ The admin link will not be shown again</p>
          <p className="text-xs text-parchment-300 leading-relaxed">
            Visiting the admin link <em>is</em> your login — there's no password to reset. If you lose it with no
            saved cookie on any device, there is no self-serve way back in. Save it somewhere safe (bookmark it, or
            paste it into a note) right now.
          </p>
        </div>

        <div className="dashboard-card p-4 mb-4">
          <p className="text-xs text-parchment-400 mb-1.5">Booking link — share with your players</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 min-w-0 truncate rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100">
              {bookLink}
            </code>
            <button
              onClick={() => copy(bookLink, 'book')}
              className="focus-ring shrink-0 rounded-md border border-stone-700 px-3 py-2 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
            >
              {copiedBook ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="dashboard-card p-4 mb-6 border-ember-600/50">
          <p className="text-xs text-ember-500 mb-1.5 font-semibold">Admin link — keep this private, save it now</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 min-w-0 truncate rounded border border-ember-700/50 bg-stone-950 px-3 py-2 text-sm text-parchment-100">
              {adminLink}
            </code>
            <button
              onClick={() => copy(adminLink, 'admin')}
              className="focus-ring shrink-0 rounded-md bg-ember-600 px-3 py-2 text-xs font-semibold text-stone-950 hover:bg-ember-500 transition-colors"
            >
              {copiedAdmin ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 mb-5 text-sm text-parchment-300">
          <input
            type="checkbox"
            checked={savedConfirmed}
            onChange={(e) => setSavedConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-gold-500"
          />
          I've saved the admin link somewhere safe.
        </label>

        <Link
          href={adminLink.replace(origin, '')}
          className={`focus-ring block w-full text-center rounded-md py-2.5 text-sm font-semibold transition-colors ${
            savedConfirmed
              ? 'bg-gold-500 text-stone-950 hover:bg-gold-400'
              : 'bg-stone-800 text-parchment-500 pointer-events-none'
          }`}
        >
          Continue to admin dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold text-parchment-100 mb-1">Set up your kingdom</h1>
      <p className="text-sm text-parchment-400 mb-6">
        Get your own castle-appointment booking page in a few seconds — a link to share with your players, and a
        private admin link for you.
      </p>

      <form onSubmit={handleSubmit} className="dashboard-card p-5 flex flex-col gap-4">
        <label className="block">
          <span className="text-sm text-parchment-300 mb-1 block">Kingdom name</span>
          <input
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. K1781 Nerds HQ"
            className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
          />
        </label>

        <label className="block">
          <span className="text-sm text-parchment-300 mb-1 block">Booking link</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-parchment-500 whitespace-nowrap">.../k/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="your-kingdom"
              className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
            />
          </div>
          <p className="text-xs mt-1.5">
            {slug.length > 0 && slug.length < 3 && <span className="text-parchment-500">At least 3 characters.</span>}
            {slug.length >= 3 && checking && <span className="text-parchment-500">Checking availability…</span>}
            {slug.length >= 3 && !checking && available === true && (
              <span className="text-moss-500">✓ Available</span>
            )}
            {slug.length >= 3 && !checking && available === false && (
              <span className="text-ember-500">Already taken — try another.</span>
            )}
          </p>
        </label>

        {error && <p className="text-sm text-ember-500">{error}</p>}

        <p className="text-xs text-parchment-500 leading-relaxed">
          Your admin link doubles as your login — there's no separate password. You'll get one chance to save it
          right after this.
        </p>

        <button
          type="submit"
          disabled={!canSubmit}
          className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Setting up…' : 'Create my kingdom'}
        </button>
      </form>
    </div>
  );
}
