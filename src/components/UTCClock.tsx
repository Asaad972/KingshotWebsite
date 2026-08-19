'use client';

import { useEffect, useState } from 'react';
import { formatUtcClock, formatUtcWeekdayDate } from '@/lib/slots';
import { useI18n } from '@/lib/i18n';

export default function UTCClock({
  variant = 'full',
  sticky = false,
}: {
  variant?: 'full' | 'compact';
  sticky?: boolean;
}) {
  const { t, locale } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded border border-stone-700 bg-stone-900 px-2.5 py-1 text-sm text-parchment-200 ${
          sticky ? 'sticky top-2 z-30' : ''
        }`}
      >
        <span className="font-mono tracking-wider text-gold-300 tabular-nums">
          {now ? formatUtcClock(now) : '--:--:--'}
        </span>
        <span className="text-[10px] text-parchment-400">UTC</span>
      </div>
    );
  }

  return (
    <div
      className={`dashboard-card flex flex-col items-center gap-0.5 px-5 py-3 text-center ${
        sticky ? 'sm:sticky sm:top-4 sm:z-20' : ''
      }`}
    >
      <p className="label-eyebrow">{t('common.utcTime')}</p>
      <p className="font-mono text-2xl sm:text-3xl font-semibold text-gold-300 tabular-nums leading-tight">
        {now ? formatUtcClock(now) : '--:--:--'}
      </p>
      <p className="text-xs text-parchment-300">{now ? formatUtcWeekdayDate(now, locale ?? 'en') : ''}</p>
    </div>
  );
}
