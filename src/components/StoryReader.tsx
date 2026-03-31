'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { StoryIllustration } from '@/components/StoryIllustration';
import { BeatIllustration } from '@/components/BeatIllustration';
import { AmbientPlayer } from '@/components/AmbientPlayer';
import { buildSystemPrompt } from '@/lib/build-system-prompt';
import { getMockStory, getMockBeat } from '@/lib/mock-skeletons';
import type { EmotionalKey } from '@/lib/constants';

type Phase = 'loading' | 'streaming' | 'ready' | 'checkin' | 'error';

interface ChoiceData {
  id: string;
  nextBeatId: string;
  hint: string;
  label: string;
}

interface StoryReaderProps {
  storySlug: string;
  userInput: string;
  lang: string;
  storyIllustration?: string | null;
  /** Demo mode: pre-filled check-in answers and optional beat limit */
  demoAnswers?: string[];
  maxBeats?: number;
}

/** Color map for prompt sections */
const SECTION_COLORS: Record<string, { header: string; text: string }> = {
  'Guardrails': { header: 'rgb(248,113,113)', text: 'rgba(248,113,113,0.7)' },       // red
  'Scripture bounds': { header: 'rgb(248,113,113)', text: 'rgba(248,113,113,0.7)' },  // red
  'The person': { header: 'rgb(147,197,253)', text: 'rgba(147,197,253,0.6)' },        // blue
  'Deeper context': { header: 'rgb(147,197,253)', text: 'rgba(147,197,253,0.6)' },    // blue
  'Writing style': { header: 'rgb(196,166,106)', text: 'rgba(196,166,106,0.6)' },     // gold
  'This beat': { header: 'rgb(134,239,172)', text: 'rgba(134,239,172,0.6)' },         // green
  'Tone guidance': { header: 'rgb(134,239,172)', text: 'rgba(134,239,172,0.6)' },     // green
  'Choice labels': { header: 'rgba(255,255,255,0.5)', text: 'rgba(255,255,255,0.3)' },
};

function getSectionColor(header: string): { header: string; text: string } {
  for (const [key, colors] of Object.entries(SECTION_COLORS)) {
    if (header.includes(key)) return colors;
  }
  return { header: 'rgba(255,255,255,0.5)', text: 'rgba(255,255,255,0.35)' };
}

/** Render a system prompt with color-coded sections */
function renderColorCodedPrompt(prompt: string) {
  // Split by ## headers
  const sections = prompt.split(/^(## .+)$/m);
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section.trim()) continue;

    if (section.startsWith('## ')) {
      // This is a header — next section is its body
      const colors = getSectionColor(section);
      const body = sections[i + 1] || '';
      i++; // skip body in next iteration

      elements.push(
        <div key={i} className="mt-3 first:mt-0">
          <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider" style={{ color: colors.header }}>
            {section.replace('## ', '')}
          </div>
          <div style={{ color: colors.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {body.trim()}
          </div>
        </div>,
      );
    } else {
      // Preamble text (before first ##)
      elements.push(
        <div key={i} style={{ color: 'rgba(255,255,255,0.45)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {section.trim()}
        </div>,
      );
    }
  }

  return elements;
}

/** Parse *italic* segments (narrator bridge) and render in UI font */
function renderParagraph(text: string) {
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        className="italic text-white/60"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function StoryReader({ storySlug, userInput, lang, storyIllustration, demoAnswers, maxBeats }: StoryReaderProps) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [sceneText, setSceneText] = useState('');
  const [choices, setChoices] = useState<ChoiceData[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [beatOrder, setBeatOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentBeatId, setCurrentBeatId] = useState<string | null>(null);
  const [checkinPrompt, setCheckinPrompt] = useState<string | null>(null);
  const [checkinInput, setCheckinInput] = useState('');
  const [showBehindScenes, setShowBehindScenes] = useState(false);
  const checkinAnswersRef = useRef<string[]>([]);
  const promptsRef = useRef<{ beatOrder: number; beatId: string; prompt: string }[]>([]);
  // The next beat to navigate to after check-in is submitted
  const pendingNextBeatRef = useRef<string | null>(null);
  const previousBeatsRef = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefetch cache — stores pre-fetched beat results keyed by beatId
  const prefetchCacheRef = useRef<Record<string, {
    text: string;
    isEnd: boolean;
    order: number;
    choices: ChoiceData[];
    beatId: string;
    checkin: string | null;
  }>>({});
  const prefetchAbortRef = useRef<AbortController | null>(null);

  // Fetch a beat's data (returns parsed result, does NOT set state)
  const fetchBeatData = useCallback(
    async (beatId: string, signal?: AbortSignal) => {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storySlug,
          beatId,
          userInput,
          lang,
          previousBeats: previousBeatsRef.current,
          checkinAnswers: checkinAnswersRef.current,
        }),
        signal,
      });

      if (!res.ok) throw new Error('Failed to generate scene');

      const end = res.headers.get('X-Is-End') === 'true';
      const order = parseInt(res.headers.get('X-Beat-Order') ?? '0', 10);
      const choiceHints = JSON.parse(decodeURIComponent(res.headers.get('X-Choices') ?? '[]')) as Array<{
        id: string;
        nextBeatId: string;
        hint: string;
      }>;
      const checkinRaw = res.headers.get('X-Checkin-Prompt');
      const checkin = checkinRaw ? decodeURIComponent(checkinRaw) : null;

      // Read entire body as text (no streaming for prefetch)
      const fullText = await res.text();
      const choiceSplit = fullText.split('---CHOICES---');
      const proseText = choiceSplit[0].trimEnd();

      let parsedChoices: ChoiceData[] = [];
      if (choiceSplit[1]) {
        const choiceLabels = choiceSplit[1]
          .trim()
          .split('\n')
          .map((line) => line.replace(/^[-•*]\s*/, '').trim())
          .filter(Boolean);

        parsedChoices = choiceHints.map((hint, i) => ({
          id: hint.id,
          nextBeatId: hint.nextBeatId,
          hint: hint.hint,
          label: choiceLabels[i] ?? hint.hint,
        }));
      }

      return { text: proseText, isEnd: end, order, choices: parsedChoices, beatId, checkin };
    },
    [storySlug, userInput, lang],
  );

  // Prefetch the first choice's beat in background
  const prefetchNextBeat = useCallback(
    (nextBeatId: string) => {
      // Cancel any existing prefetch
      prefetchAbortRef.current?.abort();
      const controller = new AbortController();
      prefetchAbortRef.current = controller;

      fetchBeatData(nextBeatId, controller.signal)
        .then((result) => {
          prefetchCacheRef.current[nextBeatId] = result;
        })
        .catch(() => {
          // Prefetch failures are silent — user will fetch normally on click
        });
    },
    [fetchBeatData],
  );

  const generateBeat = useCallback(
    async (beatId: string) => {
      // Cancel any in-flight prefetch
      prefetchAbortRef.current?.abort();

      // Check prefetch cache first
      const cached = prefetchCacheRef.current[beatId];
      if (cached) {
        delete prefetchCacheRef.current[beatId];
        setCurrentBeatId(beatId);
        setSceneText(cached.text);
        setIsEnd(cached.isEnd);
        setBeatOrder(cached.order);
        setChoices(cached.choices);
        setError(null);
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

        // Track this beat
        previousBeatsRef.current = [...previousBeatsRef.current, `Beat ${cached.order}: ${cached.text.slice(0, 100)}...`];

        // Capture the prompt for behind-the-scenes
        const story = getMockStory(storySlug);
        const beatData = getMockBeat(beatId);
        if (story && beatData) {
          promptsRef.current = [...promptsRef.current, {
            beatOrder: cached.order,
            beatId,
            prompt: buildSystemPrompt(story, beatData, userInput, lang, previousBeatsRef.current.slice(0, -1), checkinAnswersRef.current),
          }];
        }

        // Check-in: pause for a question before showing choices
        // In demo mode with maxBeats, treat reaching maxBeats as the end
        const hitMaxBeats = maxBeats && cached.order >= maxBeats;
        if (hitMaxBeats) {
          setIsEnd(true);
          setChoices([]);
          setPhase('ready');
        } else if (cached.checkin && !cached.isEnd) {
          setCheckinPrompt(cached.checkin);
          pendingNextBeatRef.current = cached.choices[0]?.nextBeatId ?? null;
          // Pre-fill check-in input in demo mode (use beat order as index)
          if (demoAnswers) {
            const answerIdx = cached.order - 1;
            if (answerIdx >= 0 && answerIdx < demoAnswers.length) {
              setCheckinInput(demoAnswers[answerIdx]);
            }
          }
          setPhase('checkin');
        } else {
          setPhase('ready');
          // Prefetch next beat if choices exist
          if (cached.choices.length > 0) {
            prefetchNextBeat(cached.choices[0].nextBeatId);
          }
        }
        return;
      }

      setPhase('loading');
      setSceneText('');
      setChoices([]);
      setIsEnd(false);
      setCurrentBeatId(beatId);
      setError(null);

      // Scroll to top of container
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        const res = await fetch('/api/story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storySlug,
            beatId,
            userInput,
            lang,
            previousBeats: previousBeatsRef.current,
            checkinAnswers: checkinAnswersRef.current,
          }),
        });

        if (!res.ok) throw new Error('Failed to generate scene');

        // Read metadata from headers
        const end = res.headers.get('X-Is-End') === 'true';
        const order = parseInt(res.headers.get('X-Beat-Order') ?? '0', 10);
        const choiceHints = JSON.parse(decodeURIComponent(res.headers.get('X-Choices') ?? '[]')) as Array<{
          id: string;
          nextBeatId: string;
          hint: string;
        }>;
        const checkinRaw = res.headers.get('X-Checkin-Prompt');
        const streamCheckin = checkinRaw ? decodeURIComponent(checkinRaw) : null;
        setIsEnd(end);
        setBeatOrder(order);

        // Stream the text
        setPhase('streaming');
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setSceneText(accumulated);
        }

        // Parse choices from the streamed text (after ---CHOICES--- marker)
        const choiceSplit = accumulated.split('---CHOICES---');
        const proseText = choiceSplit[0].trimEnd();
        setSceneText(proseText);

        // Track this beat for context in subsequent generations
        const beatSummary = res.headers.get('X-Beat-Order') ?? '';
        previousBeatsRef.current = [...previousBeatsRef.current, `Beat ${beatSummary}: ${proseText.slice(0, 100)}...`];

        // Capture the prompt for behind-the-scenes
        const storyData = getMockStory(storySlug);
        const beatMock = getMockBeat(beatId);
        if (storyData && beatMock) {
          promptsRef.current = [...promptsRef.current, {
            beatOrder: order,
            beatId,
            prompt: buildSystemPrompt(storyData, beatMock, userInput, lang, previousBeatsRef.current.slice(0, -1), checkinAnswersRef.current),
          }];
        }

        if (choiceSplit[1]) {
          const choiceLabels = choiceSplit[1]
            .trim()
            .split('\n')
            .map((line) => line.replace(/^[-•*]\s*/, '').trim())
            .filter(Boolean);

          const parsedChoices: ChoiceData[] = choiceHints.map((hint, i) => ({
            id: hint.id,
            nextBeatId: hint.nextBeatId,
            hint: hint.hint,
            label: choiceLabels[i] ?? hint.hint,
          }));
          setChoices(parsedChoices);

          // In demo mode with maxBeats, treat reaching maxBeats as the end
          const hitMaxBeats = maxBeats && order >= maxBeats;
          if (hitMaxBeats) {
            setIsEnd(true);
            setChoices([]);
            setPhase('ready');
            return;
          }

          // Check-in: pause for a question before showing choices
          if (streamCheckin && !end) {
            setCheckinPrompt(streamCheckin);
            pendingNextBeatRef.current = parsedChoices[0]?.nextBeatId ?? null;
            // Pre-fill check-in input in demo mode (use beat order as index)
            if (demoAnswers) {
              const answerIdx = order - 1;
              if (answerIdx >= 0 && answerIdx < demoAnswers.length) {
                setCheckinInput(demoAnswers[answerIdx]);
              }
            }
            setPhase('checkin');
            return;
          }

          // Prefetch the first choice's next beat
          if (parsedChoices.length > 0) {
            prefetchNextBeat(parsedChoices[0].nextBeatId);
          }
        }

        setPhase('ready');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setPhase('error');
      }
    },
    [storySlug, userInput, lang, prefetchNextBeat, fetchBeatData],
  );

  const handleCheckinSubmit = useCallback(() => {
    const trimmed = checkinInput.trim();
    if (!trimmed || !pendingNextBeatRef.current) return;
    checkinAnswersRef.current = [...checkinAnswersRef.current, trimmed];
    setCheckinInput('');
    setCheckinPrompt(null);
    // Clear prefetch cache since answers changed — regeneration needed
    prefetchCacheRef.current = {};
    generateBeat(pendingNextBeatRef.current);
  }, [checkinInput, generateBeat]);

  // Load first beat on mount
  useEffect(() => {
    // Fetch the start beat ID from mock data via a simple convention
    const startBeatId = `beat-${getEmotionFromSlug(storySlug)}-1`;
    generateBeat(startBeatId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-y-auto px-6 py-10 sm:px-8"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%), linear-gradient(180deg, #09080a 0%, #0d0a05 100%)',
      }}
    >
      <style>{`
        @keyframes scene-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes choice-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scene-enter {
          animation: scene-fade-in 0.8s ease-out both;
        }
        .choice-enter {
          animation: choice-fade-in 0.5s ease-out both;
        }
      `}</style>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        {/* Story illustration — only while loading beat 1 (before beat content appears) */}
        {storyIllustration && beatOrder <= 1 && phase === 'loading' && (
          <div className="mb-10 overflow-hidden rounded-3xl opacity-90">
            <StoryIllustration
              slug={storySlug}
              className="w-full"
              style={{ maxHeight: '340px', display: 'block' }}
            />
          </div>
        )}

        {/* Beat counter */}
        <p
          className="mb-6 text-[0.68rem] uppercase tracking-[0.28em] text-white/30"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {beatOrder > 0 ? `Scene ${beatOrder}` : 'Beginning'}
        </p>

        {/* Beat-level illustration — inline SVG for animations */}
        {currentBeatId && phase !== 'loading' && (
          <div className="scene-enter mb-8 overflow-hidden rounded-2xl" key={`ill-${currentBeatId}`}>
            <BeatIllustration
              slug={storySlug}
              beatId={currentBeatId}
              className="w-full opacity-80"
              style={{ maxHeight: '240px', display: 'block' }}
            />
          </div>
        )}

        {/* Loading state */}
        {phase === 'loading' && (
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/70" />
            <p
              className="text-base text-white/50"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              {beatOrder === 0 ? 'The story is finding its voice...' : 'Continuing...'}
            </p>
          </div>
        )}

        {/* Scene text */}
        {(phase === 'streaming' || phase === 'ready' || phase === 'checkin') && (
          <div className="scene-enter flex flex-col gap-8" key={`scene-${currentBeatId}`}>
            <div
              className="max-w-xl text-[clamp(1.05rem,3vw,1.25rem)] leading-[1.85] text-white/85"
              style={{ fontFamily: 'var(--font-narrative)' }}
            >
              {sceneText.split('\n\n').map((paragraph, i) => (
                <p key={i} className={i > 0 ? 'mt-5' : ''}>
                  {renderParagraph(paragraph)}
                </p>
              ))}
              {phase === 'streaming' && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white/50" />
              )}
            </div>

            {/* Choices */}
            {phase === 'ready' && choices.length > 0 && (
              <div className="mt-4 grid gap-3">
                {choices.map((choice, i) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => generateBeat(choice.nextBeatId)}
                    className="choice-enter group relative overflow-hidden rounded-2xl border px-5 py-4 text-left text-base transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(196,166,106,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    style={{
                      animationDelay: `${i * 120}ms`,
                      borderColor: 'rgba(255,255,255,0.1)',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                      fontFamily: 'var(--font-narrative)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}

            {/* Check-in question */}
            {phase === 'checkin' && checkinPrompt && (
              <div className="scene-enter mt-6 flex flex-col gap-5">
                <div
                  className="h-px w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(196,166,106,0.15), transparent)' }}
                />
                <p
                  className="max-w-lg text-base leading-7 text-white/70"
                  style={{ fontFamily: 'var(--font-narrative)' }}
                >
                  {checkinPrompt}
                </p>
                <textarea
                  value={checkinInput}
                  onChange={(e) => setCheckinInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCheckinSubmit();
                    }
                  }}
                  placeholder=""
                  rows={2}
                  autoFocus
                  className="w-full resize-none rounded-2xl border bg-transparent px-5 py-4 text-base leading-7 text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  style={{
                    borderColor: 'rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-narrative)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleCheckinSubmit}
                  disabled={!checkinInput.trim()}
                  className="choice-enter inline-flex w-fit items-center gap-2 rounded-full border px-6 py-3 text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(196,166,106,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-30"
                  style={{
                    color: 'var(--text-primary)',
                    borderColor: 'rgba(255,255,255,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-narrative)',
                  }}
                >
                  Continue the story
                </button>
              </div>
            )}

            {/* End state */}
            {phase === 'ready' && isEnd && (
              <div className="scene-enter mt-10 flex flex-col gap-6">
                <div
                  className="h-px w-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(196,166,106,0.2), transparent)' }}
                />
                <p
                  className="text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/30"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {getTitleFromSlug(storySlug)}
                </p>
                <p
                  className="text-center text-base leading-7 text-white/45"
                  style={{ fontFamily: 'var(--font-narrative)' }}
                >
                  The story pauses here. But it doesn&apos;t have to end.
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="/new"
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      fontFamily: 'var(--font-narrative)',
                    }}
                  >
                    Share something new
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      previousBeatsRef.current = [];
                      prefetchCacheRef.current = {};
                      checkinAnswersRef.current = [];
                      promptsRef.current = [];
                      setShowBehindScenes(false);
                      const beatId = `beat-${getEmotionFromSlug(storySlug)}-1`;
                      generateBeat(beatId);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--font-narrative)',
                    }}
                  >
                    Read again
                  </button>
                </div>

                {/* Behind the scenes */}
                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => setShowBehindScenes(!showBehindScenes)}
                    className="mx-auto flex items-center gap-2 text-xs text-white/25 transition-colors hover:text-white/50"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    <span className="transition-transform duration-200" style={{ transform: showBehindScenes ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      &#9654;
                    </span>
                    Behind the scenes
                  </button>

                  {showBehindScenes && (
                    <div className="mt-6 flex flex-col gap-8">
                      <div className="flex flex-col gap-3">
                        <h3
                          className="text-sm font-medium text-white/50"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          How this works
                        </h3>
                        <p
                          className="text-sm leading-6 text-white/35"
                          style={{ fontFamily: 'var(--font-narrative)' }}
                        >
                          This app takes what you shared and sends it to an AI (Gemini 2.5 Flash) along with a carefully constructed system prompt. The AI generates each scene of the story in real-time, personalized to your words. Below are the actual prompts sent for each beat of your story.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3
                          className="text-sm font-medium text-white/50"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          Your input
                        </h3>
                        <p
                          className="rounded-xl border px-4 py-3 text-sm leading-6 text-white/60"
                          style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-narrative)' }}
                        >
                          &ldquo;{userInput}&rdquo;
                        </p>
                      </div>

                      {checkinAnswersRef.current.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3
                            className="text-sm font-medium text-white/50"
                            style={{ fontFamily: 'var(--font-ui)' }}
                          >
                            Your check-in answers
                          </h3>
                          {checkinAnswersRef.current.map((answer, i) => (
                            <p
                              key={i}
                              className="rounded-xl border px-4 py-3 text-sm leading-6 text-white/60"
                              style={{ borderColor: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-narrative)' }}
                            >
                              {i + 1}. &ldquo;{answer}&rdquo;
                            </p>
                          ))}
                        </div>
                      )}

                      {promptsRef.current.map((p) => (
                        <div key={p.beatId} className="flex flex-col gap-3">
                          <h3
                            className="text-sm font-medium text-white/50"
                            style={{ fontFamily: 'var(--font-ui)' }}
                          >
                            Scene {p.beatOrder} — System Prompt
                          </h3>
                          <div
                            className="overflow-x-auto rounded-xl border px-4 py-3 text-xs leading-5"
                            style={{
                              borderColor: 'rgba(255,255,255,0.08)',
                              backgroundColor: 'rgba(255,255,255,0.02)',
                              fontFamily: 'var(--font-ui)',
                            }}
                          >
                            {renderColorCodedPrompt(p.prompt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {phase === 'error' && (
          <div className="flex flex-col gap-4">
            <p className="text-base text-red-400/80" style={{ fontFamily: 'var(--font-ui)' }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                const beatId = `beat-${getEmotionFromSlug(storySlug)}-1`;
                generateBeat(beatId);
              }}
              className="inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                fontFamily: 'var(--font-narrative)',
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Ambient music */}
      <div className="fixed bottom-6 right-6 z-50">
        <AmbientPlayer emotionalKey={getEmotionFromSlug(storySlug) as EmotionalKey} />
      </div>
    </main>
  );
}

function getTitleFromSlug(slug: string): string {
  const map: Record<string, string> = {
    'when-he-wept': 'When He Wept',
    'the-night-he-answered': 'The Night He Answered',
    'the-king-who-came': 'The King Who Came',
    'come-and-see': 'Come and See',
    'the-storm-he-stilled': 'The Storm He Stilled',
  };
  return map[slug] ?? '';
}

// Map story slugs to emotion keys for mock beat ID convention
function getEmotionFromSlug(slug: string): string {
  const map: Record<string, string> = {
    'when-he-wept': 'grief',
    'the-night-he-answered': 'doubt',
    'the-king-who-came': 'searching',
    'come-and-see': 'curiosity',
    'the-storm-he-stilled': 'anger',
  };
  return map[slug] ?? 'searching';
}
