'use client';

import { useCallback, useEffect, useState } from 'react';
import type { EmotionalKey } from './constants';

const SESSION_KEY = 'gs_session';

interface SessionPayload {
  sessionId: string;
  lang: string;
  arcSlug: string;
  sceneId: string;
  storyPath: string[];
  emotionalKey: EmotionalKey | null;
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useSession(lang: string, arcSlug: string) {
  const [savedSceneId, setSavedSceneId] = useState<string | null>(null);

  useEffect(() => {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      setSavedSceneId(null);
      return;
    }

    try {
      const parsed = JSON.parse(rawSession) as Partial<SessionPayload>;
      const matchesArc = parsed.lang === lang && parsed.arcSlug === arcSlug;
      const parsedSceneId = typeof parsed.sceneId === 'string' ? parsed.sceneId : null;
      setSavedSceneId(matchesArc ? parsedSceneId : null);
    } catch {
      setSavedSceneId(null);
    }
  }, [lang, arcSlug]);

  const saveScene = useCallback(
    (sceneId: string, emotionalKey: EmotionalKey | null) => {
      const rawSession = window.localStorage.getItem(SESSION_KEY);

      let sessionId = createSessionId();
      let existingStoryPath: string[] = [];
      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession) as Partial<SessionPayload>;
          if (typeof parsed.sessionId === 'string' && parsed.sessionId.length > 0) {
            sessionId = parsed.sessionId;
          }
          if (
            parsed.lang === lang &&
            parsed.arcSlug === arcSlug &&
            Array.isArray(parsed.storyPath) &&
            parsed.storyPath.every((value) => typeof value === 'string')
          ) {
            existingStoryPath = parsed.storyPath;
          }
        } catch {
          sessionId = createSessionId();
          existingStoryPath = [];
        }
      }

      const storyPath =
        existingStoryPath.length > 0 && existingStoryPath[existingStoryPath.length - 1] === sceneId
          ? existingStoryPath
          : [...existingStoryPath, sceneId];

      const payload: SessionPayload = {
        sessionId,
        lang,
        arcSlug,
        sceneId,
        storyPath,
        emotionalKey,
      };

      window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
      setSavedSceneId(sceneId);
    },
    [lang, arcSlug],
  );

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSavedSceneId(null);
  }, []);

  return { savedSceneId, saveScene, clearSession };
}
