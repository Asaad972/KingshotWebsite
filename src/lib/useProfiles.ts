'use client';

import { useEffect, useState } from 'react';

/** Named save slots backed by localStorage -- lets a calculator keep several
 * distinct saved setups (e.g. one per player) that you can switch between,
 * on top of (not instead of) the always-on auto-save from useLocalStorageState. */
export function useProfiles<T>(storageKey: string) {
  const [profiles, setProfiles] = useState<Record<string, T>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setProfiles(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = (next: Record<string, T>) => {
    setProfiles(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore quota/blocked storage
    }
  };

  const saveProfile = (name: string, data: T) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    persist({ ...profiles, [trimmed]: data });
  };

  const deleteProfile = (name: string) => {
    const next = { ...profiles };
    delete next[name];
    persist(next);
  };

  return { profiles, saveProfile, deleteProfile };
}
