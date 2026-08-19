'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

type Tone = 'gold' | 'cyan' | 'sky' | 'moss' | 'ember';

// A distinct tinted-gradient wash + colored border/glow per card, rotating
// through the palette (2 tones repeat once, same as the reference dashboard
// reusing its color set across more cards than it has colors) so no two
// adjacent cards look identical.
const TONE_CARD: Record<Tone, string> = {
  gold: 'border-gold-500/25 bg-gradient-to-br from-gold-500/[0.12] via-stone-900 to-stone-900 hover:border-gold-500/50 hover:shadow-[0_0_24px_-8px_rgba(240,180,41,0.45)]',
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

  const items: { id: string; title: string; body: string; href?: string; linkLabel?: string; tone: Tone; featured?: boolean; image?: string }[] = [
    {
      id: 'kingdoms',
      title: 'Why we use castle appointments',
      body: "King's Castle only has a handful of appointment slots, so a kingdom needs a fair way to decide who gets one. Players apply with proof of their account strength and available speedups; an admin reviews every application and assigns each slot to the player who's the best fit for that time, instead of it being first-come-first-served or decided by who shouts loudest. Any kingdom can run this same system for themselves too — a booking link to share with players and a private admin link for you, ready in seconds. Both are permanent: the booking link never expires, and the admin link only stops working if you deliberately generate a new one. No account or password needed — the admin link itself is your login, so keep it safe.",
      href: '/start',
      linkLabel: 'Set up your kingdom',
      tone: 'gold',
      featured: true,
    },
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
      image: '/research/growth/command-tactics.png',
    },
    {
      id: 'buildingplanner',
      title: 'Plan your Town Center upgrade path',
      body: "Pick your current Town Center level and the level you want to reach, and it works out everything that actually gates that path — Embassy, Academy, Barracks, Range, Stable, and Command Center included, with the exact resource costs and build times for each. No manual building-by-building lookups: it splits what's required for your target from what's optional, and adds up a running total including every Truegold and Tempered Truegold tier along the way.",
      href: '/building-planner',
      linkLabel: 'Plan your upgrade',
      tone: 'sky',
      image: '/buildings/town-center-kingshot.png',
    },
    {
      id: 'petcalculator',
      title: 'Plan a pet’s next levels',
      body: "Pick a pet, set your current and target level, and it adds up every Pet Food, Growth Manual, Nutrient Potion, and Promotion Medallion you'll need in between -- including the bigger costs paid at each advancement. Enter what you already have and it works out exactly what's still missing, plus the smartest way to spend your Custom Pet Advancement Chests to cover the gap. Add more than one pet to plan them together with one combined shopping list.",
      href: '/pet-calculator',
      linkLabel: 'Plan a pet upgrade',
      tone: 'gold',
      image: '/pets/grizzly-bear.webp',
    },
    {
      id: 'mastercalculator',
      title: 'Plan a Master’s Affinity, Skills, Talent, and Research',
      body: 'Pick a Master and set a current and target Affinity, and it works out the points and Master Emblems needed, the relationship status you’ll reach, and the stat gain — with the same idea carried through Skills, Talent, and Special Research. If a skill level you want needs higher Affinity than you’ve set, it tells you exactly how much and can add that to the plan automatically. Enter what you already own and one combined summary shows exactly what’s still missing.',
      href: '/master-calculator',
      linkLabel: 'Plan a Master upgrade',
      tone: 'cyan',
      image: '/masters/valora.webp',
    },
  ];

  return (
    <div>
      <h2 className="label-eyebrow mb-3">
        {t('home.goodToKnowTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-md border p-4 flex gap-3.5 transition-all ${
              item.featured ? 'card-featured sm:col-span-2' : TONE_CARD[item.tone]
            }`}
          >
            {item.image && (
              <div className="relative h-16 w-16 shrink-0 rounded-md border border-stone-700/60 bg-stone-950/50">
                <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
              </div>
            )}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
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
          </div>
        ))}
      </div>
    </div>
  );
}
