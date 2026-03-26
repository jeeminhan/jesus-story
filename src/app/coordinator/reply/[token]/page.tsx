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
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
        Reply to message
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Path: {message.emotional_key ?? 'searching'} | Language: {message.lang}
      </p>

      <div
        className="mt-6 rounded-lg border p-4"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Original message
        </p>
        <blockquote className="mt-2 whitespace-pre-wrap border-l-2 pl-3" style={{ borderColor: 'var(--accent)' }}>
          {message.message}
        </blockquote>
      </div>

      <div className="mt-6">
        <CoordinatorReplyForm token={token} />
      </div>
    </main>
  );
}
