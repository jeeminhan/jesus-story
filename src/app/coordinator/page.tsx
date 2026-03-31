import Link from 'next/link';
import { getCoordinatorMessages } from '@/lib/queries';

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatMood(value: string | null) {
  if (!value) {
    return 'Searching';
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export default async function CoordinatorDashboardPage() {
  const messages = await getCoordinatorMessages();
  const pendingCount = messages.filter((message) => !message.coordinator_reply?.trim()).length;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-[0.68rem] uppercase tracking-[0.28em]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
          >
            Coordinator prototype
          </p>
          <h1
            className="mt-3 text-[clamp(2rem,6vw,3.4rem)] leading-[0.98]"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
          >
            Read each message with context.
          </h1>
          <p
            className="mt-4 max-w-2xl text-base leading-7 sm:text-lg"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
          >
            This prototype view keeps the receiver&apos;s words, emotional path, language, and reply state in one place so
            follow-up can feel personal instead of generic.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
          <div
            className="rounded-[24px] border px-4 py-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              Inbox
            </p>
            <p className="mt-2 text-2xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              {messages.length}
            </p>
          </div>
          <div
            className="rounded-[24px] border px-4 py-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              Awaiting reply
            </p>
            <p className="mt-2 text-2xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              {pendingCount}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-4">
        {messages.map((message) => {
          const replyState = message.coordinator_reply?.trim() ? 'Replied' : 'Awaiting reply';

          return (
            <article
              key={message.id}
              className="rounded-[30px] border p-5 sm:p-6"
              style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em]"
                      style={{
                        color: 'var(--text-secondary)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      {formatMood(message.emotional_key)}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em]"
                      style={{
                        color: 'var(--text-secondary)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      {message.lang.toUpperCase()}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em]"
                      style={{
                        color: replyState === 'Replied' ? 'var(--text-primary)' : 'var(--text-secondary)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: replyState === 'Replied' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                      }}
                    >
                      {replyState}
                    </span>
                  </div>

                  <div>
                    <h2
                      className="text-[1.35rem] leading-tight"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
                    >
                      {message.sender_name ?? 'Anonymous receiver'}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatTimestamp(message.created_at)}
                      {message.arc_title ? ` • ${message.arc_title}` : message.arc_slug ? ` • ${message.arc_slug}` : ''}
                    </p>
                  </div>

                  {message.path_summary ? (
                    <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
                      {message.path_summary}
                    </p>
                  ) : null}

                  <blockquote
                    className="max-w-3xl whitespace-pre-wrap border-l-2 pl-4 text-base leading-7"
                    style={{ borderColor: 'var(--accent)', color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
                  >
                    {message.message}
                  </blockquote>
                </div>

                <div className="sm:min-w-[180px]">
                  <Link
                    href={`/coordinator/reply/${message.reply_token}`}
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border px-5 text-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    Open thread
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
