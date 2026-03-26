import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getActiveLanguages } from '@/lib/queries';

function resolvePreferredLang(acceptLanguage: string, availableLangs: string[]) {
  const candidates = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean)
    .flatMap((lang) => {
      const baseLang = lang.split('-')[0];
      return baseLang && baseLang !== lang ? [lang, baseLang] : [lang];
    });

  for (const candidate of candidates) {
    if (availableLangs.includes(candidate)) {
      return candidate;
    }
  }

  if (availableLangs.includes('en')) {
    return 'en';
  }

  return availableLangs[0] ?? 'en';
}

export default async function HomePage() {
  const languageHeader = (await headers()).get('accept-language') ?? '';
  const languages = await getActiveLanguages();
  const activeLangs = languages.map((language) => language.code);
  const preferredLang = resolvePreferredLang(languageHeader, activeLangs);

  redirect(`/${preferredLang}`);
}
