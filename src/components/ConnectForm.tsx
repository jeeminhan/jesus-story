'use client';

import { FormEvent, useState } from 'react';
import { submitConnectMessage } from '@/app/actions/connect';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ConnectFormStatus = 'idle' | 'sending' | 'confirmed' | 'error';

interface ConnectFormProps {
  arcSlug: string;
  arcId?: string;
  lang: string;
  emotionalKey?: string;
}

type SessionPayload = {
  lang?: string;
  arcSlug?: string;
  sceneId?: string;
  storyPath?: unknown;
};

export function ConnectForm({ arcSlug, arcId, lang, emotionalKey }: ConnectFormProps) {
  const [status, setStatus] = useState<ConnectFormStatus>('idle');
  const [message, setMessage] = useState('');
  const [wantsReply, setWantsReply] = useState<boolean | null>(null);
  const [replyToken, setReplyToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

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
    setStatus('confirmed');
  }

  if (status === 'confirmed') {
    return (
      <section className="space-y-4">
        <p className="text-lg" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
          A real person will read this.
        </p>

        {replyToken ? (
          <>
            <p className="leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
              If Sarah replies, you can come back here:
            </p>
            <a
              href={`/reply/${replyToken}`}
              className="inline-block text-sm underline underline-offset-4 transition-opacity hover:opacity-80"
              style={{ color: 'var(--text-primary)' }}
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
        <Button
          type="button"
          onClick={() => {
            setStatus('idle');
            setErrorMessage('');
          }}
        >
          Try again
        </Button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          What are you thinking right now?
        </label>
        <Textarea
          id="message"
          aria-required="false"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[160px] rounded-[24px] border-white/10 bg-black/15 px-5 py-4 text-base"
          placeholder="You can leave a question, a reaction, or a few honest words."
          style={{ fontFamily: 'var(--font-narrative)' }}
        />
      </div>

      <div className="rounded-[24px] border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
          If Sarah replies, do you want a private link so you can read it later?
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            size="lg"
            variant={wantsReply === true ? 'default' : 'ghost'}
            onClick={() => setWantsReply(true)}
          >
            Yes, give me a link
          </Button>
          <Button
            type="button"
            size="lg"
            variant={wantsReply === false ? 'default' : 'ghost'}
            onClick={() => setWantsReply(false)}
          >
            No, just pass it along
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        aria-label="Send my story"
        disabled={wantsReply === null || status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Send my story'}
      </Button>
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
