'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import Tutorial from '@/components/Tutorial';
import QuickLinksGrid from '@/components/QuickLinksGrid';

export default function HomePage() {
  const { t } = useI18n();
  const [showTutorialAgain, setShowTutorialAgain] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Tutorial forceOpen={showTutorialAgain} onClose={() => setShowTutorialAgain(false)} />

      <div className="text-center">
        <p className="text-gold-400 tracking-widest text-xs font-semibold uppercase mb-2">Kingdom #1781</p>
        <h1 className="font-display text-gradient text-3xl sm:text-4xl font-bold leading-tight">{t('home.title')}</h1>
        <p className="mt-2 text-parchment-300 text-sm">{t('home.tagline')}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <UTCClock />
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          href="/book"
          className="btn-gradient focus-ring w-full sm:w-auto text-center rounded-md px-6 py-2.5 text-sm shadow-[0_0_20px_-4px_rgba(236,72,153,0.5)]"
        >
          {t('home.bookButton')}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/schedule" className="text-parchment-300 hover:text-gold-300 transition-colors focus-ring rounded-md">
            {t('home.viewSchedule')}
          </Link>
          <span className="text-stone-600">•</span>
          <button
            onClick={() => setShowTutorialAgain(true)}
            className="text-parchment-300 hover:text-gold-300 transition-colors focus-ring rounded-md"
          >
            {t('home.viewTutorialAgain')}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">{t('home.exploreTitle')}</h2>
        <QuickLinksGrid
          bookTitle={t('home.bookButton')}
          bookSubtitle={t('home.quickLinkBookSubtitle')}
          scheduleTitle={t('home.viewSchedule')}
          scheduleSubtitle={t('home.quickLinkScheduleSubtitle')}
          rallyTimerTitle={t('home.rallyTimerNav')}
          rallyTimerSubtitle={t('home.quickLinkRallyTimerSubtitle')}
          giftCodesTitle={t('home.giftCodesNav')}
          giftCodesSubtitle={t('home.quickLinkGiftCodesSubtitle')}
        />
      </div>
    </div>
  );
}
