# Gospel Story

An AI-powered, interactive gospel experience for people with no church background. Readers share what they're carrying — grief, doubt, anger, curiosity, searching — and the app generates a personalized retelling of a Jesus story woven with their words.

Each story is told in 5 beats with painterly illustrations, ambient music, and mid-story check-ins that deepen the connection. The narrator draws parallels between the reader's experience and what Jesus went through — without projecting emotions onto biblical characters or putting words in their mouths.

## How It Works

1. **Entry** — The reader shares what they're carrying (any language, any length)
2. **Classification** — The system detects their language, emotional key, and routes them to the right story arc
3. **Story** — 5 beats of AI-generated prose, streamed in real time, contextualized to their words
4. **Check-ins** — After each beat, a reflective question collects deeper context that shapes subsequent beats
5. **Behind the scenes** — After the story ends, readers can see the actual AI prompts that generated each beat

## Story Arcs

| Arc | Emotion | Source | Story |
|-----|---------|--------|-------|
| When He Wept | Grief | John 11:1-44 | Lazarus |
| The Night He Answered | Doubt | John 20:24-29 | Thomas |
| The King Who Came | Searching | Luke 2 / Matthew 2 | Nativity |
| Come and See | Curiosity | John 1:35-51 | First disciples |
| The Storm He Stilled | Anger | Mark 4:35-41 | Storm on the lake |

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Gemini 2.5 Flash via `@ai-sdk/google` |
| Database | Mock skeleton data (Supabase planned) |
| Unit Tests | Vitest (117 tests) |
| E2E Tests | Playwright |

## Quick Start

```bash
npm install
cp .env.example .env.local   # add your GOOGLE_GENERATIVE_AI_API_KEY
npm run dev                   # http://localhost:3000
```

No API key? The app still runs — the entry page and demo work, but story generation requires the Gemini key.

## Routes

| Path | What it does |
|------|-------------|
| `/` | Project overview with links to mockup, live app, and AI experience |
| `/new` | Conversational entry — "What are you carrying right now?" |
| `/demo` | Pre-filled grief demo (3 beats, skips typing) |
| `/story/[slug]` | AI story reader with streaming, check-ins, and choices |
| `/[lang]` | Original arc selection (legacy flow) |
| `/[lang]/[arc]` | Original scene reader (legacy flow) |

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npx vitest run       # Unit tests (117 tests)
npm run test:e2e     # Playwright E2E tests
npm run seed         # Seed Supabase database
```

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `src/components/ConversationalEntry.tsx` | Entry flow with emotional classification and ambient music |
| `src/components/StoryReader.tsx` | Beat-by-beat reader with streaming, check-ins, choices, and prompt display |
| `src/lib/build-system-prompt.ts` | Pure function that assembles the AI prompt from story data + user input |
| `src/lib/mock-skeletons.ts` | Story data: 5 arcs with beats, choices, guardrails, scripture bounds |
| `src/app/api/entry/route.ts` | Classifies input (language, emotion, arc) and streams a bridge sentence |
| `src/app/api/story/route.ts` | Streams AI-generated beat prose with metadata in headers |

### Prompt Assembly

`buildSystemPrompt()` composes the system prompt in this order:

> Person > Deeper Context > Story > Guardrails > Tone > Beat Detail > Scripture Bounds > Visual Context > Previous Beats > Writing Style > Choice Labels

Each section is only included when relevant (e.g., scripture bounds only for beats that have them, deeper context only after check-in answers exist).

## Guardrails

Every story has hard constraints injected into the system prompt. The AI is not free to say anything — it operates within strict boundaries.

### Thematic (per-story)

- **Grief** — No theodicy, no rushing past grief, no promising the reader's situation resolves the same way
- **Doubt** — No shaming doubt, no promising certainty
- **Curiosity** — No pressuring decisions, no framing curiosity as less than belief
- **Anger** — No spiritualizing the storm as sin, no framing fear/anger as wrong
- **Searching** — No Christmas pageant tone, no assuming the reader cares about Jesus

### Universal (all stories)

- **No church vocabulary** — saved, sin, repent, salvation, born again are banned
- **No moral lessons** — No explanations, applications, or takeaways
- **The narrator carries the reader's voice** — Biblical characters speak only what scripture records

### Scripture Fidelity

Three layers enforced in every prompt:

1. **Anti-hallucination** — No invented dialogue, characters, or events
2. **No projected emotions** — If the text says "Jesus wept," that's what happened. "Jesus felt guilty" is invention.
3. **Per-beat scripture bounds** — Specific verse ranges and non-negotiable details (e.g., "do not soften 'Jesus wept' to 'his eyes glistened'")

### The Key Tension

The system contextualizes the telling for one specific reader. The guardrails draw the line: **you can contextualize the telling, but you cannot change the events.** The reader's words shape the narrator's voice — but never appear in the mouths of biblical characters.

## Testing

117 tests across 6 files:

| File | Tests | Coverage |
|------|------:|----------|
| `build-system-prompt.test.ts` | 64 | Guardrails, scripture fidelity, narrator voice, multilingual scenarios, adversarial inputs |
| `mock-skeletons.test.ts` | 20 | Beat chains, choice refs, ordering, check-ins, scripture bounds |
| `components.test.tsx` | 18 | Component rendering |
| `api-story.test.ts` | 9 | Story API: status codes, headers, error handling |
| `api-entry.test.ts` | 5 | Entry API: classification, streaming, errors |
| `demo-flow.test.ts` | 2 | Full beat chain connectivity across all arcs |

The scenario suite tests real-world input diversity: single words, long paragraphs, Korean/Japanese/Spanish, emoji, special characters, and prompt injection attempts — verifying guardrails remain intact in every case.

## Documentation

- [docs/index.md](./docs/index.md) — Master index
- [docs/architecture.md](./docs/architecture.md) — Architecture and design decisions
- [docs/data-models.md](./docs/data-models.md) — Database schema
- [docs/component-inventory.md](./docs/component-inventory.md) — UI components
- [docs/development-guide.md](./docs/development-guide.md) — Full dev setup guide
