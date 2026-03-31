import Link from 'next/link';
import { headers } from 'next/headers';
import { getActiveLanguages } from '@/lib/queries';

const roleCards = [
  {
    eyebrow: 'Receiver',
    title: 'Enter the story cold.',
    body: 'Open the emotional entry and walk the same first-time path a friend would receive from a shared card.',
    href: (lang: string) => `/${lang}`,
    cta: 'Start as receiver',
  },
  {
    eyebrow: 'Carrier',
    title: 'Make a card for one person.',
    body: 'Use the prototype card builder to frame a scene around a real friend, then generate a shareable cold-entry link.',
    href: (lang: string) => `/${lang}/the-king-who-came/share`,
    cta: 'Build a card',
  },
  {
    eyebrow: 'Coordinator',
    title: 'Read messages with context.',
    body: 'Open the coordinator desk to see incoming notes, emotional paths, reply state, and the private reply thread.',
    href: () => '/coordinator',
    cta: 'Open coordinator desk',
  },
];

const signals = [
  'Receiver-first story flow with emotional entry and mirror moment',
  'Carrier share builder with personalized cold-entry links',
  'Coordinator inbox and private reply thread in mock mode',
];

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

export default async function PrototypePage() {
  const languageHeader = (await headers()).get('accept-language') ?? '';
  const languages = await getActiveLanguages();
  const activeLangs = languages.map((language) => language.code);
  const preferredLang = resolvePreferredLang(languageHeader, activeLangs);

  return (
    <main className="root-entry-shell min-h-screen bg-[#0b0b0d] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1240px] flex-col gap-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] lg:items-end">
          <div
            className="rounded-[36px] border p-6 sm:p-8"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <p
              className="text-[0.68rem] uppercase tracking-[0.28em] text-white/38"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Gospel Story prototype
            </p>
            <h1
              className="mt-4 max-w-3xl text-[clamp(2.3rem,7vw,5rem)] leading-[0.94] text-white"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              Build the door before asking anyone to walk through it.
            </h1>
            <p
              className="mt-5 max-w-3xl text-base leading-7 text-white/62 sm:text-lg"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              Gospel Story is a receiver-first prototype for people with no church background. It starts with what they are
              carrying, routes them into a story of Jesus that meets that emotion, and ends with human continuation instead
              of a cold handoff.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${preferredLang}`}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-narrative)',
                }}
              >
                Start the live prototype
              </Link>
              <Link
                href={`/${preferredLang}/the-king-who-came/share`}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  fontFamily: 'var(--font-narrative)',
                }}
              >
                Jump to the card builder
              </Link>
            </div>
          </div>

          <aside
            className="rounded-[36px] border p-6 sm:p-7"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.018) 100%)',
            }}
          >
            <p
              className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What is live
            </p>
            <div className="mt-4 space-y-3">
              {signals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[22px] border px-4 py-4"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <p className="text-sm leading-7 text-white/68" style={{ fontFamily: 'var(--font-narrative)' }}>
                    {signal}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-white/38" style={{ fontFamily: 'var(--font-ui)' }}>
              Preferred language: {preferredLang.toUpperCase()}
            </p>
          </aside>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {roleCards.map((card) => (
            <article
              key={card.eyebrow}
              className="flex h-full flex-col rounded-[32px] border p-6"
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.02) 100%)',
              }}
            >
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40" style={{ fontFamily: 'var(--font-ui)' }}>
                {card.eyebrow}
              </p>
              <h2
                className="mt-4 text-[1.65rem] leading-tight text-white"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                {card.title}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-white/60 sm:text-base" style={{ fontFamily: 'var(--font-narrative)' }}>
                {card.body}
              </p>
              <Link
                href={card.href(preferredLang)}
                className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full border px-5 text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  fontFamily: 'var(--font-narrative)',
                }}
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
