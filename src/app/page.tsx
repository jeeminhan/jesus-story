import Link from 'next/link';
import { headers } from 'next/headers';
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

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1200px] flex-col gap-5">
        <div className="max-w-2xl">
          <p
            className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            UX Design Directions
          </p>
          <h1
            className="mt-3 max-w-xl text-[clamp(1.9rem,7vw,3.6rem)] font-medium leading-[0.96] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            See the BMAD mockup first.
          </h1>
          <p
            className="mt-4 max-w-xl text-base leading-7 text-white/62 sm:text-lg"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Then enter the working app when you&apos;re ready.
          </p>
        </div>

        <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(320px,430px)_minmax(0,420px)] lg:justify-center">
          <section
            className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[32px] border bg-black/30 shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3 sm:px-5"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <p className="text-sm text-white/72" style={{ fontFamily: 'var(--font-ui)' }}>
                BMAD mockup preview
              </p>
              <a
                href="/ux-design-directions.html"
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.18em] text-white/44 transition-opacity hover:opacity-80"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Open full mockup
              </a>
            </div>
            <div className="aspect-[10/16] w-full bg-[#0c0c0f]">
              <iframe title="UX design directions" src="/ux-design-directions.html" className="h-full w-full" />
            </div>
          </section>

          <aside
            className="mx-auto flex w-full max-w-[430px] flex-col justify-between rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.025) 100%)',
            }}
          >
            <div>
              <p
                className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Live experience
              </p>
              <h2
                className="mt-3 text-2xl leading-tight text-white sm:text-[2rem]"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                Enter the live app.
              </h2>
              <p
                className="mt-4 text-sm leading-7 text-white/58 sm:text-base"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                The story, mirror, witness, and connect flow will still start in your preferred language.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
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
                Open live app
              </Link>
              <p
                className="text-xs leading-6 text-white/40"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Preferred language: {preferredLang.toUpperCase()}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
