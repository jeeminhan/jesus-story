'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { submitConnectMessage } from '@/app/actions/connect';
import { Textarea } from '@/components/ui/textarea';

type ConnectFormStatus = 'idle' | 'sending' | 'confirmed' | 'error';

interface ConnectFormProps {
  arcSlug: string;
  arcId?: string;
  lang: string;
  emotionalKey?: string;
  cancelHref: string;
}

type SessionPayload = {
  lang?: string;
  arcSlug?: string;
  sceneId?: string;
  storyPath?: unknown;
};

export function ConnectForm({ arcSlug, arcId, lang, emotionalKey, cancelHref }: ConnectFormProps) {
  const [status, setStatus] = useState<ConnectFormStatus>('idle');
  const [message, setMessage] = useState('');
  const [wantsReply, setWantsReply] = useState<boolean | null>(null);
  const [replyToken, setReplyToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [didRestoreDraft, setDidRestoreDraft] = useState(false);
  const draftStorageKey = useMemo(() => `gs_connect_draft:${lang}:${arcSlug}`, [lang, arcSlug]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const rawDraft = window.localStorage.getItem(draftStorageKey);
      if (!rawDraft) {
        return;
      }

      const parsedDraft = JSON.parse(rawDraft) as { message?: string; wantsReply?: boolean | null };
      if (typeof parsedDraft.message === 'string') {
        setMessage(parsedDraft.message);
      }
      if (typeof parsedDraft.wantsReply === 'boolean') {
        setWantsReply(parsedDraft.wantsReply);
      }
      setDidRestoreDraft(Boolean(parsedDraft.message || typeof parsedDraft.wantsReply === 'boolean'));
    } catch {
      // Ignore corrupt local drafts.
    }
  }, [draftStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (status === 'confirmed') {
      window.localStorage.removeItem(draftStorageKey);
      return;
    }

    if (!message.trim() && wantsReply === null) {
      window.localStorage.removeItem(draftStorageKey);
      return;
    }

    window.localStorage.setItem(
      draftStorageKey,
      JSON.stringify({
        message,
        wantsReply,
      }),
    );
  }, [draftStorageKey, message, status, wantsReply]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === 'sending' || wantsReply === null) {
      return;
    }

    if (!arcId) {
      setErrorMessage('Something went wrong. Your message was not sent.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    const result = await submitConnectMessage({
      arcId,
      lang,
      emotionalKey: emotionalKey ?? null,
      message,
      wantsReply,
      storyPath: readStoryPath(lang, arcSlug),
    });

    if (!result.success) {
      setErrorMessage(result.error ?? 'Something went wrong. Your message was not sent.');
      setStatus('error');
      return;
    }

    setReplyToken(result.replyToken);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(draftStorageKey);
    }
    setStatus('confirmed');
  }

  if (status === 'confirmed') {
    return (
      <section className="space-y-4">
        <p className="text-xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
          A real person will read this.
        </p>
        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
          You do not need to do anything else right now.
        </p>

        {replyToken ? (
          <>
            <p className="leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              If Sarah replies, this private link is where you can come back:
            </p>
            <a
              href={`/reply/${replyToken}`}
              className="inline-flex rounded-full border px-4 py-2 text-sm transition-opacity hover:opacity-80"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            >
              Check for a reply
            </a>
          </>
        ) : (
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
            No one will chase you. You left what you wanted to leave.
          </p>
        )}

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Thank you.
        </p>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="space-y-4">
        <p role="alert" className="text-sm leading-relaxed text-red-300">
          Something went wrong. Your message wasn&apos;t lost. Try again when you&apos;re ready.
        </p>
        {errorMessage ? (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {errorMessage}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setErrorMessage('');
          }}
          className="inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-[0.7rem] uppercase tracking-[0.18em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          What are you thinking right now?
        </label>
        <Textarea
          id="message"
          aria-required="false"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[180px] rounded-[28px] border-white/10 bg-black/10 px-5 py-4 text-[1rem] leading-7"
          placeholder="You can leave a question, a reaction, or a few honest words."
          style={{ fontFamily: 'var(--font-narrative)' }}
        />
        <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
          This is not live chat. It will wait here quietly until someone reads it.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
            {didRestoreDraft || message || wantsReply !== null ? 'Saved quietly on this device' : 'Nothing is sent until you tap send'}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{message.length} characters</span>
        </div>
      </div>

      <div className="rounded-[28px] border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p
          className="text-[0.7rem] uppercase tracking-[0.18em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          If someone replies
        </p>
        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
          If Sarah replies, do you want a private link so you can read it later?
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={wantsReply === true}
            onClick={() => setWantsReply(true)}
            className="flex min-h-[94px] flex-col items-start justify-center rounded-[24px] border px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              borderColor: wantsReply === true ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
              backgroundColor: wantsReply === true ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
            }}
          >
            <span className="text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              Yes, give me a link
            </span>
            <span className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
              Keep the next step private and in my hands.
            </span>
          </button>
          <button
            type="button"
            aria-pressed={wantsReply === false}
            onClick={() => setWantsReply(false)}
            className="flex min-h-[94px] flex-col items-start justify-center rounded-[24px] border px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{
              borderColor: wantsReply === false ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
              backgroundColor: wantsReply === false ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
            }}
          >
            <span className="text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              No, just pass it along
            </span>
            <span className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
              Leave this here without expecting anything back.
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          aria-label="Send my story"
          disabled={wantsReply === null || status === 'sending'}
          className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            fontFamily: 'var(--font-narrative)',
          }}
        >
          {status === 'sending' ? 'Sending…' : 'Send my story'}
        </button>

        <Link
          href={cancelHref}
          className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            fontFamily: 'var(--font-narrative)',
          }}
        >
          Not yet
        </Link>
      </div>

      <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
        Leaving without sending is a complete, valid ending.
      </p>
    </form>
  );
}

function readStoryPath(lang: string, arcSlug: string): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawSession = window.localStorage.getItem('gs_session');
    if (!rawSession) {
      return [];
    }

    const parsed = JSON.parse(rawSession) as SessionPayload;
    if (parsed.lang !== lang || parsed.arcSlug !== arcSlug) {
      return [];
    }

    if (Array.isArray(parsed.storyPath)) {
      return parsed.storyPath.filter((sceneId): sceneId is string => typeof sceneId === 'string');
    }

    if (typeof parsed.sceneId === 'string' && parsed.sceneId.length > 0) {
      return [parsed.sceneId];
    }

    return [];
  } catch {
    return [];
  }
}
