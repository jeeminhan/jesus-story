'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isEmotionalKey, type EmotionalKey } from '@/lib/constants';
import { useSession } from '@/lib/useSession';
import type { SceneWithContent } from '@/lib/types';
import { ArcBackground } from './ArcBackground';
import { AmbientPlayer } from './AmbientPlayer';
import { AudioPlayer } from './AudioPlayer';
import { SceneIllustration } from './SceneIllustration';

const MOTION_DURATION: Record<EmotionalKey, number> = {
  grief: 800,
  doubt: 700,
  searching: 500,
  curiosity: 400,
  anger: 450,
};

const WORD_GROUP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const DEFAULT_MOTION_DURATION = 500;
const EMOTIONAL_LABELS: Record<EmotionalKey, string> = {
  grief: 'Grief',
  doubt: 'Doubt',
  searching: 'Searching',
  curiosity: 'Curiosity',
  anger: 'Anger',
};

interface SceneViewProps {
  scene: SceneWithContent;
  lang: string;
  arcSlug: string;
  sceneIndex?: number;
  emotionalKey?: EmotionalKey | null;
}

interface WordGroup {
  text: string;
  sequenceIndex: number;
}

function splitIntoWordGroups(paragraph: string) {
  const words = paragraph.trim().split(/\s+/).filter(Boolean);
  const groups: string[] = [];
  let wordIndex = 0;
  let groupSize = 3;

  while (wordIndex < words.length) {
    groups.push(words.slice(wordIndex, wordIndex + groupSize).join(' '));
    wordIndex += groupSize;
    groupSize = groupSize === 3 ? 4 : 3;
  }

  return groups;
}

export function SceneView({ scene, lang, arcSlug, sceneIndex = 0, emotionalKey }: SceneViewProps) {
  const router = useRouter();
  const { saveScene, clearSession } = useSession(lang, arcSlug);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textViewportRef = useRef<HTMLDivElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<EmotionalKey | null>(null);
  const [motionDurationMs, setMotionDurationMs] = useState(DEFAULT_MOTION_DURATION);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showBackPrompt, setShowBackPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [localSceneIndex, setLocalSceneIndex] = useState(sceneIndex);
  const isLightWorld = Boolean(scene.light_world);
  const hasSingleChoice = !scene.is_end && scene.choices.length === 1;
  const singleChoice = hasSingleChoice ? scene.choices[0] : null;
  const collapsedPanelHeight = hasSingleChoice ? '27vh' : '40vh';
  const collapsedGradientHeight = hasSingleChoice ? '33vh' : '46vh';
  const showChoiceList = !scene.is_end && !hasSingleChoice;
  const emotionalLabel = activeKey ? EMOTIONAL_LABELS[activeKey] ?? null : null;
  const sceneEyebrow = scene.is_end ? 'Final scene' : `Scene ${localSceneIndex + 1}`;

  const bodyParagraphs = useMemo(() => {
    let sequenceIndex = 0;
    return scene.body.split('\n\n').map((paragraph) => {
      const groups: WordGroup[] = splitIntoWordGroups(paragraph).map((text) => {
        const nextGroup = { text, sequenceIndex };
        sequenceIndex += 1;
        return nextGroup;
      });

      return groups;
    });
  }, [scene.body]);

  const saturation = Math.min(100, 15 + localSceneIndex * 42.5);

  useEffect(() => {
    titleRef.current?.focus();
  }, [scene.id]);

  useEffect(() => {
    const documentKey = document.documentElement.getAttribute('data-key');
    const resolvedKey = isEmotionalKey(documentKey) ? documentKey : emotionalKey ?? null;
    if (resolvedKey) {
      document.documentElement.setAttribute('data-key', resolvedKey);
    }

    setActiveKey(resolvedKey);
    setMotionDurationMs(resolvedKey ? MOTION_DURATION[resolvedKey] : DEFAULT_MOTION_DURATION);
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [emotionalKey, scene.id]);

  useEffect(() => {
    const documentKey = document.documentElement.getAttribute('data-key');
    saveScene(scene.id, emotionalKey ?? (isEmotionalKey(documentKey) ? documentKey : null));
  }, [emotionalKey, saveScene, scene.id]);

  useEffect(() => {
    setIsExpanded(false);
    setIsDocked(false);
  }, [scene.id]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setShowBackPrompt(true);
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    function checkOverflow() {
      const viewport = textViewportRef.current;
      const prose = proseRef.current;
      if (!viewport || !prose) {
        setHasOverflow(false);
        return;
      }

      setHasOverflow(prose.scrollHeight > viewport.clientHeight + 2);
    }

    const frameId = window.requestAnimationFrame(checkOverflow);
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [scene.id, scene.body, scene.audio_url, scene.choices.length, isExpanded]);

  function handleChoiceSelect(nextSceneId: string) {
    if (scene.is_end) {
      router.push(`/${lang}/${arcSlug}/connect`);
      return;
    }

    setLocalSceneIndex((previousIndex) => previousIndex + 1);
    const documentKey = document.documentElement.getAttribute('data-key');
    const keyForSession = activeKey ?? (isEmotionalKey(documentKey) ? documentKey : null);
    saveScene(nextSceneId, keyForSession);
    router.push(`/${lang}/${arcSlug}?scene=${nextSceneId}`);
  }

  function handleIllustrationTap() {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (!singleChoice) {
      return;
    }

    handleChoiceSelect(singleChoice.next_scene_id);
  }

  function handleStartOver() {
    clearSession();
    document.documentElement.removeAttribute('data-key');
    setShowBackPrompt(false);
    router.push(`/${lang}`);
  }

  function handlePanelExpand() {
    if (!hasSingleChoice || isExpanded || !hasOverflow || isDocked) {
      return;
    }

    setIsExpanded(true);
  }

  return (
    <div
      data-light={isLightWorld ? 'true' : undefined}
      aria-labelledby="scene-title"
      className="fixed inset-0 overflow-hidden"
      style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg)' }}
    >
      <button
        type="button"
        aria-label={isExpanded ? 'Collapse text panel' : hasSingleChoice ? 'Tap scene to continue' : 'Advance scene'}
        onClick={handleIllustrationTap}
        disabled={!singleChoice && !isExpanded}
        className={`absolute left-0 right-0 top-0 z-10 border-0 bg-transparent p-0 ${
          singleChoice || isExpanded ? 'cursor-pointer' : 'cursor-default'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]`}
        style={{ height: isDocked ? '100vh' : isExpanded ? '28vh' : '65vh' }}
      />

      <div
        role="img"
        aria-label={`${scene.title} — scene illustration`}
        className="absolute inset-0 transition-[filter] duration-500"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 50%), radial-gradient(circle at 80% 25%, var(--surface) 0%, transparent 58%), linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
          filter: activeKey === 'grief' ? `saturate(${saturation}%)` : undefined,
          zIndex: 0,
        }}
      />

      <ArcBackground emotionalKey={activeKey} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 2, background: 'rgba(0,0,0,0.25)' }}
      />

      <SceneIllustration
        emotionalKey={activeKey}
        sceneSlug={scene.slug}
        lightWorld={scene.light_world}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 3 }}
      />
      <div className="pointer-events-none absolute right-3 top-3 z-20">
        <AmbientPlayer emotionalKey={activeKey} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', opacity: isExpanded ? 1 : 0 }}
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 4,
          height: isDocked ? '0vh' : isExpanded ? '76vh' : collapsedGradientHeight,
          background: isLightWorld
            ? 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)',
        }}
      />

      {hasSingleChoice && isDocked ? (
        <button
          type="button"
          aria-label="Slide up text panel"
          onClick={() => setIsDocked(false)}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border px-3 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.16em] shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: isLightWorld ? 'rgba(15,46,40,0.16)' : 'rgba(255,255,255,0.16)',
            backgroundColor: isLightWorld ? 'rgba(255,250,244,0.72)' : 'rgba(7,6,6,0.62)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Slide up
        </button>
      ) : null}

      <motion.div
        animate={{ y: hasSingleChoice && isDocked ? '100%' : '0%' }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 34 }}
        className={`scene-text absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-4 overflow-hidden rounded-t-[30px] px-5 pb-5 pt-4 shadow-[0_-24px_60px_rgba(0,0,0,0.18)] backdrop-blur-[14px] sm:px-7 ${
          hasSingleChoice && !isExpanded && hasOverflow ? 'cursor-pointer' : ''
        }`}
        onClick={handlePanelExpand}
        style={{
          color: 'var(--text-primary)',
          height: isExpanded ? '76vh' : collapsedPanelHeight,
          overflowY: 'hidden',
          backgroundColor: isLightWorld ? 'rgba(255,250,244,0.42)' : 'rgba(7,6,6,0.38)',
          borderTop: isLightWorld ? '1px solid rgba(15,46,40,0.09)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {hasSingleChoice && hasOverflow && !isExpanded ? (
          <div className="flex justify-center">
            <button
              type="button"
              aria-label="Slide text panel down"
              onClick={(event) => {
                event.stopPropagation();
                setIsDocked(true);
              }}
              className="rounded-full px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span
                aria-hidden="true"
                className="block h-1 w-12 rounded-full"
                style={{ backgroundColor: isLightWorld ? 'rgba(15,46,40,0.18)' : 'rgba(255,255,255,0.18)' }}
              />
            </button>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div
              className="mb-2 flex flex-wrap items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.22em]"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            >
              <span>{sceneEyebrow}</span>
              {emotionalLabel ? <span aria-hidden="true">•</span> : null}
              {emotionalLabel ? <span>{emotionalLabel} path</span> : null}
            </div>

            <h1
              id="scene-title"
              ref={titleRef}
              tabIndex={-1}
              className="pr-2 text-[1.85rem] font-semibold leading-tight outline-none sm:text-3xl"
              style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}
            >
              {scene.title}
            </h1>
          </div>

          {((hasOverflow && !hasSingleChoice) || isExpanded) ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsExpanded((currentValue) => !currentValue);
                setIsDocked(false);
              }}
              aria-label={isExpanded ? 'Collapse full text' : 'Open full text'}
              className="shrink-0 rounded-full border px-2.5 py-1 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                borderColor: isLightWorld ? 'rgba(15,46,40,0.16)' : 'rgba(255,255,255,0.14)',
                backgroundColor: isLightWorld ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                opacity: 0.92,
              }}
            >
              {isExpanded ? 'Close' : 'Read'}
            </button>
          ) : null}
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={textViewportRef}
            className="min-h-0 h-full"
            style={{
              overflowY: isExpanded ? 'auto' : 'hidden',
              paddingRight: isExpanded ? '0.35rem' : undefined,
              paddingBottom: hasOverflow && !isExpanded ? '3.5rem' : undefined,
              overscrollBehavior: 'contain',
              scrollbarGutter: 'stable',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={scene.id}
                ref={proseRef}
                className="prose-story max-w-none pr-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {bodyParagraphs.map((groups, paragraphIndex) => {
                  if (!groups.length) {
                    return <p key={`${scene.id}-paragraph-${paragraphIndex}`}>&nbsp;</p>;
                  }

                  return (
                    <p key={`${scene.id}-paragraph-${paragraphIndex}`}>
                      {groups.map((group, groupIndex) => {
                        if (prefersReducedMotion) {
                          return (
                            <span key={`${scene.id}-paragraph-${paragraphIndex}-group-${groupIndex}`}>
                              {group.text}
                              {groupIndex < groups.length - 1 ? ' ' : ''}
                            </span>
                          );
                        }

                        return (
                          <motion.span
                            key={`${scene.id}-paragraph-${paragraphIndex}-group-${groupIndex}`}
                            className="inline"
                            variants={WORD_GROUP_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: group.sequenceIndex * (motionDurationMs / 1000) }}
                          >
                            {group.text}
                            {groupIndex < groups.length - 1 ? ' ' : ''}
                          </motion.span>
                        );
                      })}
                    </p>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasOverflow && !isExpanded ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
              style={{
                background: isLightWorld
                  ? 'linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%)',
              }}
            />
          ) : null}
        </div>

        {scene.audio_url ? (
          <div onClick={(event) => event.stopPropagation()}>
            <AudioPlayer audioUrl={scene.audio_url} />
          </div>
        ) : null}

        {scene.is_end || !hasSingleChoice ? (
          <div
            className="flex flex-col gap-3 border-t pt-4"
            onClick={(event) => event.stopPropagation()}
            style={{ borderColor: isLightWorld ? 'rgba(15,46,40,0.12)' : 'rgba(255,255,255,0.12)' }}
          >
            {showChoiceList ? (
              <p
                className="text-[0.7rem] font-medium uppercase tracking-[0.2em]"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
              >
                Choose a next step
              </p>
            ) : null}

            {scene.is_end ? (
              <button
                type="button"
                onClick={() => router.push(`/${lang}/${arcSlug}/connect`)}
                className="flex w-full items-center justify-between gap-4 rounded-[22px] border px-4 py-4 text-left text-base leading-relaxed transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-narrative)',
                  borderColor: isLightWorld ? 'rgba(15,46,40,0.14)' : 'rgba(255,255,255,0.14)',
                  backgroundColor: isLightWorld ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.07)',
                }}
              >
                <span className="block pr-4">I want to explore what it means to follow Jesus</span>
                <span aria-hidden="true" className="text-xl leading-none">
                  →
                </span>
              </button>
            ) : (
              scene.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoiceSelect(choice.next_scene_id)}
                  className="flex w-full items-center justify-between gap-4 rounded-[22px] border px-4 py-4 text-left text-base leading-relaxed transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-narrative)',
                    borderColor: isLightWorld ? 'rgba(15,46,40,0.14)' : 'rgba(255,255,255,0.14)',
                    backgroundColor: isLightWorld ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.07)',
                  }}
                >
                  <span className="block break-words pr-4">{choice.label}</span>
                  <span aria-hidden="true" className="text-xl leading-none">
                    →
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </motion.div>

      {showBackPrompt ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scene-back-prompt-title"
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 px-6"
        >
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/70 p-6">
            <h2
              id="scene-back-prompt-title"
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}
            >
              Leave this story?
            </h2>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowBackPrompt(false)}
                className="w-full rounded-md border border-transparent px-4 py-2 text-left text-base transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-narrative)' }}
              >
                Stay in the story
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="w-full border-0 bg-transparent px-4 py-1 text-left text-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
