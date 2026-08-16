'use client';

import { useEffect, useState } from 'react';

/** Like useState, but auto-persists to localStorage and restores on mount --
 * so refreshing the page doesn't reset a calculator back to empty. Restore
 * happens in an effect (not lazy useState init) to avoid SSR/client HTML
 * mismatches, so there's a one-tick flash of `initial` on first paint. */
export function useLocalStorageState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota/blocked storage
    }
  }, [key, state, hydrated]);

  return [state, setState];
}
