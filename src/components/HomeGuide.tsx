'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

type Tone = 'gold' | 'cyan' | 'sky' | 'moss' | 'ember';

// A distinct tinted-gradient wash + colored border/glow per card, rotating
// through the palette (2 tones repeat once, same as the reference dashboard
// reusing its color set across more cards than it has colors) so no two
// adjacent cards look identical.
const TONE_CARD: Record<Tone, string> = {
  gold: 'border-gold-500/25 bg-gradient-to-br from-gold-500/[0.12] via-stone-900 to-stone-900 hover:border-gold-500/50 hover:shadow-[0_0_24px_-8px_rgba(236,72,153,0.45)]',
  cyan: 'border-cyan-500/25 bg-gradient-to-br from-cyan-500/[0.12] via-stone-900 to-stone-900 hover:border-cyan-500/50 hover:shadow-[0_0_24px_-8px_rgba(6,182,212,0.45)]',
  sky: 'border-sky-500/25 bg-gradient-to-br from-sky-500/[0.12] via-stone-900 to-stone-900 hover:border-sky-500/50 hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.45)]',
  moss: 'border-moss-500/25 bg-gradient-to-br from-moss-500/[0.12] via-stone-900 to-stone-900 hover:border-moss-500/50 hover:shadow-[0_0_24px_-8px_rgba(63,174,114,0.45)]',
  ember: 'border-ember-500/25 bg-gradient-to-br from-ember-500/[0.12] via-stone-900 to-stone-900 hover:border-ember-500/50 hover:shadow-[0_0_24px_-8px_rgba(226,80,63,0.45)]',
};

const TONE_LINK: Record<Tone, string> = {
  gold: 'text-gold-300 hover:text-gold-200',
  cyan: 'text-cyan-300 hover:text-cyan-200',
  sky: 'text-sky-400 hover:text-sky-300',
  moss: 'text-moss-500 hover:text-moss-600',
  ember: 'text-ember-500 hover:text-ember-600',
};

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
 * of their own, so those two stay explanation-only. Each card gets its own
 * tinted-gradient color (mirroring a reference dashboard's mixed-color
 * cards) instead of one flat neutral background. */
export default function HomeGuide() {
  const { t } = useI18n();

  const items: { id: string; title: string; body: string; href?: string; linkLabel?: string; tone: Tone }[] = [
    {
      id: 'calculators',
      title: t('home.faqCalculatorsTitle'),
      body: t('home.faqCalculatorsBody'),
      href: '/gear-calculator',
      linkLabel: t('home.gearCalculatorNav'),
      tone: 'gold',
    },
    {
      id: 'profiles',
      title: t('home.faqProfilesTitle'),
      body: t('home.faqProfilesBody'),
      tone: 'sky',
    },
    {
      id: 'quickset',
      title: t('home.faqQuickSetTitle'),
      body: t('home.faqQuickSetBody'),
      tone: 'moss',
    },
    {
      id: 'booking',
      title: t('home.faqBookingTitle'),
      body: t('home.faqBookingBody'),
      href: '/book',
      linkLabel: t('home.bookButton'),
      tone: 'cyan',
    },
    {
      id: 'rally',
      title: t('home.faqRallyTitle'),
      body: t('home.faqRallyBody'),
      href: '/rally-timer',
      linkLabel: t('home.rallyTimerNav'),
      tone: 'ember',
    },
    {
      id: 'giftcodes',
      title: t('home.faqGiftCodesTitle'),
      body: t('home.faqGiftCodesBody'),
      href: '/gift-codes',
      linkLabel: t('home.giftCodesNav'),
      tone: 'gold',
    },
    {
      id: 'researchtree',
      title: t('home.faqResearchTreeTitle'),
      body: t('home.faqResearchTreeBody'),
      href: '/research-tree',
      linkLabel: t('home.researchTreeNav'),
      tone: 'cyan',
    },
  ];

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-parchment-400 mb-3">
        {t('home.goodToKnowTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className={`rounded-md border p-4 flex flex-col gap-2 transition-all ${TONE_CARD[item.tone]}`}>
            <p className="text-sm font-semibold text-parchment-100">{item.title}</p>
            <p className="text-xs text-parchment-400 leading-relaxed flex-1">{item.body}</p>
            {item.href && (
              <Link
                href={item.href}
                className={`focus-ring inline-flex items-center gap-1 self-start text-xs font-semibold transition-colors ${TONE_LINK[item.tone]}`}
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
