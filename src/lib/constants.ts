export const VALID_LANGS = ['en', 'zh', 'es', 'hi', 'ko', 'ar'] as const;
export const EMOTIONAL_KEYS = ['grief', 'doubt', 'searching', 'curiosity', 'anger'] as const;
export const EMOTIONAL_ENTRY_KEYS = EMOTIONAL_KEYS;
export type EmotionalKey = (typeof EMOTIONAL_KEYS)[number];
export type EmotionalEntryKey = EmotionalKey;

export function isValidLang(lang: string) {
  return VALID_LANGS.includes(lang as (typeof VALID_LANGS)[number]);
}

export function isEmotionalKey(value: string | null | undefined): value is EmotionalKey {
  return EMOTIONAL_KEYS.includes(value as EmotionalKey);
}
