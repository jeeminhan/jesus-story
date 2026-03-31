import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { getMockBeat, getMockStory } from '@/lib/mock-skeletons';
import { buildSystemPrompt } from '@/lib/build-system-prompt';

interface GenerateRequest {
  storySlug: string;
  beatId: string;
  userInput: string;
  lang: string;
  previousBeats?: string[];
  checkinAnswers?: string[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateRequest;
  const { storySlug, beatId, userInput, lang, previousBeats = [], checkinAnswers = [] } = body;

  if (!storySlug || !beatId || !userInput) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Load story and beat (mock data for now, Supabase later)
  const story = getMockStory(storySlug);
  const beat = getMockBeat(beatId);

  if (!story || !beat) {
    return Response.json({ error: 'Story or beat not found' }, { status: 404 });
  }

  const systemPrompt = buildSystemPrompt(story, beat, userInput, lang, previousBeats, checkinAnswers);

  const stream = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    prompt: `Generate the scene for beat ${beat.order}: "${beat.beat_summary}"`,
  });

  const response = stream.toTextStreamResponse();

  // Send beat metadata as headers
  const headers = new Headers(response.headers);
  headers.set('X-Beat-Id', beat.id);
  headers.set('X-Is-End', String(beat.is_end));
  headers.set('X-Beat-Order', String(beat.order));

  // Send choices as JSON header (URI-encoded to avoid non-ASCII ByteString errors)
  const choiceData = beat.choices.map((c) => ({
    id: c.id,
    nextBeatId: c.next_beat_id,
    hint: c.choice_hint,
  }));
  headers.set('X-Choices', encodeURIComponent(JSON.stringify(choiceData)));

  if (beat.illustration_url) {
    headers.set('X-Illustration-Url', beat.illustration_url);
    headers.set('X-Illustration-Alt', encodeURIComponent(beat.illustration_alt ?? ''));
  }

  if (beat.checkin_prompt) {
    headers.set('X-Checkin-Prompt', encodeURIComponent(beat.checkin_prompt));
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

