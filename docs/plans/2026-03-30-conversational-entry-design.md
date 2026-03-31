# Conversational AI Entry — Design Document
**Date:** 2026-03-30
**Status:** Decisions Finalized
**Depends on:** Original design (2026-03-02-gospel-storybook-design.md)

---

## Summary

Replace the explicit language picker and emotional-doorway buttons with a single conversational entry point. The user arrives and is asked an open question. They respond freely in any language. AI reads their response to (1) detect language, (2) classify emotion, (3) select the best story arc, and (4) write one personalized bridge sentence before the pre-authored story begins.

**Core principle: The AI is the host, not the author.** AI never generates Gospel narrative, scripture interpretation, or theological claims. It reads, routes, and writes one transitional sentence. Everything else is human-authored content.

---

## Design Philosophy

The current flow asks the user to self-sort: pick a language from a grid, then pick an emotion from labeled buttons. This works, but it feels like a form. The conversational entry makes the first moment feel like the app already knows you — because you told it something real, and it listened.

### What changes

| Before | After |
|--------|-------|
| Language picker grid | AI detects language from free-text response |
| Emotional doorway buttons (grief, doubt, searching, curiosity, anger) | AI classifies emotion from response |
| Immediate jump to arc | One AI-generated bridge sentence transitions into the arc |
| Fixed 6 supported languages | Any language — AI translates story content on the fly |

### What stays the same

| Unchanged |
|-----------|
| Pre-authored story arcs, scenes, choices — all human-written |
| Scene graph structure (directed graph via choices) |
| Audio narration system |
| Community connection form |
| Supabase as content store |
| URL-based scene navigation |

---

## User Flow

```
1. User arrives at /
   Sees a minimal, warm prompt: "What are you carrying right now?"

2. User types freely
   "I feel so lost lately"
   "최근에 너무 힘들어요"
   "why"
   (any language, any length)

3. AI processes (server-side, single API call)
   → Detects language (e.g., "ko")
   → Classifies emotional key (e.g., "searching")
   → Extracts mirror phrase (the user's own words to echo back)
   → Selects best arc from the bank of stories

4. AI returns structured classification + streams bridge sentence
   Bridge example:
   "최근에 힘드셨군요. 예수님께 같은 말을 했던 사람이 있어요.
    무슨 일이 있었는지 보여드릴게요."

5. Bridge sentence streams in word-by-word (like someone speaking to you)
   After streaming completes, a "Continue" prompt leads into the story arc

6. Story proceeds as before
   Scenes, choices, audio, community connection — all existing flow
```

---

## The Four AI Layers

### Layer 1: Language Detection

AI identifies the language of the user's input. This replaces the language picker entirely.

- Output: a language code (e.g., `"ko"`, `"es"`, `"en"`)
- If the detected language matches one of the 6 pre-translated languages, use the existing translations
- If it's a new language, story content will be AI-translated on the fly (see Layer 5)

### Layer 2: Emotion Classification

AI maps the user's input to one of the defined emotional keys.

- Current keys: `grief`, `doubt`, `searching`, `curiosity`, `anger`
- Can expand to 10 as more arcs are authored
- Output: a single emotional key string
- This is classification, not generation — the AI picks from a fixed set

### Layer 3: Arc Selection

Based on the classified emotion, select the best matching arc from the story bank.

- Simple mapping for v1: one emotion → one arc (same as today's doorway buttons, but invisible)
- Future: multiple arcs per emotion, AI picks based on nuance (e.g., grief-of-loss vs. grief-of-failure)
- Output: an arc slug

### Layer 4: Bridge Sentence

The only AI-generated user-facing text. A single transitional sentence that:

- Echoes the user's own words or feeling back to them (the "mirror")
- Connects it to the story they're about to enter
- Is written in the user's detected language
- Is tightly constrained by prompt (no theology, no scripture quotes, no claims about God)

Prompt constraints for the bridge:
- Maximum 2 sentences
- Must reference the user's actual words
- Must not quote scripture or make theological claims
- Must not use churchy language (saved, sin, repent, etc.)
- Tone: warm, human, like a friend saying "I hear you, let me show you something"

---

## Layer 5: AI-Contextualized Story Generation (Skeleton Model)

**Design evolution:** Instead of pre-written scene text that gets translated, stories are now defined as **skeletons** — structured outlines with beats, guardrails, and tone guidance. The AI generates the prose at runtime, contextualized to each person's input and language. No translation tables needed.

### Story Skeletons

Each story in the database is a skeleton, not finished prose:

- **Gospel source** — the specific passage/narrative (e.g., John 11:1-44)
- **Beats** — ordered plot points that must be hit (the AI cannot skip, reorder, or invent beats)
- **Guardrails** — what the story MUST and MUST NOT convey (theological safety net)
- **Tone guidance** — how to adjust the telling based on the reader's emotional key
- **Visual anchors** — illustrations are tied to specific beats, not to specific text

### What the AI generates per beat

For each beat, the AI receives:
1. The skeleton (beat summary, detail, guardrails, tone guidance)
2. The user's original entry input (what they are carrying)
3. The detected language
4. Visual context (if an illustration is shown alongside this beat)
5. Previous beats already shown (to avoid repetition)

It generates:
- 2-4 paragraphs of lyrical prose in the user's language
- Choice labels (from choice hints) in the user's language
- Everything is streamed word-by-word to the client

### What the AI never controls

- **Beat structure** — beats are fixed in the database. The AI fills them in, it cannot change the order or skip.
- **Illustrations** — static assets tied to beats. The AI is told what the illustration shows so the prose matches.
- **Theological content** — guardrails are hard constraints enforced via system prompt. The AI tells the story; it does not interpret or apply it.

### Skeleton schema

```
stories
  id              uuid PK
  slug            text UNIQUE
  emotional_key   text
  gospel_source   text          -- "John 11:1-44"
  title           text
  tagline         text
  guardrails      text          -- MUST/MUST NOT constraints
  tone_guidance   text
  is_published    boolean

story_beats
  id                uuid PK
  story_id          uuid FK → stories
  order             int           -- sequence
  beat_summary      text          -- "Jesus weeps"
  beat_detail       text          -- fuller context for the AI
  illustration_url  text          -- static asset path (nullable)
  illustration_alt  text
  visual_context    text          -- description for AI prompt alignment
  is_start          boolean
  is_end            boolean

beat_choices
  id            uuid PK
  beat_id       uuid FK → story_beats
  next_beat_id  uuid FK → story_beats
  choice_hint   text          -- AI generates the actual label from this
  order         int
```

No `*_translations` tables. The AI generates in any language from a single English skeleton.

---

## Implementation Architecture

### New route: Conversational Entry

The home page (`/`) becomes the conversational entry. No separate language picker page. Stateless — every visit starts fresh at the prompt.

```
/ (page.tsx)
  → Minimal prompt UI: "What are you carrying right now?"
  → Text input (no language selector, no buttons)
  → On submit: two-phase server call
      Phase 1: generateText with Output.object() → { lang, emotionalKey, arcSlug }
      Phase 2: streamText → bridge sentence (streamed word-by-word to client)
  → After stream completes: "Enter the story" button → /story/[slug]?input=<encoded>&lang=<lang>
```

### Server-side: Two-phase approach

**Phase 1 — Classification (structured, not streamed):**

```ts
// Pseudocode — actual implementation will use AI SDK v6 patterns
const classification = await generateText({
  model: 'anthropic/claude-sonnet-4-6',
  messages: [{ role: 'user', content: userInput }],
  output: Output.object({
    schema: z.object({
      detectedLang: z.string(),
      emotionalKey: z.enum(['grief', 'doubt', 'searching', 'curiosity', 'anger']),
      arcSlug: z.string(),
    })
  })
});
```

**Phase 2 — Bridge sentence (streamed to client):**

```ts
const bridgeStream = streamText({
  model: 'anthropic/claude-sonnet-4-6',
  system: `Write 1-2 sentences in ${lang} that echo the user's words
           and transition into the story. No theology, no churchy language.`,
  messages: [{ role: 'user', content: userInput }],
});
return bridgeStream.toUIMessageStreamResponse();
```

Client renders the bridge sentence word-by-word using AI SDK's `useChat` or a lightweight streaming reader.

### Logging

User input, detected language, classified emotion, and selected arc are logged to Supabase for feedback and analytics:

```
entry_logs
  id            uuid PK
  user_input    text        -- the raw text the user typed
  detected_lang text        -- language code
  emotional_key text        -- classified emotion
  arc_slug      text        -- selected arc
  created_at    timestamptz
```

The system prompt provides:
- The list of available emotional keys with descriptions
- The list of available arcs with their emotional mappings
- Constraints for the bridge sentence
- Instruction to detect language from the user's input

### Server-side: Translation on demand

When serving a scene in a language not in the core 6:

1. Check `ai_translations_cache` for existing translation
2. If cache hit → return cached translation
3. If cache miss → call AI Gateway to translate the English source
4. Store in `ai_translations_cache`
5. Return translated content

This can be integrated into `src/lib/queries.ts` as a wrapper around existing query functions.

---

## Expanded Story Bank (Future)

Current: 5 arcs (grief, doubt, searching, curiosity, anger)

Target: 10 arcs. Two directions to expand:

### Option A: More emotions
Add: loneliness, shame, hope, exhaustion, joy
Each maps to a new Gospel narrative.

### Option B: Branching within emotions
Same 5 emotions, but 2 arcs each:
- grief → "When He Wept" (loss of someone) OR "The Prodigal Returns" (loss of self)
- doubt → "The Night He Answered" (intellectual doubt) OR "The One Who Touched" (experiential doubt)
- etc.

AI classification becomes more nuanced — it reads the user's words to pick the better-fitting arc within the emotion.

**Recommendation:** Start with Option A for v2 (simpler to author), evolve toward Option B as content matures.

---

## Fallback Behavior

| Scenario | Behavior |
|----------|----------|
| AI Gateway unavailable | Show a simple error state: "Something went wrong. Please try again." |
| User input is empty or nonsensical | Show a gentle follow-up: "Take your time. Even one word is enough." |
| Language detection uncertain | Default to English, offer a "Switch language" option |
| Emotion classification low-confidence | Default to "searching" (the most open-ended arc) |
| Translation cache miss + AI unavailable | Serve English content with a note |

No parallel language-picker/doorway-button UI is maintained. The conversational entry is the only path.

---

## What the AI Does and Does Not Do

### The AI generates:
1. **Bridge sentence** — personalized transitional moment from user input to story
2. **Scene prose** — lyrical narrative for each beat, contextualized to the user's input and language
3. **Choice labels** — generated from fixed choice hints, in the user's language

### The AI never:
1. **Invents story structure.** Beats, choices, and branching are fixed in the skeleton. The AI fills them in.
2. **Interprets scripture.** It tells what happened. It does not explain what it means or apply it to the reader.
3. **Makes theological claims.** No "God loves you", no "Jesus died for you."
4. **Uses churchy vocabulary.** No saved, sin, repent, salvation, born again.
5. **Generates images or SVGs.** Visual assets are designed by humans and tied to beats.
6. **Skips or reorders beats.** The plot points are non-negotiable.
7. **Adds moral lessons or applications.** The story lands on its own.

---

## Decisions Log

| Question | Decision | Date |
|----------|----------|------|
| Entry prompt wording | "What are you carrying right now?" | 2026-03-30 |
| Bridge sentence delivery | Streamed word-by-word via AI SDK streamText | 2026-03-30 |
| Re-entry behavior | Stateless — always start fresh at the prompt | 2026-03-30 |
| Logging | Yes — log user input, language, emotion, arc to Supabase `entry_logs` | 2026-03-30 |
| Fallback when AI is down | Simple error state, no parallel language picker UI | 2026-03-30 |
| Story content model | AI-generated from skeletons, not pre-written translations | 2026-03-30 |
| Translation approach | No separate translation — AI generates directly in detected language | 2026-03-30 |
| AI provider | Google Gemini 2.5 Flash via @ai-sdk/google (direct, not gateway) | 2026-03-30 |
| Illustrations | Static assets tied to beats; AI told what illustration shows via visual_context | 2026-03-30 |

## Remaining Open Questions

1. **Sharing** — if someone shares a link, does the recipient see the conversational entry or a direct story link?
2. **Caching** — should generated scenes be cached per (beat + userInput hash + lang) to reduce cost?
3. **Audio** — how does audio narration work with AI-generated text? TTS on the fly, or drop audio for now?
