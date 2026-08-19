'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import QuickLinksGrid from '@/components/QuickLinksGrid';
import HomeGuide from '@/components/HomeGuide';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
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
          gearCalculatorTitle={t('home.gearCalculatorNav')}
          gearCalculatorSubtitle={t('home.quickLinkGearCalculatorSubtitle')}
          charmCalculatorTitle={t('home.charmCalculatorNav')}
          charmCalculatorSubtitle={t('home.quickLinkCharmCalculatorSubtitle')}
          heroGearCalculatorTitle={t('home.heroGearCalculatorNav')}
          heroGearCalculatorSubtitle={t('home.quickLinkHeroGearCalculatorSubtitle')}
          troopCalculatorTitle={t('home.troopCalculatorNav')}
          troopCalculatorSubtitle={t('home.quickLinkTroopCalculatorSubtitle')}
          researchTreeTitle={t('home.researchTreeNav')}
          researchTreeSubtitle={t('home.quickLinkResearchTreeSubtitle')}
        />
      </div>

      <div className="mt-8">
        <HomeGuide />
      </div>

      <div className="mt-8 dashboard-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-parchment-100">Run this for your own kingdom</p>
          <p className="text-xs text-parchment-400 mt-0.5">
            Get your own booking link and admin link in a few seconds — no setup on our end.
          </p>
        </div>
        <Link
          href="/start"
          className="focus-ring shrink-0 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
        >
          Set up your kingdom
        </Link>
      </div>
    </div>
  );
}
