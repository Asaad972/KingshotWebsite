'use client';

import { useEffect, useState } from 'react';

/** Blocks its children behind a single shared password, remembered in
 * localStorage per `storageKey` so it only has to be entered once per
 * browser -- same "blank shell until ready, then gate or content" shape as
 * LocaleGate, just keyed on a password instead of a locale choice. This is
 * a casual client-side lock (the password ships in the bundle), not real
 * auth -- good enough for keeping a page off casual visitors, not for
 * anything that needs to stay actually secret. */
export default function PasswordGate({
  password,
  storageKey,
  children,
}: {
  password: string;
  storageKey: string;
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey) === 'true') setUnlocked(true);
    } catch {
      // ignore blocked storage
    }
    setReady(true);
  }, [storageKey]);

  if (!ready) return <div className="min-h-screen bg-stone-950" />;
  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === password) {
      try {
        window.localStorage.setItem(storageKey, 'true');
      } catch {
        // ignore blocked storage
      }
      setUnlocked(true);
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 py-10">
      <div className="w-full max-w-sm mx-auto px-4">
        <p className="text-gold-400 tracking-widest text-xs font-semibold uppercase text-center mb-2">Private</p>
        <h1 className="font-display text-xl sm:text-2xl text-parchment-100 text-center mb-6">Enter the password to continue</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setWrong(false);
            }}
            autoFocus
            placeholder="Password"
            className="focus-ring rounded-md border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-gold-600"
          />
          {wrong && <p className="text-xs text-ember-500">Wrong password -- try again.</p>}
          <button
            type="submit"
            className="focus-ring rounded-md border border-gold-600 bg-gold-500/10 px-4 py-3 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500/20"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
