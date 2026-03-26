'use client';

import { useRouter } from 'next/navigation';
import type { Language } from '@/lib/types';

const LANGUAGE_EMOJIS: Record<string, string> = {
  en: 'US',
  zh: 'CN',
  es: 'ES',
  hi: 'IN',
  ko: 'KR',
  ar: 'SA',
};

export function LanguageGrid({ languages }: { languages: Language[] }) {
  const router = useRouter();

  return (
    <div className="grid w-full max-w-lg grid-cols-2 gap-4">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => router.push(`/${lang.code}`)}
          className="
            flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5
            transition-all duration-200 hover:border-white/20 hover:bg-white/10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
          "
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/50">
            {LANGUAGE_EMOJIS[lang.code] ?? 'INTL'}
          </span>
          <span className="text-sm font-medium text-amber-100">{lang.native_name}</span>
          <span className="text-xs text-white/50">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
