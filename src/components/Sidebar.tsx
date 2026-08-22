'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/types';

const LANG_LABELS: Record<Locale, string> = { en: 'EN', ar: 'AR', tr: 'TR', sr: 'SR' };

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <rect x="3" y="5" width="18" height="16" rx="2" strokeLinejoin="round" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`h-4 w-4 transition-transform ${open ? '' : 'rotate-180'}`}
    >
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function SwordsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <path d="M6 4 20 18M8.5 4 6 6.5 4 4.5 5.5 3 8.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 4 4 18M15.5 4 18 6.5 20 4.5 18.5 3 15.5 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18v2h2M18 18v2h-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v3M9 20h6M9.5 20c0-1.7.7-2.6 2.5-3 1.8.4 2.5 1.3 2.5 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-full w-full">
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

/** Real photo icons (same assets already used on the Explore grid) for
 * visual consistency, small SVG line icons for the three booking pages
 * (no dedicated art for those). */
function useNavSections(): NavSection[] {
  const { t } = useI18n();
  const photo = (src: string) => (
    <Image src={src} alt="" width={24} height={24} className="h-full w-full rounded object-cover" unoptimized />
  );
  return [
    { title: null, items: [{ href: '/', label: t('common.home'), icon: <HomeIcon /> }] },
    {
      title: 'Booking',
      items: [
        { href: '/start', label: 'Set Up Your Own Kingdom', icon: photo('/explore/kingdom.webp') },
        { href: '/book', label: 'Book Your Slot', icon: <CalendarIcon /> },
        { href: '/schedule', label: 'View Castle Schedule', icon: <ListIcon /> },
      ],
    },
    {
      title: t('home.calculatorsNav'),
      items: [
        {
          href: '/gear-calculator',
          label: t('home.gearCalculatorNav'),
          icon: photo('/gear/pieces/infantry-1/infantry_gear_1_red_t6_s0.webp'),
        },
        { href: '/charm-calculator', label: t('home.charmCalculatorNav'), icon: photo('/charm/charm.webp') },
        { href: '/hero-gear-calculator', label: t('home.heroGearCalculatorNav'), icon: photo('/heroGear/pieces/helm.png') },
        { href: '/troop-calculator', label: t('home.troopCalculatorNav'), icon: photo('/explore/troop.webp') },
        { href: '/research-tree', label: t('home.researchTreeNav'), icon: photo('/research/growth/command-tactics.png') },
        { href: '/building-planner', label: t('home.buildingPlannerNav'), icon: photo('/buildings/town-center-kingshot.png') },
        { href: '/pet-calculator', label: t('home.petCalculatorNav'), icon: photo('/pets/grizzly-bear.webp') },
        { href: '/master-calculator', label: t('home.masterCalculatorNav'), icon: photo('/masters/valora.webp') },
      ],
    },
    {
      title: 'More',
      items: [
        { href: '/rally-timer', label: t('home.rallyTimerNav'), icon: photo('/explore/rally-timer.webp') },
        { href: '/gift-codes', label: t('home.giftCodesNav'), icon: photo('/explore/gift.png') },
        { href: '/kvk-history', label: 'KvK History', icon: <SwordsIcon /> },
        { href: '/kingdom-leaderboard', label: 'Power Leaderboard', icon: <TrophyIcon /> },
        { href: '/kingdom-map', label: 'Kingdom Map', icon: <MapIcon /> },
      ],
    },
  ];
}

function NavRow({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={`focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
        active
          ? 'bg-gold-500/15 text-gold-300 border border-gold-600/40'
          : 'text-parchment-300 hover:bg-stone-800 border border-transparent'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className="h-5 w-5 shrink-0">{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sections = useNavSections();

  return (
    <nav className="flex flex-col gap-4 overflow-y-auto scrollbar-thin">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="flex flex-col gap-1">
          {section.title && !collapsed && <p className="label-eyebrow px-2.5">{section.title}</p>}
          {section.items.map((item) => (
            <NavRow key={item.href} item={item} active={pathname === item.href} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
      ))}
    </nav>
  );
}

function LanguageSwitcher({ collapsed }: { collapsed: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  if (!locale) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`focus-ring flex w-full items-center gap-1.5 rounded border border-stone-700 bg-stone-900 px-2.5 py-1.5 text-sm text-parchment-200 hover:border-gold-600 transition-colors ${
          collapsed ? 'justify-center' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{LANG_LABELS[locale]}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full mb-1 start-0 w-28 overflow-hidden rounded border border-stone-700 bg-stone-900 shadow-lg z-10"
        >
          {(Object.keys(LANG_LABELS) as Locale[]).map((code) => (
            <li key={code}>
              <button
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`w-full text-start px-3 py-2 text-sm hover:bg-stone-800 ${
                  code === locale ? 'text-gold-300' : 'text-parchment-200'
                }`}
              >
                {LANG_LABELS[code]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const COLLAPSE_KEY = 'sidebar:collapsed';

/** Replaces the old SiteHeader + MobileNavigation entirely -- a single
 * left sidebar everywhere. Desktop: persistent, collapsible between an
 * icon-only rail and a full labeled panel (remembered via localStorage).
 * Mobile: off-canvas, opened by a hamburger button in a slim top bar,
 * always shown expanded since there's no rail width to save there. */
export default function Sidebar() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const drawerTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    setHydrated(true);
  }, []);

  // Bridges the collapsed state to <main>'s margin (see .sidebar-offset in
  // globals.css) without needing a context provider just for this one value.
  // Admin pages render their own AdminSidebar instead (see the early return
  // below) -- zero out the offset there so root layout's <main> doesn't
  // carry a stale margin left over from a previous page.
  useEffect(() => {
    const hidden = !locale || pathname?.startsWith('/admin');
    document.documentElement.style.setProperty('--sidebar-width', hidden ? '0px' : collapsed ? '4rem' : '16rem');
  }, [collapsed, pathname, locale]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const edgeTouchStart = useRef<{ x: number; y: number } | null>(null);
  const OPEN_THRESHOLD = 60;
  const MAX_OFF_AXIS = 60;

  const onEdgeTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    edgeTouchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onEdgeTouchEnd = (e: React.TouchEvent) => {
    const start = edgeTouchStart.current;
    edgeTouchStart.current = null;
    if (!start) return;
    const isRTL = document.documentElement.dir === 'rtl';
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = Math.abs(t.clientY - start.y);
    const openedToward = isRTL ? -dx : dx;
    if (openedToward > OPEN_THRESHOLD && dy < MAX_OFF_AXIS) setMobileOpen(true);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  };

  if (!locale) return null;
  if (pathname?.startsWith('/admin')) return null;

  const width = collapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Desktop: persistent fixed sidebar */}
      <aside
        className={`hidden sm:flex fixed inset-y-0 start-0 z-30 flex-col border-e border-stone-700 bg-stone-950/95 transition-[width] duration-200 ${width} ${
          hydrated ? '' : 'invisible'
        }`}
      >
        <div className="flex items-center gap-2 px-3 h-14 border-b border-stone-700 shrink-0">
          {!collapsed && (
            <Link href="/" className="flex-1 min-w-0 focus-ring rounded-md">
              <span className="font-display title-glow-gold text-sm font-bold tracking-wide truncate block">
                Kingshot Nerds HQ
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`focus-ring flex h-7 w-7 shrink-0 items-center justify-center rounded border border-stone-700 text-parchment-400 hover:border-gold-600 hover:text-gold-300 transition-colors ${
              collapsed ? 'mx-auto' : ''
            }`}
          >
            <ChevronIcon open={!collapsed} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <SidebarContent collapsed={collapsed} />
        </div>

        <div className="p-3 border-t border-stone-700 shrink-0">
          <LanguageSwitcher collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile: slim top bar with hamburger */}
      <header className="sm:hidden sticky top-0 z-40 border-b border-stone-700 bg-stone-950/95">
        <div className="gradient-bar" aria-hidden />
        <div className="px-3 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded border border-stone-700 text-parchment-200 hover:border-gold-600 transition-colors"
          >
            <HamburgerIcon />
          </button>
          <Link href="/" className="flex-1 min-w-0 focus-ring rounded-md">
            <span className="font-display title-glow-gold text-sm font-bold tracking-wide truncate block">
              Kingshot Nerds HQ
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile: invisible edge strip that owns the open-swipe gesture.
          touchAction: 'pan-y' is what actually stops the conflict this is
          here to fix -- without it, the browser's own edge-swipe-back
          gesture (Safari/Chrome mobile both have one) fires at the same
          time as our JS handler, since our touchstart/touchend listeners
          can't preventDefault() a gesture the browser's compositor already
          started recognizing. Scoping it to this thin strip (rather than
          touch-action: pan-y on the whole page) keeps horizontal scrolling
          working everywhere else, e.g. wide tables. */}
      {!mobileOpen && (
        <div
          className="sm:hidden fixed inset-y-0 start-0 z-40 w-7"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={onEdgeTouchStart}
          onTouchEnd={onEdgeTouchEnd}
          aria-hidden
        />
      )}

      {/* Mobile: off-canvas drawer. Always mounted (rather than conditionally
          rendered) and toggled with a transform + opacity transition -- the
          old version mounted the whole subtree (icons, images, translations)
          from scratch on every open, which is what made opening it feel like
          it paused for a beat instead of sliding in immediately. */}
      <div
        className={`sm:hidden fixed inset-0 z-50 flex transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/70" aria-hidden />
        <div
          className={`relative flex flex-col w-72 max-w-[85vw] h-full bg-stone-950 border-e border-stone-700 shadow-xl transition-transform duration-200 ease-out will-change-transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
          }`}
          style={{ touchAction: 'pan-y' }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => {
            drawerTouchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (drawerTouchStartX.current == null) return;
            const isRTL = document.documentElement.dir === 'rtl';
            const dx = e.changedTouches[0].clientX - drawerTouchStartX.current;
            const closedToward = isRTL ? dx > 0 : dx < 0;
            if (closedToward && Math.abs(dx) > 60) setMobileOpen(false);
            drawerTouchStartX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-2 px-3 h-14 border-b border-stone-700 shrink-0">
            <span className="font-display title-glow-gold text-sm font-bold tracking-wide truncate">Kingshot Nerds HQ</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded border border-stone-700 text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="p-3 border-t border-stone-700 shrink-0">
            <LanguageSwitcher collapsed={false} />
          </div>
        </div>
      </div>
    </>
  );
}
