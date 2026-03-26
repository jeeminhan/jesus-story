import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConnectForm } from '@/components/ConnectForm';
import { buttonVariants } from '@/components/ui/button';
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
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-12 sm:px-8">
      <div className="w-full">
        <p
          className="mb-3 text-xs uppercase tracking-[0.28em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          I&apos;m here
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
          Sarah will read what you write. No agenda. No pressure. If you want a reply, we&apos;ll give you a
          private link so the next step still stays in your hands.
        </p>

        <section
          className="mt-10 rounded-[32px] border p-6 sm:p-8"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <div className="mb-8 flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(244,194,219,0.22), rgba(255,255,255,0.08))',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-narrative)',
                fontSize: '1.2rem',
              }}
            >
              S
            </div>
            <div>
              <p className="text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
                Sarah
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                A real person from the community
              </p>
            </div>
          </div>

          <ConnectForm lang={lang} arcSlug={arc} arcId={arcData.id} emotionalKey={arcData.emotional_key ?? undefined} />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href={`/${lang}`} className={buttonVariants({ variant: 'ghost', size: 'lg', className: 'w-full' })}>
              Not yet
            </Link>
            <p
              className="self-center text-sm leading-6 sm:text-right"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
            >
              Leaving without sending is a complete, valid ending.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
