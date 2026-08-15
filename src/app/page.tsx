'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import UTCClock from '@/components/UTCClock';
import Tutorial from '@/components/Tutorial';
import ExampleScreenshot from '@/components/ExampleScreenshot';

export default function HomePage() {
  const { t } = useI18n();
  const [showTutorialAgain, setShowTutorialAgain] = useState(false);

  const steps = [
    { title: t('tutorial.cardMainTitle'), body: t('tutorial.step1Body') },
    { title: t('tutorial.cardResourcesTitle'), body: t('tutorial.step2Body') },
    { title: t('tutorial.step3Title'), body: t('tutorial.step3Body') },
    { title: t('home.step4Title'), body: t('home.step4Body') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Tutorial forceOpen={showTutorialAgain} onClose={() => setShowTutorialAgain(false)} />

      <div className="text-center">
        <p className="text-gold-400 tracking-widest text-xs font-semibold uppercase mb-2">KingShot</p>
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
        <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
          {t('home.howItWorksTitle')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {steps.map((step, i) => (
            <div key={step.title} className="dashboard-card p-3 flex flex-col gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-stone-800 text-[11px] font-semibold text-gold-300">
                {i + 1}
              </span>
              <h3 className="text-sm font-semibold text-parchment-100 leading-snug">{step.title}</h3>
              <p className="text-xs text-parchment-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
          {t('home.screenshotGuideTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="dashboard-card p-3 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-parchment-100">{t('booking.uploadMainTitle')}</h3>
            <p className="text-xs text-parchment-400 leading-relaxed">{t('home.mainAccountGuideBody')}</p>
            <ExampleScreenshot src="/tutorial/main-account.png" alt={t('booking.uploadMainTitle')} />
          </div>
          <div className="dashboard-card p-3 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-parchment-100">{t('booking.uploadResourcesTitle')}</h3>
            <p className="text-xs text-parchment-400 leading-relaxed">{t('home.speedupsGuideBody')}</p>
            <ExampleScreenshot src="/tutorial/speedups.png" alt={t('booking.uploadResourcesTitle')} />
          </div>
        </div>
      </div>
    </div>
  );
}
