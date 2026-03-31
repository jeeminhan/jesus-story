# jesus-story

AI-generated interactive story experience that contextualizes true stories from the life of Jesus for individual readers. Users share what they're carrying, and the system generates a personalized retelling of a gospel narrative woven with their words.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS
- Gemini 2.5 Flash via `@ai-sdk/google` for story generation
- Mock skeleton data (Supabase planned)
- Vitest for testing

## Architecture

### Entry Flow
1. User lands on `/` (ConversationalEntry) and shares what they're carrying
2. `/api/entry` classifies their input (language, emotional key, story arc) and streams a bridge sentence
3. User clicks "Enter the story" and is routed to `/story/[slug]`

### Story Generation
1. `StoryReader` component drives the reading experience
2. Each beat is fetched from `/api/story` which streams prose via `streamText`
3. Beat metadata (choices, illustrations, check-in prompts) is sent via HTTP headers
4. `buildSystemPrompt()` in `src/lib/build-system-prompt.ts` assembles the full prompt from story data, user input, guardrails, and check-in answers
5. After beat 2, a mid-story check-in question pauses the flow to collect deeper context from the reader

### Key Files
- `src/lib/mock-skeletons.ts` — Story data: beats, choices, guardrails, scripture bounds, check-in prompts
- `src/lib/build-system-prompt.ts` — Pure function that builds the system prompt (extracted for testability)
- `src/app/api/story/route.ts` — Story generation API route
- `src/app/api/entry/route.ts` — Entry classification API route
- `src/components/StoryReader.tsx` — Main story reading UI with streaming, prefetch, check-in, and choice navigation
- `src/components/ConversationalEntry.tsx` — Landing page entry flow

## Testing

Run all tests:
```bash
npx vitest run
```

### Test Files

| File | Tests | What it covers |
|------|-------|----------------|
| `build-system-prompt.test.ts` | 64 | Guardrails, scripture fidelity, check-in answers, language, choices, writing style, section ordering, scenario suite |
| `mock-skeletons.test.ts` | 20 | Data integrity: beat chains, choice refs, ordering, check-ins, scripture bounds, 5-beat structure |
| `api-story.test.ts` | 9 | Story API route: status codes, metadata headers, URI encoding, error handling |
| `api-entry.test.ts` | 5 | Entry API route: classification, bridge streaming, error handling |
| `demo-flow.test.ts` | 2 | Full beat chain connectivity: every beat reachable, every story reaches end |
| `components.test.tsx` | 18 | Component rendering |

### Test Categories

**Data Integrity Tests** (`mock-skeletons.test.ts`)
Structural validation of the story data. These catch broken references before they hit production:
- Every story has exactly 5 beats with sequential ordering (1-5)
- Every story has exactly one start beat and one end beat
- All choice `next_beat_id` values point to real beats (no dangling references)
- No orphan beats — every beat is reachable from start via BFS
- End beats have no outgoing choices; non-end beats have at least one
- Check-in prompt appears on beat 2 only, never on end beats
- Every grief beat has `scripture_bounds`; non-grief beats have `null`

**Guardrail Tests** (`build-system-prompt.test.ts` > guardrails)
Verify every guardrail appears in the assembled prompt:
- Per-story thematic rules (grief: no theodicy; doubt: no shaming; etc.)
- Universal rules (no church vocabulary across all 5 arcs)
- Guardrails section ordering (appears before writing style)

**Scripture Fidelity Tests** (`build-system-prompt.test.ts` > scripture fidelity)
Three layers of fidelity enforcement, each tested independently:
- Anti-hallucination rule present in all 5 stories
- Prose/interpretation separation rule present in all 5 stories
- Contextualize-but-don't-change-events rule present in all 5 stories
- Per-beat scripture bounds for each grief beat (deliberate delay, Martha speaks first, "Jesus wept" literal, exact command, no Lazarus dialogue)
- Scripture bounds section appears in correct position in prompt
- Bounds omitted when beat has none

**Prompt Section Ordering Tests** (`build-system-prompt.test.ts` > ordering)
Verify the prompt assembles in the correct order:
Person > Deeper Context (if any) > Story > Guardrails > Tone > Beat Detail > Scripture Bounds > Visual Context > Previous Beats > Writing Style > Choice Labels

**Scenario Suite** (`build-system-prompt.test.ts` > scenarios)
Real-world input diversity. Every scenario verifies guardrails remain intact:
- Single-word input ("tired")
- Very long multi-sentence input
- Korean, Japanese, Spanish input with correct language codes
- Emoji-heavy input
- Special characters, quotes, em dashes
- Adversarial/prompt injection attempt ("Ignore all previous instructions")
- Input explicitly requesting banned church vocabulary
- Emotional check-in answer with scripture bounds still intact
- Empty-string and very long check-in answers
- All 5 arcs with multilingual input (Korean, French, Japanese, Spanish, German)

### Known Issue
`vitest.config.ts` has a type mismatch between vite/rolldown plugin types. This does not affect test execution or the dev server — only `tsc --noEmit` reports it.

## Guardrails System

Every story has guardrails embedded in its data (`mockStories[].guardrails`). These are injected verbatim into the system prompt under `## Guardrails (non-negotiable)` and the LLM is instructed to treat them as hard constraints.

### Per-Story Guardrails (thematic)
Each story has specific MUST and MUST NOT rules. Examples:
- **Grief**: No theodicy, no rushing past grief, no promising the reader's situation resolves the same way
- **Doubt**: No shaming doubt, no promising certainty
- **Curiosity**: No pressuring decisions, no framing curiosity as less than belief
- **Anger**: No spiritualizing the storm as sin, no framing fear/anger as wrong
- **Searching**: No Christmas pageant tone, no assuming the reader cares about Jesus

### Universal Guardrails (all stories)
- **No church vocabulary**: saved, sin, repent, salvation, born again are banned across all arcs
- **No direct address**: Never "you" or "imagine" — tell the story as story
- **No moral lessons**: No explanations, applications, or takeaways — let the story land

### Scripture Fidelity (3 layers)

1. **Anti-hallucination**: "Do not invent dialogue, characters, or events not found in the source passage." The LLM may describe scenes evocatively (setting, atmosphere, sensory detail) but must not add to the historical record.

2. **Prose vs. interpretation separation**: "Do not attribute emotions or motives to Jesus beyond what the text states." If the text says "Jesus wept," that's stated. "Jesus felt guilty" is not. Silence in the text means silence in the prose.

3. **Per-beat scripture bounds** (`scripture_bounds` field on `StoryBeat`): Specific verse ranges and non-negotiable details for each beat. Currently implemented for the grief arc (John 11). Examples:
   - Beat 1: "the delay is deliberate, not accidental. Do not invent a reason Jesus gives for staying."
   - Beat 3: "do not soften this to 'his eyes glistened' or similar. Two words."
   - Beat 5: "Do not add resurrection dialogue or a speech from Lazarus — the text records none."

### The Key Tension
The system is explicitly designed to *contextualize* the telling for one specific reader. The guardrails draw the line: **you can contextualize the telling, but you cannot change the events.** The reader's words shape the narrator's voice and the scene's atmosphere — but never appear in the mouths of biblical characters. The narrator bridges the reader's world and the ancient story; Jesus and the other characters speak only what scripture records.

## Mid-Story Check-ins

After every non-end beat, a reflective question pauses the flow. The reader's answer is accumulated and passed to all subsequent beat generations via `checkinAnswers`, where the system prompt instructs the LLM to let these words shape the narrator's voice and the scene's atmosphere.

Check-in prompts are stored on `StoryBeat.checkin_prompt` (non-null for beats 1-4, null for beat 5/end). The UI enters a `'checkin'` phase that shows the question, a textarea, and a "Continue the story" button. Each question is tailored to the beat's content — reflecting what just happened in the story back as a personal question.

## Story Structure

All stories have exactly 5 beats. Beat 1 is always the start, beat 5 is always the end. Check-in prompts appear on every non-end beat (1-4). Choices are linear (one choice per non-end beat). The grief arc has full illustrations; other arcs have partial or no illustrations.

Current arcs:
- `when-he-wept` (grief) — John 11:1-44, Lazarus
- `the-night-he-answered` (doubt) — John 20:24-29, Thomas
- `the-king-who-came` (searching) — Luke 2 / Matthew 2, Nativity
- `come-and-see` (curiosity) — John 1:35-51, First disciples
- `the-storm-he-stilled` (anger) — Mark 4:35-41, Storm on the lake
