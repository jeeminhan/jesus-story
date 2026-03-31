import { generateText, streamText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase';
import { EMOTIONAL_KEYS } from '@/lib/constants';

const EMOTION_ARC_MAP: Record<string, string> = {
  grief: 'when-he-wept',
  doubt: 'the-night-he-answered',
  searching: 'the-king-who-came',
  curiosity: 'come-and-see',
  anger: 'the-storm-he-stilled',
};

export async function POST(request: Request) {
  const { userInput } = (await request.json()) as { userInput: string };

  if (!userInput?.trim()) {
    return Response.json({ error: 'Empty input' }, { status: 400 });
  }

  // Phase 1: Classify — structured output, not streamed
  const classification = await generateText({
    model: google('gemini-2.5-flash'),
    system: `You are a gentle listener. A person has just shared what they are carrying.
Your job is to:
1. Detect the language they wrote in (return an ISO 639-1 code like "en", "ko", "zh", "es", "hi", "ar", "fr", "tl", etc.)
2. Classify their emotional state into exactly one of these keys: ${EMOTIONAL_KEYS.join(', ')}

Definitions:
- grief: loss, ache, mourning, something or someone is gone
- doubt: uncertainty, questioning, wanting something true enough to trust
- searching: a pull toward something more, restlessness, longing for meaning
- curiosity: open, observant, not yet convinced but willing to look
- anger: raw, loud, unresolved frustration or injustice

If the input is ambiguous, default to "searching".`,
    prompt: userInput,
    output: Output.object({
      schema: z.object({
        detectedLang: z.string().describe('ISO 639-1 language code'),
        emotionalKey: z.enum(['grief', 'doubt', 'searching', 'curiosity', 'anger']),
      }),
    }),
  });

  const { detectedLang, emotionalKey } = classification.output;
  const arcSlug = EMOTION_ARC_MAP[emotionalKey] ?? 'the-king-who-came';

  // Log to entry_logs (fire-and-forget)
  logEntry(userInput, detectedLang, emotionalKey, arcSlug);

  // Resolve start scene ID for navigation
  const startSceneId = await getStartSceneId(arcSlug, detectedLang);

  // Phase 2: Stream bridge sentence
  const bridgeStream = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are writing a single transitional moment for someone who just shared something personal.
Write 1-2 sentences in ${detectedLang} (the language they used) that:
- Echo their own words or feeling back to them gently
- Hint that there is a story about someone who experienced something similar
- Do NOT quote scripture or make theological claims
- Do NOT use religious vocabulary (saved, sin, repent, salvation, born again, etc.)
- Tone: warm, human, like a friend saying "I hear you, let me show you something"
- Maximum 2 sentences. Be brief and gentle.`,
    prompt: userInput,
  });

  const response = bridgeStream.toTextStreamResponse();

  // Attach classification data as headers so the client can read them
  const headers = new Headers(response.headers);
  headers.set('X-Detected-Lang', detectedLang);
  headers.set('X-Emotional-Key', emotionalKey);
  headers.set('X-Arc-Slug', arcSlug);
  headers.set('X-Start-Scene-Id', startSceneId ?? '');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

async function logEntry(
  userInput: string,
  detectedLang: string,
  emotionalKey: string,
  arcSlug: string,
) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = await createServerSupabaseClient();
    await supabase.from('entry_logs').insert({
      user_input: userInput,
      detected_lang: detectedLang,
      emotional_key: emotionalKey,
      arc_slug: arcSlug,
    });
  } catch {
    // Non-critical — don't break the user experience
  }
}

async function getStartSceneId(
  arcSlug: string,
  lang: string,
): Promise<string | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    const supabase = await createServerSupabaseClient();

    const { data: arc } = await supabase
      .from('arcs')
      .select('id')
      .eq('slug', arcSlug)
      .single();

    if (!arc) return null;

    const { data: scene } = await supabase
      .from('scenes')
      .select('id')
      .eq('arc_id', arc.id)
      .eq('is_start', true)
      .single();

    return scene?.id ?? null;
  } catch {
    return null;
  }
}
