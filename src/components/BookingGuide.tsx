'use client';

import { useI18n } from '@/lib/i18n';
import ExampleScreenshot from './ExampleScreenshot';

/** "How it works" steps + example screenshots -- shown on the booking page
 * itself (right before the slot grid) rather than on the home page, so the
 * instructions are visible exactly when someone needs them. */
export default function BookingGuide() {
  const { t } = useI18n();

  const steps = [
    { title: t('tutorial.cardMainTitle'), body: t('tutorial.step1Body') },
    { title: t('tutorial.cardResourcesTitle'), body: t('tutorial.step2Body') },
    { title: t('tutorial.step3Title'), body: t('tutorial.step3Body') },
    { title: t('home.step4Title'), body: t('home.step4Body') },
  ];

  return (
    <div className="flex flex-col gap-6 mb-6">
      <div>
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

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
          {t('home.screenshotGuideTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="dashboard-card p-3 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-parchment-100">{t('booking.uploadMainTitle')}</h3>
            <p className="text-xs text-parchment-400 leading-relaxed">{t('home.mainAccountGuideBody')}</p>
            <div className="w-32 mx-auto sm:mx-0">
              <ExampleScreenshot src="/tutorial/main-account.png" alt={t('booking.uploadMainTitle')} />
            </div>
          </div>
          <div className="dashboard-card p-3 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-parchment-100">{t('booking.uploadResourcesTitle')}</h3>
            <p className="text-xs text-parchment-400 leading-relaxed">{t('home.speedupsGuideBody')}</p>
            <div className="w-32 mx-auto sm:mx-0">
              <ExampleScreenshot src="/tutorial/speedups.png" alt={t('booking.uploadResourcesTitle')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
