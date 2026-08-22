'use client';

import { useEffect, useState } from 'react';
import AllianceProfileCard from './AllianceProfileCard';
import GovernorProfileModal from './GovernorProfileModal';
import type { AllianceProfile } from '@/lib/kingshotStatsApi';

type Status = 'loading' | 'error' | 'ready';

/** Opened by clicking an alliance tag anywhere (leaderboard rows, map
 * search) -- fetches that one alliance's roster and shows it as a popup.
 * Owns its own nested GovernorProfileModal so a parent only ever has to
 * manage one piece of state (`aid`) to get both profile types working. */
export default function AllianceProfileModal({ aid, onClose }: { aid: number | null; onClose: () => void }) {
  const [alliance, setAlliance] = useState<AllianceProfile | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [selectedUid, setSelectedUid] = useState<number | null>(null);

  useEffect(() => {
    if (aid == null) return;
    setAlliance(null);
    setStatus('loading');
    fetch(`/api/alliance-profile?aid=${aid}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setStatus('error');
          return;
        }
        setAlliance(data.alliance);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [aid]);

  if (aid == null) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/70" aria-hidden />
        <div
          className="relative w-full max-w-2xl dashboard-card p-4 my-8 sm:my-0"
          onClick={(e) => e.stopPropagation()}
        >
          {status === 'loading' && <p className="text-sm text-parchment-500 py-8 text-center">Loading alliance…</p>}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-ember-500">Couldn't load that alliance -- try again in a moment.</p>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-gold-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
          {status === 'ready' && alliance && (
            <AllianceProfileCard alliance={alliance} onClose={onClose} onSelectMember={setSelectedUid} />
          )}
        </div>
      </div>
      <GovernorProfileModal uid={selectedUid} onClose={() => setSelectedUid(null)} />
    </>
  );
}
