'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import UTCClock from './UTCClock';
import type { Locale } from '@/types';

const LANG_LABELS: Record<Locale, string> = { en: 'EN', ar: 'AR', tr: 'TR' };

export default function SiteHeader() {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!locale) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-700 bg-stone-950/95">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md shrink-0">
          <span className="font-display text-gold-300 text-xs sm:text-base tracking-wide whitespace-nowrap">K1781 By King Hero</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-4 text-sm text-parchment-300 whitespace-nowrap">
          <Link href="/" className="hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('common.home')}
          </Link>
          <Link href="/book" className="hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('home.bookButton')}
          </Link>
          <Link href="/schedule" className="hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('home.viewSchedule')}
          </Link>
          <Link href="/rally-timer" className="hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('home.rallyTimerNav')}
          </Link>
          <Link href="/gift-codes" className="hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('home.giftCodesNav')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:block">
            <UTCClock variant="compact" />
          </div>
          <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex items-center gap-1.5 rounded border border-stone-700 bg-stone-900 px-2.5 py-1 text-sm text-parchment-200 hover:border-gold-600 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span>{LANG_LABELS[locale]}</span>
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute end-0 mt-1 w-28 overflow-hidden rounded border border-stone-700 bg-stone-900"
            >
              {(Object.keys(LANG_LABELS) as Locale[]).map((code) => (
                <li key={code}>
                  <button
                    onClick={() => {
                      setLocale(code);
                      setOpen(false);
                    }}
                    className={`w-full text-start px-3 py-2 text-sm hover:bg-stone-800 flex items-center gap-2 ${
                      code === locale ? 'text-gold-300' : 'text-parchment-200'
                    }`}
                  >
                    {LANG_LABELS[code]}
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
