import Link from 'next/link';
import { headers } from 'next/headers';
import { getActiveLanguages } from '@/lib/queries';

const experiencePillars = [
  {
    title: 'Starts with emotion',
    body: 'The entry question is human, not churchy: what are you carrying right now? Each answer routes into a different Jesus story path.',
  },
  {
    title: 'Feels like art',
    body: 'The experience is built around painterly scenes, emotional color shifts, ambient pacing, and text that arrives like it is being spoken.',
  },
  {
    title: 'Continues with people',
    body: 'The story does not end with a cold form. It moves into reflection, witness, and connection with real people who walked similar paths.',
  },
];

const projectRoles = [
  {
    title: 'The Receiver',
    body: 'Someone with no church background arrives through a card made for them and steps directly into the story.',
  },
  {
    title: 'The Carrier',
    body: 'A friend who has been moved by the experience shares a personalized card instead of sending a generic invitation.',
  },
  {
    title: 'The Community',
    body: 'Real people become the next scene through witness videos and human follow-up, so the story continues past the app.',
  },
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

export default async function HomePage() {
  const languageHeader = (await headers()).get('accept-language') ?? '';
  const languages = await getActiveLanguages();
  const activeLangs = languages.map((language) => language.code);
  const preferredLang = resolvePreferredLang(languageHeader, activeLangs);

  return (
    <main className="root-entry-shell min-h-screen bg-[#0b0b0d] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1200px] flex-col gap-5">
        <div className="max-w-2xl">
          <p
            className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            Project Overview
          </p>
          <h1
            className="mt-3 max-w-xl text-[clamp(1.9rem,7vw,3.6rem)] font-medium leading-[0.96] text-white"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            See the mockup first.
          </h1>
          <p
            className="mt-4 max-w-xl text-base leading-7 text-white/62 sm:text-lg"
            style={{ fontFamily: 'var(--font-narrative)' }}
          >
            Start with the mockup, then open the live build when you&apos;re ready.
          </p>
        </div>

        <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(320px,430px)_minmax(320px,430px)] lg:justify-center">
          <section
            className="mx-auto flex w-full max-w-[430px] flex-col justify-between rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.018) 100%)',
            }}
          >
            <div>
              <p
                className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Design document
              </p>
              <h2
                className="mt-3 text-2xl leading-tight text-white sm:text-[2rem]"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                Open the mockup.
              </h2>
              <p
                className="mt-4 text-sm leading-7 text-white/58 sm:text-base"
                style={{ fontFamily: 'var(--font-narrative)' }}
              >
                View the design directions, scene references, and visual exploration in one place.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="/ux-design-directions.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-narrative)',
                }}
              >
                Open mockup
              </a>
              <p className="text-xs leading-6 text-white/40" style={{ fontFamily: 'var(--font-ui)' }}>
                Opens the full visual planning document in a new tab.
              </p>
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
                Open the working story flow with emotional entry, scene art, mirror reflection, witness, and connect in your preferred language.
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

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article
            className="rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          >
            <p
              className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What this project is
            </p>
            <h2
              className="mt-3 max-w-2xl text-[1.7rem] leading-tight text-white sm:text-[2.2rem]"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              A living gospel experience designed to meet people where they actually are.
            </h2>
            <p
              className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              Gospel Story is a living, AI-powered gospel experience for people with no church
              background. It starts where each person actually is — emotionally, not religiously —
              and uses AI to route them through the stories of Jesus that speak most directly to what
              they&apos;re carrying. The measure of success is simple: someone who came in with grief,
              doubt, or searching leaves feeling comforted. Seen. Met.
            </p>
            <p
              className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:text-base"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              The planning docs keep returning to the same idea: this should not feel like content at
              someone. It should feel like a story experience that begins with a shared card, moves
              through painterly scenes and emotional color shifts, and ends with a human continuation
              instead of a cold handoff.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {experiencePillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[24px] border p-4"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <h3
                    className="text-base text-white"
                    style={{ fontFamily: 'var(--font-narrative)' }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-6 text-white/55"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <aside
            className="rounded-[32px] border p-5 sm:p-6"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)',
            }}
          >
            <p
              className="text-[0.68rem] uppercase tracking-[0.2em] text-white/40"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              How it works
            </p>
            <h2
              className="mt-3 text-[1.65rem] leading-tight text-white"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              The story is designed to move through people.
            </h2>
            <p
              className="mt-4 text-sm leading-7 text-white/60 sm:text-base"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              The core documents frame the project around three roles. A Receiver is met through emotion,
              a Carrier shares something made for a specific person, and the Community becomes Scene N+1
              through witness and reply.
            </p>

            <div className="mt-6 space-y-3">
              {projectRoles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-[22px] border px-4 py-3 text-sm leading-6 text-white/58"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.16em] text-white/38">{role.title}</p>
                  <p className="mt-2 text-white/58">{role.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
