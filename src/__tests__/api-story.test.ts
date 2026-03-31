import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the AI SDK before importing the route
vi.mock('ai', () => ({
  streamText: vi.fn(() => ({
    toTextStreamResponse: () =>
      new Response('Once upon a time...', {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }),
  })),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(() => 'mock-model'),
}));

describe('POST /api/story', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('@/app/api/story/route');
    POST = mod.POST;
  });

  function makeRequest(body: Record<string, unknown>): Request {
    return new Request('http://localhost/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('returns 200 with valid request body', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-1',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    expect(res.status).toBe(200);
  });

  it('returns streaming text body', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-1',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    const text = await res.text();
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns required metadata headers', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-1',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    expect(res.headers.get('X-Beat-Id')).toBe('beat-grief-1');
    expect(res.headers.get('X-Is-End')).toBe('false');
    expect(res.headers.get('X-Beat-Order')).toBe('1');
    expect(res.headers.get('X-Choices')).toBeTruthy();

    const choices = JSON.parse(decodeURIComponent(res.headers.get('X-Choices')!));
    expect(Array.isArray(choices)).toBe(true);
    expect(choices.length).toBeGreaterThanOrEqual(1);
  });

  it('returns illustration headers for grief beats', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-1',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    expect(res.headers.get('X-Illustration-Url')).toBeTruthy();
    expect(res.headers.get('X-Illustration-Alt')).toBeTruthy();
  });

  it('returns X-Is-End true for the last beat', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-5',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    expect(res.headers.get('X-Is-End')).toBe('true');
  });

  it('returns empty X-Choices for end beats', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-grief-5',
        userInput: 'I lost someone close to me.',
        lang: 'en',
      }),
    );
    const choices = JSON.parse(decodeURIComponent(res.headers.get('X-Choices')!));
    expect(choices).toHaveLength(0);
  });

  it('returns 400 for missing required fields', async () => {
    const res = await POST(makeRequest({ storySlug: 'when-he-wept' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 for invalid story slug', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'nonexistent-story',
        beatId: 'beat-grief-1',
        userInput: 'test',
        lang: 'en',
      }),
    );
    expect(res.status).toBe(404);
  });

  it('returns 404 for invalid beat ID', async () => {
    const res = await POST(
      makeRequest({
        storySlug: 'when-he-wept',
        beatId: 'beat-nonexistent',
        userInput: 'test',
        lang: 'en',
      }),
    );
    expect(res.status).toBe(404);
  });
});
