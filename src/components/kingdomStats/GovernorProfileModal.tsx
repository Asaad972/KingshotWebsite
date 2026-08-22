'use client';

import { useEffect, useState } from 'react';
import GovernorProfileCard from './GovernorProfileCard';
import type { PlayerProfile } from '@/lib/kingshotStatsApi';

type Status = 'loading' | 'error' | 'ready';

function loadProfile(uid: number): Promise<PlayerProfile | null> {
  return fetch(`/api/player-profile?uid=${uid}`)
    .then((res) => res.json())
    .then((data) => (data.success ? (data.profile as PlayerProfile) : null));
}

/** Opened by clicking a governor's name anywhere on a kingdom leaderboard
 * -- fetches that one profile and shows it as a popup. Closed = uid is
 * null, so the parent just needs one piece of state to drive this. */
export default function GovernorProfileModal({ uid, onClose }: { uid: number | null; onClose: () => void }) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (uid == null) return;
    setProfile(null);
    setStatus('loading');
    loadProfile(uid)
      .then((p) => {
        if (!p) {
          setStatus('error');
          return;
        }
        setProfile(p);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [uid]);

  const handleRefresh = async () => {
    if (uid == null || refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch(`/api/player-profile/refresh?uid=${uid}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) setProfile(data.profile);
    } finally {
      setRefreshing(false);
    }
  };

  if (uid == null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div
        className="relative w-full max-w-2xl dashboard-card p-4 my-8 sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'loading' && <p className="text-sm text-parchment-500 py-8 text-center">Loading profile…</p>}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-ember-500">Couldn't load that governor's profile -- try again in a moment.</p>
            <button
              type="button"
              onClick={onClose}
              className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
            >
              Close
            </button>
          </div>
        )}
        {status === 'ready' && profile && (
          <GovernorProfileCard
            profile={profile}
            onClose={onClose}
            closeLabel="✕"
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
      </div>
    </div>
  );
}
