import Link from 'next/link';
import { CoordinatorReplyForm } from '@/components/CoordinatorReplyForm';
import { getConnectMessageByToken } from '@/lib/queries';

export default async function CoordinatorReplyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const message = await getConnectMessageByToken(token);

  if (!message) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
          Link not found.
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          This link may have expired or is invalid.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em]" style={{ color: 'var(--text-secondary)' }}>
            Coordinator thread
          </p>
          <h1 className="mt-3 text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
            Reply to message
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {message.sender_name ?? 'Anonymous receiver'} • {(message.emotional_key ?? 'searching').toUpperCase()} •{' '}
            {message.lang.toUpperCase()}
          </p>
          {message.path_summary ? (
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
              {message.path_summary}
            </p>
          ) : null}
        </div>

        <Link
          href="/coordinator"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          Back to inbox
        </Link>
      </div>

      <div
        className="mt-6 rounded-[28px] border p-5"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Original message
        </p>
        <blockquote className="mt-2 whitespace-pre-wrap border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
          {message.message}
        </blockquote>
      </div>

      {message.coordinator_reply?.trim() ? (
        <div
          className="mt-6 rounded-[28px] border p-5"
          style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
        >
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
            Current reply
          </p>
          <p
            className="mt-3 whitespace-pre-wrap leading-7"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
          >
            {message.coordinator_reply}
          </p>
        </div>
      ) : null}

      <div className="mt-6">
        <CoordinatorReplyForm token={token} />
      </div>
    </main>
  );
}
