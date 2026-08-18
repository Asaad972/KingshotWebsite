'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function MobileNavigation() {
  const { t } = useI18n();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;
  // Nothing to "go back" to from the home page itself.
  if (pathname === '/') return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-700 bg-stone-950/95 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link href="/" className="focus-ring flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-parchment-300">
        <span aria-hidden>←</span>
        {t('common.home')}
      </Link>
    </nav>
  );
}
