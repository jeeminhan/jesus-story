'use client';

import { FormEvent, useState } from 'react';
import { submitCoordinatorReply } from '@/app/actions/coordinator-reply';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ReplyStatus = 'idle' | 'sending' | 'sent' | 'error';

interface CoordinatorReplyFormProps {
  token: string;
}

export function CoordinatorReplyForm({ token }: CoordinatorReplyFormProps) {
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState<ReplyStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') {
      return;
    }

    setStatus('sending');
    const result = await submitCoordinatorReply(token, reply);
    setStatus(result.success ? 'sent' : 'error');
    if (result.success) {
      setReply('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="coordinator-reply" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Reply
        </label>
        <Textarea
          id="coordinator-reply"
          value={reply}
          onChange={(event) => {
            setReply(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
            }
          }}
          className="min-h-[140px]"
          placeholder="Write your private reply..."
          required
        />
      </div>

      <Button type="submit" disabled={status === 'sending' || reply.trim().length === 0}>
        {status === 'sending' ? 'Sending...' : 'Send reply'}
      </Button>

      {status === 'sent' ? (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Reply saved.
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm" role="alert" style={{ color: 'var(--text-secondary)' }}>
          Unable to save this reply right now.
        </p>
      ) : null}
    </form>
  );
}
