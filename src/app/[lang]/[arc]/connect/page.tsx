import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConnectForm } from '@/components/ConnectForm';
import { isValidLang } from '@/lib/constants';
import { getArcBySlug } from '@/lib/queries';

export default async function ConnectPage({
  params,
}: {
  params: Promise<{ lang: string; arc: string }>;
}) {
  const { lang, arc } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const arcData = await getArcBySlug(arc);
  if (!arcData) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12 sm:px-8">
      <div className="w-full">
        <p
          className="mb-3 text-xs uppercase tracking-[0.28em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          Leave a message
        </p>
        <h1
          className="max-w-2xl text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1.02]"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
        >
          If you want, you can leave this with someone real.
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-7 sm:text-lg"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
        >
          Sarah will read what you write. No agenda. No pressure. If you want a reply, you can keep the next step
          private with a link that comes back here.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Private', 'Async', 'No call'].map((chip) => (
            <span
              key={chip}
              className="rounded-full border px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.16em]"
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <section
          className="mt-10 rounded-[36px] border p-6 shadow-[0_30px_80px_rgba(0,0,0,0.16)] backdrop-blur-[18px] sm:p-8"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <div
            className="mb-8 rounded-[26px] border px-5 py-4"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <p
              className="text-[0.68rem] uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            >
              Who receives this
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(244,194,219,0.2), rgba(255,255,255,0.08))',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-narrative)',
                  fontSize: '1.05rem',
                }}
              >
                S
              </div>
              <div>
                <p className="text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
                  Sarah
                </p>
                <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
                  A real person from the community. Not a bot. Not a call.
                </p>
              </div>
            </div>
          </div>

          <ConnectForm
            lang={lang}
            arcSlug={arc}
            arcId={arcData.id}
            emotionalKey={arcData.emotional_key ?? undefined}
            cancelHref={`/${lang}`}
          />
        </section>

        <div className="mt-6 flex justify-center">
          <Link
            href={`/${lang}/${arc}`}
            className="text-sm underline underline-offset-4 transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            Return to the story
          </Link>
        </div>
      </div>
    </main>
  );
}
