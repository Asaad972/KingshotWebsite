import Link from 'next/link';
import { getKingdomAdminTokenFromCookies } from '@/lib/kingdomAuth';
import KingdomAdminSidebar from '@/components/KingdomAdminSidebar';

export default function ProtectedKingdomAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const token = getKingdomAdminTokenFromCookies(params.slug);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-parchment-100 mb-2">Admin link required</h1>
        <p className="text-sm text-parchment-300 mb-6">
          There's no login form here — visit your saved admin link (the one shown once when the kingdom was
          created) to get in.
        </p>
        <Link
          href={`/k/${params.slug}/book`}
          className="focus-ring inline-block rounded-md border border-stone-700 px-5 py-2 text-sm text-parchment-100 hover:border-gold-600 transition-colors"
        >
          Go to booking page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-6">
      <KingdomAdminSidebar slug={params.slug} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
