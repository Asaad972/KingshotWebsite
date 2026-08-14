'use client';

import { useI18n } from '@/lib/i18n';
import LanguageSelector from './LanguageSelector';

export default function LocaleGate({ children }: { children: React.ReactNode }) {
  const { locale, ready } = useI18n();

  // Avoid a flash of the wrong screen while we read localStorage.
  if (!ready) {
    return <div className="min-h-screen bg-stone-950" />;
  }

  if (!locale) {
    return <LanguageSelector fullScreen />;
  }

  return <>{children}</>;
}
