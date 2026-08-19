'use client';

import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/types';

const OPTIONS: Array<{ code: Locale; flag: string; nativeLabel: string }> = [
  { code: 'ar', flag: '🇸🇦', nativeLabel: 'العربية' },
  { code: 'tr', flag: '🇹🇷', nativeLabel: 'Türkçe' },
  { code: 'en', flag: '🇬🇧', nativeLabel: 'English' },
  { code: 'sr', flag: '🇷🇸', nativeLabel: 'Srpski' },
];

export default function LanguageSelector({
  fullScreen = false,
  onSelect,
}: {
  fullScreen?: boolean;
  onSelect?: () => void;
}) {
  const { setLocale } = useI18n();

  const handleSelect = (code: Locale) => {
    setLocale(code);
    onSelect?.();
  };

  const content = (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <p className="text-gold-400 tracking-widest text-xs font-semibold uppercase mb-2">KingShot</p>
        <h1 className="font-display text-xl sm:text-2xl text-parchment-100">
          Choose your language · اختر لغتك · Dil seçin · Izaberite jezik
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {OPTIONS.map((opt) => (
          <button
            key={opt.code}
            onClick={() => handleSelect(opt.code)}
            className="focus-ring flex flex-col items-center justify-center gap-3 rounded-md border border-stone-700 bg-stone-900 px-6 py-8 transition-colors hover:border-gold-600"
          >
            <span className="text-6xl leading-none" aria-hidden>
              {opt.flag}
            </span>
            <span className="section-title">{opt.nativeLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (!fullScreen) return content;

  return <div className="min-h-screen flex items-center justify-center bg-stone-950 py-10">{content}</div>;
}
