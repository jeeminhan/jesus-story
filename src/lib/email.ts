import type { BriefOutput } from './ai-brief';

type ResendClient = {
  emails: {
    send: (args: { from: string; to: string; subject: string; html: string }) => Promise<unknown>;
  };
};

let resendClientPromise: Promise<ResendClient | null> | null = null;

export interface CoordinatorEmailData {
  emotionalKey: string;
  lang: string;
  message: string;
  replyToken: string;
  replyUrl: string;
  brief?: BriefOutput;
}

async function getResendClient(): Promise<ResendClient | null> {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  if (!resendClientPromise) {
    resendClientPromise = (async () => {
      try {
        const moduleName = 'resend';
        const resendModule = (await import(moduleName)) as { Resend: new (apiKey: string) => ResendClient };
        return new resendModule.Resend(process.env.RESEND_API_KEY as string);
      } catch {
        return null;
      }
    })();
  }

  return resendClientPromise;
}

export async function sendCoordinatorEmail(data: CoordinatorEmailData): Promise<void> {
  const resend = await getResendClient();
  if (!resend) {
    console.log('[mock] coordinator email would be sent:', data);
    return;
  }

  const to = process.env.COORDINATOR_EMAIL ?? 'coordinator@example.com';
  const subject = `New message - ${data.emotionalKey} path (${data.lang})`;
  const escapedEmotionalKey = escapeHtml(data.emotionalKey);
  const escapedLang = escapeHtml(data.lang);
  const escapedMessage = escapeHtml(data.message);
  const escapedReplyUrl = escapeHtml(data.replyUrl);
  const escapedBriefTone = data.brief ? escapeHtml(data.brief.toneRead) : '';
  const escapedBriefApproach = data.brief ? escapeHtml(data.brief.pastoralApproach) : '';
  const escapedBriefPath = data.brief ? escapeHtml(data.brief.pathSummary) : '';

  const briefHtml = data.brief
    ? `
      <div style="margin-top: 24px; padding: 16px; background: #1a1508; border-radius: 8px;">
        <p style="font-size: 13px; color: #c4a87a; margin-bottom: 8px; font-family: sans-serif;">AI briefing</p>
        <p><strong>Tone:</strong> ${escapedBriefTone}</p>
        <p><strong>Suggested approach:</strong> ${escapedBriefApproach}</p>
        <p><strong>Path context:</strong> ${escapedBriefPath}</p>
      </div>
    `
    : '';

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0d0a05; color: #f5ede0;">
      <h2 style="font-size: 18px; font-weight: normal; margin-bottom: 16px; color: #c4832a;">New message received</h2>
      <p style="margin-bottom: 8px;"><strong>Path:</strong> ${escapedEmotionalKey}</p>
      <p style="margin-bottom: 8px;"><strong>Language:</strong> ${escapedLang}</p>
      <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
      <blockquote style="border-left: 2px solid #c4832a; margin: 0 0 16px 0; padding: 8px 16px; color: #f5ede0; font-style: italic;">${escapedMessage}</blockquote>
      <p style="margin-bottom: 16px;">To reply privately, visit:</p>
      <a href="${escapedReplyUrl}" style="display: inline-block; padding: 10px 20px; background: #c4832a; color: #0d0a05; text-decoration: none; border-radius: 6px; font-family: sans-serif;">Reply to this message</a>
      ${briefHtml}
      <p style="margin-top: 24px; font-size: 12px; color: #c4a87a; font-family: sans-serif;">The reply link is private and expires only when used.</p>
    </div>
  `;

  await resend.emails.send({ from: 'noreply@gospel-story.app', to, subject, html });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
