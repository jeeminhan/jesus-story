import { getConnectMessageByToken } from '@/lib/queries';

export default async function ReplyCheckPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { token: pathToken } = await params;
  const { token: queryToken } = await searchParams;
  const effectiveToken = typeof queryToken === 'string' && queryToken.trim().length > 0 ? queryToken : pathToken;

  const message = await getConnectMessageByToken(effectiveToken);
  if (!message) {
    return (
      <main data-key="searching" className="mx-auto min-h-screen max-w-xl px-6 py-12">
        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
          Link not found.
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          This link may have expired or is invalid.
        </p>
      </main>
    );
  }

  const coordinatorReply = message?.coordinator_reply?.trim() ?? '';

  if (!coordinatorReply) {
    return (
      <main data-key="searching" className="mx-auto min-h-screen max-w-xl px-6 py-12">
        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
          No reply yet. Come back any time.
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Keep this link and check again later.
        </p>
      </main>
    );
  }

  return (
    <main data-key="searching" className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
        A reply for you
      </h1>
      <div
        className="mt-6 rounded-xl border p-5"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
      >
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          From your coordinator
        </p>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {coordinatorReply}
        </p>
      </div>
    </main>
  );
}
