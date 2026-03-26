import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ReplyLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const normalizedToken = typeof token === 'string' ? token.trim() : '';

  if (normalizedToken) {
    redirect(`/reply/${encodeURIComponent(normalizedToken)}`);
  }

  return (
    <main data-key="searching" className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
        Check for a reply
      </h1>

      <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
        Use the full private reply link that was shared with you.
      </p>

      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Example:{' '}
        <Link href="/reply/mock-reply-token" className="underline underline-offset-4" style={{ color: 'var(--text-primary)' }}>
          /reply/mock-reply-token
        </Link>
      </p>
    </main>
  );
}
