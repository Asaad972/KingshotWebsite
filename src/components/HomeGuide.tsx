'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

/** Collapsible "Good to Know" explainer on the home page -- covers things
 * that aren't obvious from the Explore grid's one-line subtitles alone,
 * especially Profiles (save/load named snapshots), which has no other
 * introduction anywhere in the app. */
export default function HomeGuide() {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);

  const items = [
    { id: 'calculators', title: t('home.faqCalculatorsTitle'), body: t('home.faqCalculatorsBody') },
    { id: 'profiles', title: t('home.faqProfilesTitle'), body: t('home.faqProfilesBody') },
    { id: 'quickset', title: t('home.faqQuickSetTitle'), body: t('home.faqQuickSetBody') },
    { id: 'booking', title: t('home.faqBookingTitle'), body: t('home.faqBookingBody') },
    { id: 'rally', title: t('home.faqRallyTitle'), body: t('home.faqRallyBody') },
    { id: 'giftcodes', title: t('home.faqGiftCodesTitle'), body: t('home.faqGiftCodesBody') },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
        {t('home.goodToKnowTitle')}
      </h2>
      <div className="dashboard-card divide-y divide-stone-700 overflow-hidden">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="focus-ring w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-800/60 transition-colors"
              >
                <span className="text-sm font-semibold text-parchment-100">{item.title}</span>
                <span className={`text-parchment-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
                  ▾
                </span>
              </button>
              {open && <p className="px-4 pb-3.5 text-sm text-parchment-300 leading-relaxed">{item.body}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
