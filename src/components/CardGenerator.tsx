'use client';

import { useEffect, useMemo, useState } from 'react';
import { VALID_LANGS } from '@/lib/constants';
import type { SceneWithContent } from '@/lib/types';
import { SceneIllustration } from './SceneIllustration';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  hi: 'Hindi',
  ko: 'Korean',
  ar: 'Arabic',
};

interface CardGeneratorProps {
  arcSlug: string;
  lang: string;
  scenes: SceneWithContent[];
  emotionalKey?: string | null;
  availableLangs?: string[];
}

type ShareState = 'idle' | 'shared';

function excerpt(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function CardGenerator({ arcSlug, lang, scenes, emotionalKey, availableLangs }: CardGeneratorProps) {
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?.id ?? '');
  const [note, setNote] = useState('');
  const [selectedLang, setSelectedLang] = useState(lang);
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0] ?? null,
    [scenes, selectedSceneId],
  );

  const languageOptions = useMemo(
    () =>
      Array.from(new Set([...(availableLangs?.length ? availableLangs : [lang, ...VALID_LANGS]), lang])).filter(Boolean),
    [availableLangs, lang],
  );
  const trimmedNote = note.trim();
  const quote = selectedScene ? excerpt(selectedScene.body, 180) : 'A story for you';

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  async function copyLink(shareUrl: string) {
    const copyValue = trimmedNote ? `${trimmedNote}\n\n${shareUrl}` : shareUrl;

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setToastMessage('Unable to copy link');
      return;
    }

    try {
      await navigator.clipboard.writeText(copyValue);
      setToastMessage(trimmedNote ? 'Message and link copied' : 'Link copied');
      setShareState('shared');
    } catch (_error) {
      setToastMessage('Unable to copy link');
    }
  }

  async function handleShare() {
    if (!selectedScene || typeof window === 'undefined') {
      return;
    }

    const origin = window.location.origin;
    const shareUrl = `${origin}/${selectedLang}/${arcSlug}?scene=${encodeURIComponent(selectedScene.id)}&card=1`;
    const ogUrl = `${origin}/api/og?arc=${encodeURIComponent(arcSlug)}&lang=${encodeURIComponent(selectedLang)}&scene=${encodeURIComponent(
      selectedScene.id,
    )}`;

    void ogUrl;

    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'A story for you', text: trimmedNote || undefined, url: shareUrl });
        setShareState('shared');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        await copyLink(shareUrl);
      }

      return;
    }

    await copyLink(shareUrl);
  }

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-8 px-4 py-8 sm:px-6"
      data-emotional-key={emotionalKey ?? undefined}
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <section className="space-y-3">
        <h1 className="text-3xl leading-tight" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
          Choose a moment
        </h1>
        <div className="space-y-2">
          {scenes.map((scene) => {
            const isSelected = scene.id === (selectedScene?.id ?? '');
            return (
              <button
                key={scene.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedSceneId(scene.id)}
                className="w-full rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  borderColor: isSelected ? 'var(--accent)' : 'var(--surface)',
                  backgroundColor: isSelected ? 'var(--surface)' : 'transparent',
                }}
              >
                <p className="text-base" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
                  {scene.title}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {excerpt(scene.body, 60)}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <label htmlFor="carrier-note" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Add a personal note (optional)
        </label>
        <Textarea
          id="carrier-note"
          maxLength={200}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Write a short note..."
          className="min-h-28"
        />
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          shared as text, not printed on the card
        </p>
        {note.length >= 160 ? (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {note.length} / 200
          </p>
        ) : null}
      </section>

      <section className="space-y-2">
        <label htmlFor="share-language" className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Send in language:
        </label>
        <select
          id="share-language"
          value={selectedLang}
          onChange={(event) => setSelectedLang(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: 'var(--surface)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
          }}
        >
          {languageOptions.map((languageCode) => (
            <option key={languageCode} value={languageCode}>
              {LANGUAGE_LABELS[languageCode] ?? languageCode.toUpperCase()}
            </option>
          ))}
        </select>
      </section>

      <section
        aria-live="polite"
        className="overflow-hidden rounded-[28px] border"
        style={{ borderColor: 'var(--surface)', backgroundColor: 'var(--bg)' }}
      >
        <div className="relative h-[420px]">
          {selectedScene ? (
            <SceneIllustration
              emotionalKey={emotionalKey ?? null}
              sceneSlug={selectedScene.slug}
              lightWorld={selectedScene.light_world}
              className="absolute inset-0"
            />
          ) : null}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.58) 100%)',
            }}
          />
          <div className="absolute inset-x-5 bottom-5">
            <blockquote
              className="rounded-[28px] border px-5 py-4 text-[1.05rem] italic leading-[1.65]"
              style={{
                fontFamily: 'var(--font-narrative)',
                color: 'var(--text-primary)',
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(7,6,6,0.22)',
                backdropFilter: 'blur(14px)',
              }}
            >
              {quote}
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              Live preview
            </p>
            <p
              data-testid="share-preview-title"
              className="mt-1 text-sm"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
            >
              {selectedScene?.title ?? 'A story for you'}
            </p>
          </div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
            Quote only
          </p>
        </div>
      </section>

      {shareState === 'idle' ? (
        <Button type="button" onClick={handleShare}>
          Share this card
        </Button>
      ) : (
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--surface)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Card shared
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            You can share it again anytime.
          </p>
          <button
            type="button"
            onClick={() => setShareState('idle')}
            className="mt-3 border-0 bg-transparent p-0 text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Share again
          </button>
        </div>
      )}

      {toastMessage ? (
        <p
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md px-3 py-2 text-sm"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          {toastMessage}
        </p>
      ) : null}
    </main>
  );
}
