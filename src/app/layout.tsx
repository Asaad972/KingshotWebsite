import type { Metadata } from 'next';
import { Rajdhani, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import LocaleGate from '@/components/LocaleGate';
import SiteHeader from '@/components/SiteHeader';
import MobileNavigation from '@/components/MobileNavigation';

const display = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_TITLE = 'K1781 -- Kingshot Nerds HQ';
const SITE_DESCRIPTION =
  'For Kingshot players who want to be the best at everything: castle appointments, gear calculators, rally timing, and gift codes, all in one place.';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_TITLE,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">
        <I18nProvider>
          <LocaleGate>
            <SiteHeader />
            <main className="min-h-[calc(100vh-56px)] pb-16 sm:pb-0">{children}</main>
            <MobileNavigation />
          </LocaleGate>

        </I18nProvider>
      </body>
    </html>
  );
}
