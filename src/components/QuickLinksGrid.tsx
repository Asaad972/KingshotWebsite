'use client';

import Link from 'next/link';

type Tone = 'gold' | 'cyan';

const TONE_CLASSES: Record<Tone, string> = {
  gold: 'bg-gold-500/15 border-gold-500/30 text-gold-400 icon-glow-gold',
  cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 icon-glow-cyan',
};

const TONE_CARD_HOVER: Record<Tone, string> = {
  gold: 'hover:border-gold-500/60 hover:shadow-[0_0_28px_-8px_rgba(240,180,41,0.55)]',
  cyan: 'hover:border-cyan-500/60 hover:shadow-[0_0_28px_-8px_rgba(6,182,212,0.55)]',
};

interface QuickLink {
  href: string;
  title: string;
  subtitle: string;
  tone: Tone;
  icon: React.ReactNode;
}

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75 } as const;

function CalendarIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <rect x="3" y="5" width="18" height="16" rx="2" strokeLinejoin="round" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M6 4 20 18M8.5 4 6 6.5 4 4.5 5.5 3 8.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 4 4 18M15.5 4 18 6.5 20 4.5 18.5 3 15.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18v2h2M18 18v2h-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v3M9 20h6M9.5 20c0-1.7.7-2.6 2.5-3 1.8.4 2.5 1.3 2.5 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function QuickLinksGrid({
  bookTitle,
  bookSubtitle,
  scheduleTitle,
  scheduleSubtitle,
  rallyTimerTitle,
  rallyTimerSubtitle,
  giftCodesTitle,
  giftCodesSubtitle,
  gearCalculatorTitle,
  gearCalculatorSubtitle,
  charmCalculatorTitle,
  charmCalculatorSubtitle,
  heroGearCalculatorTitle,
  heroGearCalculatorSubtitle,
  troopCalculatorTitle,
  troopCalculatorSubtitle,
  researchTreeTitle,
  researchTreeSubtitle,
}: {
  bookTitle: string;
  bookSubtitle: string;
  scheduleTitle: string;
  scheduleSubtitle: string;
  rallyTimerTitle: string;
  rallyTimerSubtitle: string;
  giftCodesTitle: string;
  giftCodesSubtitle: string;
  gearCalculatorTitle: string;
  gearCalculatorSubtitle: string;
  charmCalculatorTitle: string;
  charmCalculatorSubtitle: string;
  heroGearCalculatorTitle: string;
  heroGearCalculatorSubtitle: string;
  troopCalculatorTitle: string;
  troopCalculatorSubtitle: string;
  researchTreeTitle: string;
  researchTreeSubtitle: string;
}) {
  const links: QuickLink[] = [
    {
      href: '/start',
      title: 'Set Up Your Own Kingdom',
      subtitle: 'Get a free booking link + admin link, ready in seconds',
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/explore/kingdom.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    { href: '/book', title: bookTitle, subtitle: bookSubtitle, tone: 'gold', icon: <CalendarIcon /> },
    { href: '/schedule', title: scheduleTitle, subtitle: scheduleSubtitle, tone: 'cyan', icon: <ListIcon /> },
    {
      href: '/rally-timer',
      title: rallyTimerTitle,
      subtitle: rallyTimerSubtitle,
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/explore/rally-timer.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/gift-codes',
      title: giftCodesTitle,
      subtitle: giftCodesSubtitle,
      tone: 'cyan',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/explore/gift.png" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/gear-calculator',
      title: gearCalculatorTitle,
      subtitle: gearCalculatorSubtitle,
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/gear/pieces/infantry-1/infantry_gear_1_red_t6_s0.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/charm-calculator',
      title: charmCalculatorTitle,
      subtitle: charmCalculatorSubtitle,
      tone: 'cyan',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/charm/charm.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/hero-gear-calculator',
      title: heroGearCalculatorTitle,
      subtitle: heroGearCalculatorSubtitle,
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/heroGear/pieces/helm.png" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/troop-calculator',
      title: troopCalculatorTitle,
      subtitle: troopCalculatorSubtitle,
      tone: 'cyan',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/explore/troop.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/research-tree',
      title: researchTreeTitle,
      subtitle: researchTreeSubtitle,
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/research/growth/command-tactics.png" alt="" className="h-9 w-9 object-contain" />,
    },
    {
      href: '/building-planner',
      title: 'Building Upgrade Planner',
      subtitle: 'Pick a Town Center target, see the full upgrade path',
      tone: 'cyan',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/buildings/town-center-kingshot.png" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/pet-calculator',
      title: 'Pet Upgrade Calculator',
      subtitle: 'Pick a pet and a target level, see everything you need',
      tone: 'gold',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/pets/grizzly-bear.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/master-calculator',
      title: 'Masters Calculator',
      subtitle: 'Plan Affinity, Talent, Skills, and Special Research in one place',
      tone: 'cyan',
      // eslint-disable-next-line @next/next/no-img-element -- small fixed-size thumbnail in a 44px box, next/image is overkill
      icon: <img src="/masters/valora.webp" alt="" className="h-full w-full rounded-xl object-cover" />,
    },
    {
      href: '/kvk-history',
      title: 'KvK History',
      subtitle: 'Real Kingdom vs Kingdom match records -- prep and castle results',
      tone: 'gold',
      icon: <SwordsIcon />,
    },
    {
      href: '/kingdom-leaderboard',
      title: 'Kingdom Power Leaderboard',
      subtitle: 'Real, live governor rankings -- power, kills, mystic trial, and more',
      tone: 'cyan',
      icon: <TrophyIcon />,
    },
    {
      href: '/kingdom-map',
      title: 'Kingdom Map',
      subtitle: 'Real, live city positions and alliance territory',
      tone: 'gold',
      icon: <MapIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`focus-ring dashboard-card p-4 flex items-center gap-3.5 hover:-translate-y-0.5 transition-all ${TONE_CARD_HOVER[link.tone]}`}
        >
          <div className={`shrink-0 h-11 w-11 rounded-xl border flex items-center justify-center ${TONE_CLASSES[link.tone]}`}>
            {link.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-parchment-100">{link.title}</p>
            <p className="text-xs text-parchment-400 truncate">{link.subtitle}</p>
          </div>
          <span className="text-parchment-500 shrink-0">
            <ArrowIcon />
          </span>
        </Link>
      ))}
    </div>
  );
}
