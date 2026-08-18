'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "Good to Know" explainer on the home page -- covers things that aren't
 * obvious from the Explore grid's one-line subtitles alone, especially
 * Profiles (save/load named snapshots), which has no other introduction
 * anywhere in the app. Each card is a short explanation followed by a link
 * to the page it's about, for the ones that map to a single page -- Profiles
 * and Quick Set are behaviors inside the calculator pages rather than pages
 * of their own, so those two stay explanation-only. */
export default function HomeGuide() {
  const { t } = useI18n();

  const items = [
    {
      id: 'calculators',
      title: t('home.faqCalculatorsTitle'),
      body: t('home.faqCalculatorsBody'),
      href: '/gear-calculator',
      linkLabel: t('home.gearCalculatorNav'),
    },
    {
      id: 'profiles',
      title: t('home.faqProfilesTitle'),
      body: t('home.faqProfilesBody'),
    },
    {
      id: 'quickset',
      title: t('home.faqQuickSetTitle'),
      body: t('home.faqQuickSetBody'),
    },
    {
      id: 'booking',
      title: t('home.faqBookingTitle'),
      body: t('home.faqBookingBody'),
      href: '/book',
      linkLabel: t('home.bookButton'),
    },
    {
      id: 'rally',
      title: t('home.faqRallyTitle'),
      body: t('home.faqRallyBody'),
      href: '/rally-timer',
      linkLabel: t('home.rallyTimerNav'),
    },
    {
      id: 'giftcodes',
      title: t('home.faqGiftCodesTitle'),
      body: t('home.faqGiftCodesBody'),
      href: '/gift-codes',
      linkLabel: t('home.giftCodesNav'),
    },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
        {t('home.goodToKnowTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="dashboard-card p-4 flex flex-col gap-2">
            <p className="text-sm font-semibold text-parchment-100">{item.title}</p>
            <p className="text-xs text-parchment-400 leading-relaxed flex-1">{item.body}</p>
            {item.href && (
              <Link
                href={item.href}
                className="focus-ring inline-flex items-center gap-1 self-start text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors"
              >
                {item.linkLabel}
                <ArrowIcon />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
