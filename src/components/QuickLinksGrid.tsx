'use client';

import Link from 'next/link';

type Tone = 'gold' | 'cyan';

const TONE_CLASSES: Record<Tone, string> = {
  gold: 'bg-gold-500/15 border-gold-500/30 text-gold-400',
  cyan: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
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

function ClockIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <rect x="4" y="9" width="16" height="11" rx="1.5" strokeLinejoin="round" />
      <path d="M4 13h16M12 9v11" strokeLinecap="round" />
      <path d="M12 9c0-2.5-1.5-4-3-4S6.5 6.5 8 8.5c.7.9 2 .5 4 .5Z" strokeLinejoin="round" />
      <path d="M12 9c0-2.5 1.5-4 3-4s2.5 1.5 1 3.5c-.7.9-2 .5-4 .5Z" strokeLinejoin="round" />
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

function ShieldIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg {...ICON_PROPS} className="h-5 w-5">
      <path d="M5 9l3-5h8l3 5-7 11-7-11Z" strokeLinejoin="round" />
      <path d="M5 9h14M9.5 4 8 9l4 11 4-11-1.5-5" strokeLinecap="round" strokeLinejoin="round" />
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
}) {
  const links: QuickLink[] = [
    { href: '/book', title: bookTitle, subtitle: bookSubtitle, tone: 'gold', icon: <CalendarIcon /> },
    { href: '/schedule', title: scheduleTitle, subtitle: scheduleSubtitle, tone: 'cyan', icon: <ListIcon /> },
    { href: '/rally-timer', title: rallyTimerTitle, subtitle: rallyTimerSubtitle, tone: 'gold', icon: <ClockIcon /> },
    { href: '/gift-codes', title: giftCodesTitle, subtitle: giftCodesSubtitle, tone: 'cyan', icon: <GiftIcon /> },
    { href: '/gear-calculator', title: gearCalculatorTitle, subtitle: gearCalculatorSubtitle, tone: 'gold', icon: <ShieldIcon /> },
    { href: '/charm-calculator', title: charmCalculatorTitle, subtitle: charmCalculatorSubtitle, tone: 'cyan', icon: <GemIcon /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="focus-ring dashboard-card p-3 flex items-center gap-3 hover:border-stone-500 transition-colors"
        >
          <div className={`shrink-0 h-10 w-10 rounded-md border flex items-center justify-center ${TONE_CLASSES[link.tone]}`}>
            {link.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-parchment-100">{link.title}</p>
            <p className="text-xs text-parchment-400 truncate">{link.subtitle}</p>
          </div>
          <span className="text-parchment-500">
            <ArrowIcon />
          </span>
        </Link>
      ))}
    </div>
  );
}
