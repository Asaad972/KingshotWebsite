'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function ExampleScreenshot({ src, alt }: { src: string; alt: string }) {
  const { t } = useI18n();
  const [error, setError] = useState(false);

  return (
    <div className="rounded border border-stone-700 bg-stone-950 overflow-hidden aspect-[9/16] flex items-center justify-center">
      {error ? (
        <p className="text-xs text-parchment-500 text-center px-4">{t('home.exampleImageMissing')}</p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />
      )}
    </div>
  );
}
