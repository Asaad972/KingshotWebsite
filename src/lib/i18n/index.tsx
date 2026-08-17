'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { Locale } from '@/types';
import en from './translations/en';
import ar from './translations/ar';
import tr from './translations/tr';
import sr from './translations/sr';

const dictionaries = { en, ar, tr, sr };

export const LOCALE_STORAGE_KEY = 'kingshot_locale';

type Dictionary = typeof en;

function getByPath(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? path;
}

interface I18nContextValue {
  locale: Locale | null;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  ready: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null) : null;
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!locale) return;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const dict: Dictionary = dictionaries[locale ?? 'en'];

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = getByPath(dict, key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }
      return str;
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      locale,
      dir: (locale === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
      setLocale,
      t,
      ready,
    }),
    [locale, setLocale, t, ready]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
