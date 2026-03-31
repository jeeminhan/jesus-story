'use client';

import { useEffect, useMemo, useState } from 'react';
import { VALID_LANGS } from '@/lib/constants';
import type { SceneWithContent } from '@/lib/types';
import { SceneIllustration } from './SceneIllustration';
import { Input } from './ui/input';
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

function normalizeField(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    return '';
  }

  return normalized.length > maxLength ? normalized.slice(0, maxLength).trimEnd() : normalized;
}

function buildBridgeText(input: {
  recipientName: string;
  relationship: string;
  burden: string;
  context: string;
}) {
  const { recipientName, relationship, burden, context } = input;
  const details = [burden, context].filter(Boolean);
  if (!details.length) {
    if (!recipientName && !relationship) {
      return null;
    }

    return `${recipientName || 'Someone'} came to mind${relationship ? ` through your life as ${relationship}` : ''}.`;
  }

  const intro = recipientName ? `${recipientName} came to mind.` : 'Someone came to mind.';
  const tail = details.join(' ');
  return `${intro} ${tail}`.trim();
}

function buildShareText(input: {
  senderName: string;
  recipientName: string;
  personalNote: string;
}) {
  const { senderName, recipientName, personalNote } = input;
  const preface =
    senderName && recipientName
      ? `${senderName} thought of ${recipientName}.`
      : senderName
        ? `${senderName} thought of you.`
        : recipientName
          ? `A story for ${recipientName}.`
          : 'A story for you.';

  return personalNote ? `${preface}\n\n${personalNote}` : preface;
}

export function CardGenerator({ arcSlug, lang, scenes, emotionalKey, availableLangs }: CardGeneratorProps) {
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?.id ?? '');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [burden, setBurden] = useState('');
  const [context, setContext] = useState('');
  const [personalNote, setPersonalNote] = useState('');
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

  const normalizedSenderName = normalizeField(senderName, 48);
  const normalizedRecipientName = normalizeField(recipientName, 48);
  const normalizedRelationship = normalizeField(relationship, 60);
  const normalizedBurden = normalizeField(burden, 180);
  const normalizedContext = normalizeField(context, 180);
  const normalizedPersonalNote = normalizeField(personalNote, 200);
  const bridgeText = buildBridgeText({
    recipientName: normalizedRecipientName,
    relationship: normalizedRelationship,
    burden: normalizedBurden,
    context: normalizedContext,
  });
  const quote = selectedScene ? excerpt(selectedScene.body, 180) : 'A story for you';

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  async function copyLink(shareUrl: string, shareText: string) {
    const copyValue = shareText ? `${shareText}\n\n${shareUrl}` : shareUrl;

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setToastMessage('Unable to copy link');
      return;
    }

    try {
      await navigator.clipboard.writeText(copyValue);
      setToastMessage('Message and link copied');
      setShareState('shared');
    } catch {
      setToastMessage('Unable to copy link');
    }
  }

  async function handleShare() {
    if (!selectedScene || typeof window === 'undefined') {
      return;
    }

    const origin = window.location.origin;
    const params = new URLSearchParams({
      scene: selectedScene.id,
      card: '1',
    });

    if (normalizedSenderName) {
      params.set('sender', normalizedSenderName);
    }
    if (normalizedRecipientName) {
      params.set('recipient', normalizedRecipientName);
    }
    if (normalizedBurden) {
      params.set('burden', normalizedBurden);
    }
    if (normalizedContext) {
      params.set('context', normalizedContext);
    }
    if (normalizedPersonalNote) {
      params.set('note', normalizedPersonalNote);
    }

    const shareUrl = `${origin}/${selectedLang}/${arcSlug}?${params.toString()}`;
    const shareText = buildShareText({
      senderName: normalizedSenderName,
      recipientName: normalizedRecipientName,
      personalNote: normalizedPersonalNote,
    });
    const shareTitle = normalizedRecipientName ? `A story for ${normalizedRecipientName}` : 'A story for you';

    if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShareState('shared');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        await copyLink(shareUrl, shareText);
      }

      return;
    }

    await copyLink(shareUrl, shareText);
  }

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col gap-8 px-4 py-8 sm:px-6"
      data-emotional-key={emotionalKey ?? undefined}
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <section className="space-y-4">
        <p
          className="text-[0.68rem] uppercase tracking-[0.28em]"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
        >
          Carrier prototype
        </p>
        <h1
          className="text-[clamp(2rem,7vw,3.4rem)] leading-[0.96]"
          style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}
        >
          Make something for one person.
        </h1>
        <p
          className="max-w-2xl text-base leading-7 sm:text-lg"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
        >
          This prototype keeps the story path you chose, then helps you frame it like an act of care instead of a generic
          link.
        </p>
      </section>

      <section className="grid gap-4 rounded-[30px] border p-5 sm:grid-cols-2 sm:p-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="space-y-2">
          <label htmlFor="sender-name" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your name
          </label>
          <Input
            id="sender-name"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
            placeholder="Maya"
            maxLength={48}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="recipient-name" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Who is this for?
          </label>
          <Input
            id="recipient-name"
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            placeholder="Priya"
            maxLength={48}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="relationship" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            How do you know them?
          </label>
          <Input
            id="relationship"
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            placeholder="A close friend from grad school"
            maxLength={60}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="burden" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            What are they carrying right now?
          </label>
          <Textarea
            id="burden"
            value={burden}
            onChange={(event) => setBurden(event.target.value)}
            placeholder="She is adjusting to life in a new country and quietly carrying a lot of questions."
            maxLength={180}
            className="min-h-24"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="context" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Anything about their world this card should respect?
          </label>
          <Textarea
            id="context"
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="She grew up Hindu and I do not want this to feel like pressure."
            maxLength={180}
            className="min-h-24"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-[30px] border p-5 sm:p-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}>
            Which story moment should open the card?
          </p>
          <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}>
            The shared link still enters on an art-card surface first. The moment you choose becomes the first quoted frame.
          </p>
        </div>
        <div className="space-y-2">
          {scenes.map((scene) => {
            const isSelected = scene.id === (selectedScene?.id ?? '');
            return (
              <button
                key={scene.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedSceneId(scene.id)}
                className="w-full rounded-[24px] border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{
                  borderColor: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                <p className="text-base" style={{ fontFamily: 'var(--font-narrative)', color: 'var(--text-primary)' }}>
                  {scene.title}
                </p>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                  {excerpt(scene.body, 80)}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <label htmlFor="carrier-note" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Optional note from you
        </label>
        <Textarea
          id="carrier-note"
          maxLength={200}
          value={personalNote}
          onChange={(event) => setPersonalNote(event.target.value)}
          placeholder="I thought of you when I saw this."
          className="min-h-28"
        />
        <div className="flex items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>Shared as text and shown quietly on the card.</span>
          <span>{personalNote.length} / 200</span>
        </div>
      </section>

      <section className="space-y-2">
        <label htmlFor="share-language" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Send in language
        </label>
        <select
          id="share-language"
          value={selectedLang}
          onChange={(event) => setSelectedLang(event.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.06)',
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
        style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'var(--bg)' }}
      >
        <div className="relative h-[470px]">
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
                'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 24%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.58) 100%)',
            }}
          />
          <div className="absolute inset-x-5 top-5 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em]"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(7,6,6,0.22)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {normalizedRecipientName ? `For ${normalizedRecipientName}` : 'A story for you'}
            </span>
            {normalizedSenderName ? (
              <span
                className="rounded-full border px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.18em]"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(7,6,6,0.22)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                From {normalizedSenderName}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-5 bottom-5 space-y-3">
            {bridgeText ? (
              <p
                data-testid="share-preview-bridge"
                className="mx-auto max-w-lg text-center text-sm leading-7"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-narrative)' }}
              >
                {bridgeText}
              </p>
            ) : null}
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
            {normalizedPersonalNote ? (
              <div
                className="rounded-[24px] border px-4 py-3"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(7,6,6,0.2)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p
                  className="text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
                >
                  Note
                </p>
                <p
                  className="mt-2 text-sm leading-7"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-narrative)' }}
                >
                  {normalizedPersonalNote}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: 'var(--text-secondary)' }}>
              Share preview
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
            Cold entry card
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
            The link carries the personal framing and still opens on the art-card surface first.
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
