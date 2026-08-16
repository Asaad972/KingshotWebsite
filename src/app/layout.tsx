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

export const metadata: Metadata = {
  title: 'Kingdom #1781 Castle Appointments',
  description: 'Apply for your Kingdom #1781 castle appointment time slot.',
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
