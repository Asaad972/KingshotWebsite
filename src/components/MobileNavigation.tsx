'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function MobileNavigation() {
  const { t } = useI18n();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const links = [
    { href: '/', label: t('common.home') },
    { href: '/book', label: t('home.bookButton') },
    { href: '/schedule', label: t('home.viewSchedule') },
    { href: '/rally-timer', label: t('home.rallyTimerNav') },
    { href: '/gift-codes', label: t('home.giftCodesNav') },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-700 bg-stone-950/95 sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`focus-ring flex items-center justify-center py-3 text-sm font-medium transition-colors ${
                active ? 'text-gold-300' : 'text-parchment-400'
              }`}
            >
              <span className="truncate max-w-[6rem]">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
