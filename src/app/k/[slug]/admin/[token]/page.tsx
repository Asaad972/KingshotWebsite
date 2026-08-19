'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Visiting this URL IS the login: it hands the token to the server once to
// set a cookie, then redirects to the clean dashboard URL so the raw token
// doesn't linger in the address bar / browser history after the first visit.
export default function KingdomAdminTokenPage({ params }: { params: { slug: string; token: string } }) {
  const { slug, token } = params;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redeem = async () => {
      try {
        const res = await fetch(`/api/k/${slug}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (data.success) {
          router.replace(`/k/${slug}/admin/dashboard`);
          return;
        }
        setError(
          data.reason === 'kingdom_not_found'
            ? "This kingdom doesn't exist."
            : "This admin link isn't valid — double-check you copied it in full."
        );
      } catch {
        setError('Something went wrong — try again in a moment.');
      }
    };
    redeem();
  }, [slug, token, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {error ? (
        <>
          <h1 className="text-lg font-semibold text-ember-500 mb-2">Access denied</h1>
          <p className="text-sm text-parchment-300">{error}</p>
        </>
      ) : (
        <p className="text-parchment-400">Signing you in…</p>
      )}
    </div>
  );
}
