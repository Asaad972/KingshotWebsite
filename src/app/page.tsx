'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import Tutorial from '@/components/Tutorial';
import QuickLinksGrid from '@/components/QuickLinksGrid';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Tutorial />

      <div className="text-center">
        <h1 className="font-display text-gradient text-3xl sm:text-4xl font-bold leading-tight">
          {t('home.welcomeTitle')}
        </h1>
        <p className="mt-3 text-parchment-300 text-sm max-w-lg mx-auto leading-relaxed">{t('home.welcomeBody')}</p>
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

      {/* --- Experimental: Governor Gear Calculator ---------------------
          Isolated addition -- delete this block to remove the link without
          touching QuickLinksGrid or anything else on this page. */}
      <div className="mt-4 text-center">
        <Link
          href="/gear-calculator"
          className="focus-ring inline-flex items-center gap-1.5 text-xs text-parchment-500 hover:text-gold-300 transition-colors rounded-md"
        >
          Trying out: Governor Gear Calculator (Beta)
        </Link>
      </div>
      {/* --- end experimental block --- */}
    </div>
  );
}
