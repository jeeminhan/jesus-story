'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  hi: 'Hindi',
  ko: 'Korean',
  ar: 'Arabic',
};

interface LanguageBannerProps {
  currentLang: string;
  availableLangs: string[];
  arcSlug: string;
}

export function LanguageBanner({ currentLang, availableLangs, arcSlug }: LanguageBannerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const otherLang = useMemo(
    () => availableLangs.find((lang) => lang !== currentLang) ?? null,
    [availableLangs, currentLang],
  );
  const storageKey = `gs_lang_banner_dismissed_${arcSlug}`;

  useEffect(() => {
    if (!otherLang) {
      setIsReady(true);
      return;
    }

    const isDismissed = sessionStorage.getItem(storageKey) === '1';
    setDismissed(isDismissed);
    setIsReady(true);
  }, [otherLang, storageKey]);

  if (!otherLang || !isReady || dismissed) {
    return null;
  }

  function handleSwitch() {
    const scene = searchParams.get('scene');
    const nextUrl = scene ? `/${otherLang}/${arcSlug}?scene=${encodeURIComponent(scene)}` : `/${otherLang}/${arcSlug}`;
    router.push(nextUrl);
  }

  function handleDismiss() {
    sessionStorage.setItem(storageKey, '1');
    setDismissed(true);
  }

  return (
    <div
      role="banner"
      className="fixed left-0 right-0 top-0 z-40 flex justify-center text-xs"
      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
    >
      <div className="flex w-full max-w-[480px] items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <p className="min-w-0 truncate">
          This story is also available in {LANGUAGE_LABELS[otherLang] ?? otherLang.toUpperCase()}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSwitch}
            className="border-0 bg-transparent p-0 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Switch &rarr;
          </button>
          <button
            type="button"
            aria-label="Dismiss language banner"
            onClick={handleDismiss}
            className="border-0 bg-transparent p-0 text-sm leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            &#10005;
          </button>
        </div>
      </div>
    </div>
  );
}
