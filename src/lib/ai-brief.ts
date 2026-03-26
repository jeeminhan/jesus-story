// Uses Vercel AI Gateway via model string.
// Requires VERCEL_OIDC_TOKEN (from vercel env pull) or AI_GATEWAY_API_KEY.

export interface BriefInput {
  emotionalKey: string;
  lang: string;
  message: string;
  storyPath: string[];
}

export interface BriefOutput {
  toneRead: string;
  pastoralApproach: string;
  pathSummary: string;
}

function isBriefOutput(value: unknown): value is BriefOutput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.toneRead === 'string' &&
    typeof candidate.pastoralApproach === 'string' &&
    typeof candidate.pathSummary === 'string'
  );
}

function parseBriefOutput(text: string): BriefOutput | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (isBriefOutput(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback parser below handles markdown-wrapped JSON.
  }

  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    return null;
  }

  try {
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as unknown;
    return isBriefOutput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function generateCoordinatorBrief(input: BriefInput): Promise<BriefOutput | null> {
  if (!process.env.VERCEL_OIDC_TOKEN && !process.env.AI_GATEWAY_API_KEY) {
    return null;
  }

  try {
    const aiModuleName = 'ai';
    const { generateText } = (await import(aiModuleName)) as {
      generateText: (args: { model: string; prompt: string; maxTokens: number }) => Promise<{ text: string }>;
    };

    const prompt = `You are assisting a pastoral coordinator reviewing a message from someone who just engaged with a digital story.

Emotional path chosen: ${input.emotionalKey}
Language: ${input.lang}
Scenes visited: ${input.storyPath.join(' -> ') || 'unknown'}
Their message: "${input.message}"

Provide a brief pastoral briefing with three parts:
1. Tone read: a one-sentence observation about the person's emotional state based on their path and message
2. Pastoral approach: a concrete suggestion for how to open the reply (1-2 sentences)
3. Path summary: what the ${input.emotionalKey} story arc covers, briefly

Be warm, human, and concise. No jargon. No religious formulas.
Respond as JSON: { "toneRead": "...", "pastoralApproach": "...", "pathSummary": "..." }`;

    const result = await generateText({
      model: 'anthropic/claude-haiku-4-5',
      prompt,
      maxTokens: 300,
    });

    return parseBriefOutput(result.text);
  } catch {
    return null;
  }
}
