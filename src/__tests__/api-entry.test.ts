import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the AI SDK
vi.mock('ai', () => ({
  generateText: vi.fn(() =>
    Promise.resolve({
      output: {
        detectedLang: 'en',
        emotionalKey: 'grief',
      },
    }),
  ),
  streamText: vi.fn(() => ({
    toTextStreamResponse: () =>
      new Response('I hear you. Let me show you something.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }),
  })),
  Output: {
    object: vi.fn((config: unknown) => config),
  },
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(() => 'mock-model'),
}));

// Mock supabase — the route imports it
vi.mock('@/lib/supabase', () => ({
  createServerSupabaseClient: vi.fn(() =>
    Promise.resolve({
      from: () => ({
        insert: () => Promise.resolve({ error: null }),
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null }),
            }),
            single: () => Promise.resolve({ data: null }),
          }),
        }),
      }),
    }),
  ),
}));

// Mock zod — the route uses z.object / z.string / z.enum
vi.mock('zod', () => {
  const z = {
    object: vi.fn((schema: unknown) => schema),
    string: vi.fn(() => ({
      describe: vi.fn(() => 'mock-string'),
    })),
    enum: vi.fn(() => 'mock-enum'),
  };
  return { z };
});

describe('POST /api/entry', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Ensure no SUPABASE_URL so logEntry and getStartSceneId short-circuit
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const mod = await import('@/app/api/entry/route');
    POST = mod.POST;
  });

  function makeRequest(body: Record<string, unknown>): Request {
    return new Request('http://localhost/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('returns 200 with classification headers', async () => {
    const res = await POST(
      makeRequest({ userInput: 'I lost my mother last month.' }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Detected-Lang')).toBe('en');
    expect(res.headers.get('X-Emotional-Key')).toBe('grief');
    expect(res.headers.get('X-Arc-Slug')).toBe('when-he-wept');
  });

  it('returns X-Start-Scene-Id header (empty when no Supabase)', async () => {
    const res = await POST(
      makeRequest({ userInput: 'I lost my mother last month.' }),
    );
    // Without Supabase URL the header should be empty string
    expect(res.headers.has('X-Start-Scene-Id')).toBe(true);
  });

  it('returns streaming bridge sentence body', async () => {
    const res = await POST(
      makeRequest({ userInput: 'I lost my mother last month.' }),
    );
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns 400 for empty input', async () => {
    const res = await POST(makeRequest({ userInput: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for whitespace-only input', async () => {
    const res = await POST(makeRequest({ userInput: '   ' }));
    expect(res.status).toBe(400);
  });
});
