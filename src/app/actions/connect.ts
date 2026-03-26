'use server';

import { generateCoordinatorBrief, type BriefOutput } from '@/lib/ai-brief';
import { sendCoordinatorEmail } from '@/lib/email';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getArcBySlug, insertCommunityConnection } from '@/lib/queries';
import { mockConnectMessage } from '@/lib/mock-data';

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type SubmitConnectMessageInput = {
  arcId: string;
  lang: string;
  emotionalKey: string | null;
  message: string;
  wantsReply: boolean;
  storyPath?: string[];
};

export type SubmitConnectMessageResult = {
  success: boolean;
  replyToken: string | null;
  error?: string;
};

export async function submitConnectMessage({
  arcId,
  lang,
  emotionalKey,
  message,
  wantsReply,
  storyPath,
}: SubmitConnectMessageInput): Promise<SubmitConnectMessageResult> {
  const normalizedArcId = arcId.trim();
  const normalizedLang = lang.trim();
  const rawMessage = typeof message === 'string' ? message : '';
  const normalizedStoryPath = Array.isArray(storyPath)
    ? storyPath.filter((sceneId): sceneId is string => typeof sceneId === 'string' && sceneId.trim().length > 0)
    : [];
  const fallbackEmotionalKey = emotionalKey ?? 'searching';

  if (!normalizedArcId || !normalizedLang) {
    return { success: false, replyToken: null, error: 'Missing required fields.' };
  }

  if (!hasSupabaseConfig()) {
    try {
      await notifyCoordinator({
        emotionalKey: fallbackEmotionalKey,
        lang: normalizedLang,
        message: rawMessage,
        replyToken: mockConnectMessage.reply_token,
        storyPath: normalizedStoryPath,
      });
    } catch {
      // Coordinator notifications are best-effort.
    }

    return {
      success: true,
      replyToken: wantsReply ? mockConnectMessage.reply_token : null,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('connect_messages')
    .insert({
      arc_id: normalizedArcId,
      lang: normalizedLang,
      emotional_key: emotionalKey,
      message: rawMessage,
    })
    .select('reply_token')
    .single();

  if (error) {
    return { success: false, replyToken: null, error: 'Unable to send your message right now.' };
  }

  // Later outbound notifications (for example, Resend) should never block stored messages.
  const storedReplyToken = data?.reply_token ?? null;
  if (storedReplyToken) {
    try {
      await notifyCoordinator({
        emotionalKey: fallbackEmotionalKey,
        lang: normalizedLang,
        message: rawMessage,
        replyToken: storedReplyToken,
        storyPath: normalizedStoryPath,
      });
    } catch {
      // Coordinator notifications are best-effort.
    }
  }

  const replyToken = wantsReply ? data?.reply_token ?? null : null;

  return {
    success: true,
    replyToken,
  };
}

export type ConnectActionState = {
  success: boolean;
  error?: string;
};

export async function submitCommunityConnection(
  _prevState: ConnectActionState | null,
  formData: FormData,
): Promise<ConnectActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const lang = String(formData.get('lang') ?? '').trim();
  const arcSlug = String(formData.get('arcSlug') ?? '').trim();

  if (!name || !email || !lang || !arcSlug) {
    return { success: false, error: 'Missing required fields.' };
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Please provide a valid email.' };
  }

  const arc = await getArcBySlug(arcSlug);
  if (!arc) {
    return { success: false, error: 'Story arc not found.' };
  }

  await insertCommunityConnection({
    arc_id: arc.id,
    lang,
    name,
    email,
    city: city || undefined,
  });

  return { success: true };
}

type NotifyCoordinatorInput = {
  emotionalKey: string;
  lang: string;
  message: string;
  replyToken: string;
  storyPath: string[];
};

async function notifyCoordinator(input: NotifyCoordinatorInput) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  const replyUrl = `${appUrl}/coordinator/reply/${input.replyToken}`;

  let brief: BriefOutput | null = null;
  try {
    brief = await generateCoordinatorBrief({
      emotionalKey: input.emotionalKey,
      lang: input.lang,
      message: input.message,
      storyPath: input.storyPath,
    });
  } catch {
    brief = null;
  }

  try {
    await sendCoordinatorEmail({
      emotionalKey: input.emotionalKey,
      lang: input.lang,
      message: input.message,
      replyToken: input.replyToken,
      replyUrl,
      brief: brief ?? undefined,
    });
  } catch (error) {
    console.error('Coordinator email failed', error);
  }
}
