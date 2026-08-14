'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import ExampleScreenshot from './ExampleScreenshot';

export const TUTORIAL_STORAGE_KEY = 'kingshot_tutorial_seen';

interface TutorialProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function Tutorial({ forceOpen = false, onClose }: TutorialProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: t('tutorial.step1Title'), body: t('tutorial.step1Body'), image: '/tutorial/main-account.png' },
    { title: t('tutorial.step2Title'), body: t('tutorial.step2Body'), image: '/tutorial/speedups.png' },
    { title: t('tutorial.step3Title'), body: t('tutorial.step3Body'), image: null },
    { title: t('tutorial.step4Title'), body: t('tutorial.step4Body'), image: null },
    { title: t('tutorial.step5Title'), body: t('tutorial.step5Body'), image: null },
  ];

  useEffect(() => {
    if (forceOpen) {
      setStep(0);
      setOpen(true);
      return;
    }
    const seen = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!seen) setOpen(true);
  }, [forceOpen]);

  const finish = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    setOpen(false);
    onClose?.();
  };

  if (!open) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-0 sm:px-4">
      <div className="w-full sm:max-w-md rounded-t-md sm:rounded-md border border-stone-700 bg-stone-900 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-5 rounded-sm transition-colors ${
                  i === step ? 'bg-gold-400' : i < step ? 'bg-gold-700' : 'bg-stone-700'
                }`}
              />
            ))}
          </div>
          <button onClick={finish} className="text-sm text-parchment-400 hover:text-gold-300 focus-ring rounded-md">
            {t('common.skip')}
          </button>
        </div>

        <div className="text-center py-3">
          <h3 className="text-base font-semibold text-parchment-100">{current.title}</h3>
          <p className="text-parchment-300 mt-1.5 text-sm leading-relaxed">{current.body}</p>
          {current.image && (
            <div className="mt-3 mx-auto w-32">
              <ExampleScreenshot src={current.image} alt={current.title} />
            </div>
          )}
        </div>

        <div className="flex gap-2.5 mt-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="focus-ring flex-1 rounded-md border border-stone-700 py-2 text-sm text-parchment-200 hover:border-gold-600 transition-colors"
            >
              {t('common.back')}
            </button>
          )}
          <button
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="focus-ring flex-1 rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
          >
            {isLast ? t('common.confirm') : t('common.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
