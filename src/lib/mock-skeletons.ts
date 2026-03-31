// Mock skeleton data for AI-generated story system.
// Used when Supabase is not connected (same pattern as mock-data.ts).

export interface Story {
  id: string;
  slug: string;
  emotional_key: string;
  gospel_source: string;
  title: string;
  tagline: string;
  guardrails: string;
  tone_guidance: string;
  is_published: boolean;
}

export interface StoryBeat {
  id: string;
  story_id: string;
  order: number;
  beat_summary: string;
  beat_detail: string;
  illustration_url: string | null;
  illustration_alt: string | null;
  visual_context: string | null;
  is_start: boolean;
  is_end: boolean;
  // If set, a reflective question is shown after this beat before continuing.
  // The user's answer is fed into subsequent beat generation for deeper personalization.
  checkin_prompt: string | null;
  // Specific scripture verses this beat covers and non-negotiable historical details.
  // Used to enforce factual fidelity to the source text.
  scripture_bounds: string | null;
}

export interface BeatChoice {
  id: string;
  beat_id: string;
  next_beat_id: string;
  choice_hint: string;
  order: number;
}

export interface BeatWithChoices extends StoryBeat {
  choices: BeatChoice[];
}

export interface StoryWithBeats extends Story {
  beats: BeatWithChoices[];
}

// ─── Stories ───

export const mockStories: Story[] = [
  {
    id: 'story-grief',
    slug: 'when-he-wept',
    emotional_key: 'grief',
    gospel_source: 'John 11:1-44',
    title: 'When He Wept',
    tagline: 'A story for the ache that stays after the room goes quiet.',
    guardrails: `MUST convey: Jesus was moved by grief. He did not stay distant. He entered the pain.
MUST convey: The delay was not indifference.
MUST convey: Jesus wept — he sat in the grief before he acted.
MUST NOT: Explain why God allows suffering. No theodicy.
MUST NOT: Promise the reader's situation will resolve the same way.
MUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).
MUST NOT: Rush past the grief to get to the miracle.
SCRIPTURE FIDELITY: Do not invent dialogue, characters, or events not found in the source passage (${'{'}gospel_source{'}'}). You may describe the scene evocatively — setting, atmosphere, sensory detail — but never add to the historical record.
SCRIPTURE FIDELITY: Do not attribute emotions or motives to Jesus beyond what the text states. "Jesus wept" (John 11:35) is stated. "Jesus felt guilty" is not. If the text is silent, you are silent.
SCRIPTURE FIDELITY: You may contextualize the telling (weaving the reader's words into the prose) but you must not change the events, sequence, or people involved.`,
    tone_guidance: `For grief/loss: Sit in the ache. Let beats about the delay and the weeping breathe. Do not rush to resolution.
For doubt: Emphasize Martha's confrontation — she is angry and that is allowed.
For searching: Emphasize the mystery of why he waited and the surprise of what happened next.`,
    is_published: true,
  },
  {
    id: 'story-doubt',
    slug: 'the-night-he-answered',
    emotional_key: 'doubt',
    gospel_source: 'John 20:24-29',
    title: 'The Night He Answered',
    tagline: 'A story for the person who needs more than slogans.',
    guardrails: `MUST convey: Thomas was not punished for doubting. Jesus came to him.
MUST convey: Honest questions are not the opposite of faith.
MUST convey: Jesus invited Thomas to touch and see — he met the doubt with evidence, not rebuke.
MUST NOT: Shame doubt or frame it as weakness.
MUST NOT: Promise certainty. The story is about being met in the question.
MUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).
SCRIPTURE FIDELITY: Do not invent dialogue, characters, or events not found in the source passage (${'{'}gospel_source{'}'}). You may describe the scene evocatively — setting, atmosphere, sensory detail — but never add to the historical record.
SCRIPTURE FIDELITY: Do not attribute emotions or motives to Jesus beyond what the text states. If the text is silent, you are silent.
SCRIPTURE FIDELITY: You may contextualize the telling (weaving the reader's words into the prose) but you must not change the events, sequence, or people involved.`,
    tone_guidance: `For doubt: Let Thomas be the hero. His honesty is what opens the door.
For grief: Thomas' doubt is also grief — he lost his friend and cannot believe it was reversed.
For anger: Thomas is frustrated. Everyone else saw, and he didn't. That's not fair.`,
    is_published: true,
  },
  {
    id: 'story-searching',
    slug: 'the-king-who-came',
    emotional_key: 'searching',
    gospel_source: 'Luke 2:1-20, Matthew 2:1-12',
    title: 'The King Who Came',
    tagline: 'A story about a rescue no one expected.',
    guardrails: `MUST convey: The king came quietly — not with power, but as a baby in an occupied territory.
MUST convey: He was found by outsiders first — shepherds, foreign astrologers. Not the religious establishment.
MUST convey: The search itself mattered. The magi traveled a long way on incomplete information.
MUST NOT: Make this feel like a Christmas pageant. This is a subversive political story.
MUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).
MUST NOT: Assume the reader already cares about Jesus.
SCRIPTURE FIDELITY: Do not invent dialogue, characters, or events not found in the source passage (${'{'}gospel_source{'}'}). You may describe the scene evocatively — setting, atmosphere, sensory detail — but never add to the historical record.
SCRIPTURE FIDELITY: Do not attribute emotions or motives to Jesus beyond what the text states. If the text is silent, you are silent.
SCRIPTURE FIDELITY: You may contextualize the telling (weaving the reader's words into the prose) but you must not change the events, sequence, or people involved.`,
    tone_guidance: `For searching: Emphasize the journey. The magi followed a star without knowing where it led.
For curiosity: Emphasize the surprise — a king born in a feeding trough, announced to shepherds.
For doubt: Emphasize the gap between expectation and reality — this is not the rescue anyone imagined.`,
    is_published: true,
  },
  {
    id: 'story-curiosity',
    slug: 'come-and-see',
    emotional_key: 'curiosity',
    gospel_source: 'John 1:35-51',
    title: 'Come and See',
    tagline: 'A story for the person who is open, observant, and not yet convinced.',
    guardrails: `MUST convey: Jesus' first words to his future followers were an invitation, not a command.
MUST convey: "Come and see" — the invitation is to look, not to commit.
MUST convey: Philip's response to Nathanael's skepticism was not an argument. It was the same invitation.
MUST NOT: Pressure the reader toward a decision.
MUST NOT: Frame curiosity as less than full belief.
MUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).
SCRIPTURE FIDELITY: Do not invent dialogue, characters, or events not found in the source passage (${'{'}gospel_source{'}'}). You may describe the scene evocatively — setting, atmosphere, sensory detail — but never add to the historical record.
SCRIPTURE FIDELITY: Do not attribute emotions or motives to Jesus beyond what the text states. If the text is silent, you are silent.
SCRIPTURE FIDELITY: You may contextualize the telling (weaving the reader's words into the prose) but you must not change the events, sequence, or people involved.`,
    tone_guidance: `For curiosity: Keep it light and invitational. The whole story is about looking.
For searching: Emphasize that the disciples were already looking for something when they found him.
For doubt: Nathanael is skeptical — "Can anything good come from Nazareth?" Let that stand.`,
    is_published: true,
  },
  {
    id: 'story-anger',
    slug: 'the-storm-he-stilled',
    emotional_key: 'anger',
    gospel_source: 'Mark 4:35-41',
    title: 'The Storm He Stilled',
    tagline: 'A story for the noise inside you when everything feels too much.',
    guardrails: `MUST convey: The disciples were terrified and angry — "Don't you care that we're drowning?"
MUST convey: Jesus was asleep. That matters. He was not anxious.
MUST convey: He spoke to the storm directly. "Quiet. Be still."
MUST NOT: Spiritualize the storm as a metaphor for sin.
MUST NOT: Frame the disciples' fear or anger as wrong.
MUST NOT: Use church vocabulary (saved, sin, repent, salvation, born again).
MUST NOT: Promise the reader's storm will be calmed the same way.
SCRIPTURE FIDELITY: Do not invent dialogue, characters, or events not found in the source passage (${'{'}gospel_source{'}'}). You may describe the scene evocatively — setting, atmosphere, sensory detail — but never add to the historical record.
SCRIPTURE FIDELITY: Do not attribute emotions or motives to Jesus beyond what the text states. If the text is silent, you are silent.
SCRIPTURE FIDELITY: You may contextualize the telling (weaving the reader's words into the prose) but you must not change the events, sequence, or people involved.`,
    tone_guidance: `For anger: Let the disciples' accusation land. They are furious. That fury is honest.
For grief: The storm is the chaos after loss. Everything is loud and nothing makes sense.
For searching: The question at the end — "Who is this?" — is the real point.`,
    is_published: true,
  },
];

// ─── Beats ───

export const mockBeats: StoryBeat[] = [
  // ── When He Wept (grief) — 5 beats, check-in after every non-end beat ──
  {
    id: 'beat-grief-1',
    story_id: 'story-grief',
    order: 1,
    beat_summary: 'The urgent message and the unexplained delay.',
    beat_detail: 'Mary and Martha send an urgent message: "Lord, the one you love is sick." They expect Jesus to come immediately. But he stays where he is for two more days. From the sisters\' perspective, the one person who could help is choosing not to come. The silence stretches.',
    illustration_url: '/beat-illustrations/when-he-wept/beat-1.svg',
    illustration_alt: 'A figure hurrying along a road while two women watch from a doorway.',
    visual_context: 'A messenger hurries down a road. Two women stand in a doorway watching. The road ahead is long and empty.',
    is_start: true,
    is_end: false,
    checkin_prompt: 'The sisters sent an urgent message and then waited in silence. Have you ever waited for help that didn\u2019t come when you expected it?',
    scripture_bounds: 'John 11:1-6. Lazarus is sick. Sisters send word to Jesus. Jesus stays two more days. Non-negotiable: the delay is deliberate, not accidental. Do not invent a reason Jesus gives for staying.',
  },
  {
    id: 'beat-grief-2',
    story_id: 'story-grief',
    order: 2,
    beat_summary: 'Jesus arrives too late. Martha confronts him.',
    beat_detail: 'By the time Jesus reaches Bethany, Lazarus has been dead four days. The house is full of mourners. Martha goes out to meet him on the road and says: "Lord, if you had been here, my brother would not have died." She is grieving and direct. Jesus does not correct her.',
    illustration_url: '/beat-illustrations/when-he-wept/beat-3.svg',
    illustration_alt: 'A lone figure approaching a house full of mourners, then two figures facing each other.',
    visual_context: 'A figure walks a long road toward a house of mourners. Then two figures face each other — one leaning forward in confrontation, the other standing open and steady.',
    is_start: false,
    is_end: false,
    checkin_prompt: 'Martha told Jesus exactly what she felt. If you could say one honest thing to someone right now, what would it be?',
    scripture_bounds: 'John 11:17-27. Lazarus dead four days. Martha meets Jesus on the road: "Lord, if you had been here, my brother would not have died." Non-negotiable: Martha speaks first and is direct. Jesus does not rebuke her. Do not invent additional dialogue beyond what John records.',
  },
  {
    id: 'beat-grief-3',
    story_id: 'story-grief',
    order: 3,
    beat_summary: 'Jesus weeps.',
    beat_detail: 'When Jesus sees Mary weeping, and the people with her weeping, he is deeply moved. He asks where they have laid Lazarus. And then: Jesus wept. The shortest verse. Two words. He did not explain. He did not theologize. He cried.',
    illustration_url: '/beat-illustrations/when-he-wept/beat-5.svg',
    illustration_alt: 'A figure with head bowed and tears falling, surrounded by others in grief.',
    visual_context: 'A central figure stands with head bowed, tears falling. Around him, other figures grieve — hunched, quiet. Weighted silence.',
    is_start: false,
    is_end: false,
    checkin_prompt: 'Jesus didn\u2019t explain or fix anything. He just cried. When was the last time someone sat in your pain with you instead of trying to fix it?',
    scripture_bounds: 'John 11:33-35. Jesus sees Mary and others weeping. He is "deeply moved in spirit and troubled." He asks where Lazarus is laid. "Jesus wept." Non-negotiable: the text says he wept — do not soften this to "his eyes glistened" or similar. Two words. Do not add internal monologue.',
  },
  {
    id: 'beat-grief-4',
    story_id: 'story-grief',
    order: 4,
    beat_summary: 'At the tomb. The call into the dark.',
    beat_detail: 'Jesus comes to the tomb — a cave sealed by a heavy stone. He says "Take away the stone." Martha hesitates: "Lord, by this time there is a bad odor." The finality of death presses in. Then Jesus cries out: "Lazarus, come out!" The words carry into the darkness. Everything holds still.',
    illustration_url: '/beat-illustrations/when-he-wept/beat-7.svg',
    illustration_alt: 'A figure with arms raised, calling into a dark cave.',
    visual_context: 'A figure stands at an open cave mouth, arms raised, calling. Sound ripples carry into the darkness. The crowd behind is frozen.',
    is_start: false,
    is_end: false,
    checkin_prompt: 'Jesus called into the darkness even when it seemed too late. Is there something in your life that feels too far gone?',
    scripture_bounds: 'John 11:38-43. Jesus comes to the tomb (a cave with a stone). He says "Take away the stone." Martha objects about the smell. Jesus cries out "Lazarus, come out!" Non-negotiable: the command is spoken aloud into the tomb. Do not add extra words to the command.',
  },
  {
    id: 'beat-grief-5',
    story_id: 'story-grief',
    order: 5,
    beat_summary: 'Lazarus walks out. The story breathes.',
    beat_detail: 'From the darkness, a figure appears — wrapped head to foot in burial linen, Lazarus walks out. Jesus says "Take off the grave clothes and let him go." The wrappings fall. Underneath — a living man. The story does not end with a sermon. It ends with sisters holding a brother they buried. With a God who wept before he acted. It breathes.',
    illustration_url: '/beat-illustrations/when-he-wept/beat-10.svg',
    illustration_alt: 'A figure standing free in warm light, surrounded by others in embrace.',
    visual_context: 'A single figure stands free, bathed in warm golden light. Around him, figures embrace. The scene is still, warm, and full.',
    is_start: false,
    is_end: true,
    checkin_prompt: null,
    scripture_bounds: 'John 11:44. Lazarus comes out, wrapped in burial linen. Jesus says "Take off the grave clothes and let him go." Non-negotiable: Lazarus walks out still wrapped. The unwrapping is a separate act. Do not add resurrection dialogue or a speech from Lazarus — the text records none.',
  },

  // ── The Night He Answered (doubt) — 5 beats ──
  {
    id: 'beat-doubt-1',
    story_id: 'story-doubt',
    order: 1,
    beat_summary: 'Jesus has been killed. The disciples are hiding.',
    beat_detail: 'The man they followed for three years is dead. The disciples are locked in a room, afraid. Everything they believed in was just executed publicly.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: true, is_end: false, checkin_prompt: 'The disciples locked themselves in a room because everything they believed in just died. Have you ever had something you trusted completely fall apart?', scripture_bounds: null,
  },
  {
    id: 'beat-doubt-2',
    story_id: 'story-doubt',
    order: 2,
    beat_summary: 'Jesus appears to the disciples. Thomas is not there.',
    beat_detail: 'Jesus appears in the locked room. The disciples are overjoyed. But Thomas was not present. He missed it.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: false,
    checkin_prompt: 'Thomas missed the moment everyone else had. What is something you wish you could see for yourself before believing it?',
    scripture_bounds: null,
  },
  {
    id: 'beat-doubt-3',
    story_id: 'story-doubt',
    order: 3,
    beat_summary: 'Thomas refuses to believe without evidence.',
    beat_detail: '"Unless I see the nail marks in his hands and put my finger where the nails were, I will not believe." Thomas is not being difficult. He is being honest. Everyone else saw. He did not.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A man apart from a group, arms crossed, face set with stubborn honesty.',
    is_start: false, is_end: false, checkin_prompt: 'Thomas said he would not believe unless he could see and touch for himself. What would it take for you to trust something you can\u2019t fully see?', scripture_bounds: null,
  },
  {
    id: 'beat-doubt-4',
    story_id: 'story-doubt',
    order: 4,
    beat_summary: 'A week later, Jesus comes back for Thomas.',
    beat_detail: 'Jesus appears again. This time Thomas is there. Jesus walks directly to him and says: "Put your finger here; see my hands." He did not scold. He showed up. Again. For the one who asked.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'Two figures face to face, one extending open hands toward the other.',
    is_start: false, is_end: false, checkin_prompt: 'Jesus came back specifically for the one person who wasn\u2019t sure. Has anyone ever come back for you when you were the one pulling away?', scripture_bounds: null,
  },
  {
    id: 'beat-doubt-5',
    story_id: 'story-doubt',
    order: 5,
    beat_summary: 'Thomas responds.',
    beat_detail: 'Thomas says: "My Lord and my God." The text does not say whether he touched the wounds. It only records what he said. The doubt did not disappear in the face of proof. It transformed into recognition.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: true, checkin_prompt: null, scripture_bounds: null,
  },

  // ── The King Who Came (searching) — 5 beats ──
  {
    id: 'beat-searching-1',
    story_id: 'story-searching',
    order: 1,
    beat_summary: 'The world is under occupation. People are waiting for a king.',
    beat_detail: 'Israel is occupied by Rome. Centuries of prophecy have pointed toward a coming king. Everyone is looking. No one knows what to look for.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: true, is_end: false, checkin_prompt: 'Everyone in this story is waiting for something. What are you waiting for right now?', scripture_bounds: null,
  },
  {
    id: 'beat-searching-2',
    story_id: 'story-searching',
    order: 2,
    beat_summary: 'The king arrives as a baby in a feeding trough.',
    beat_detail: 'A young woman gives birth in a borrowed space. The baby is placed in a manger. No palace, no army, no announcement to the powerful.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A dim interior with a small figure laid in a rough stone trough, warm light.',
    is_start: false, is_end: false,
    checkin_prompt: 'The rescue looked nothing like anyone expected. What kind of help are you hoping for right now?',
    scripture_bounds: null,
  },
  {
    id: 'beat-searching-3',
    story_id: 'story-searching',
    order: 3,
    beat_summary: 'Shepherds are told first. Not priests, not kings.',
    beat_detail: 'The announcement goes to shepherds, night-shift workers, low status, ritually unclean. They are terrified. Then they are told: the one you have been waiting for is here. Go look.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: false, checkin_prompt: 'The news went to the people no one would have chosen. Have you ever felt like you were the last person who would be picked for something important?', scripture_bounds: null,
  },
  {
    id: 'beat-searching-4',
    story_id: 'story-searching',
    order: 4,
    beat_summary: 'Foreign astrologers follow a star across the desert.',
    beat_detail: 'Magi, scholars from the east, not Jewish, not part of the story, see something in the sky and follow it. They travel months on incomplete information. They bring gifts fit for a king and find a child.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'Figures traveling across a vast landscape under a bright point of light.',
    is_start: false, is_end: false, checkin_prompt: 'The magi traveled a long way on incomplete information. Have you ever followed something you couldn\u2019t fully explain?', scripture_bounds: null,
  },
  {
    id: 'beat-searching-5',
    story_id: 'story-searching',
    order: 5,
    beat_summary: 'The rescue has begun, and almost no one notices.',
    beat_detail: 'The king the world was waiting for is here. He is tiny, vulnerable, born into poverty under an empire. The rescue looks nothing like anyone expected. And that is the point.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: true, checkin_prompt: null, scripture_bounds: null,
  },

  // ── Come and See (curiosity) — 5 beats ──
  {
    id: 'beat-curiosity-1',
    story_id: 'story-curiosity',
    order: 1,
    beat_summary: 'Two disciples of John are standing nearby when Jesus walks past.',
    beat_detail: 'John the Baptist points at Jesus and says "Look, the Lamb of God." Two of John\'s disciples hear this and start following Jesus. They are curious. They do not yet know what they are looking for.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: true, is_end: false, checkin_prompt: 'These two started following someone without really knowing why. Have you ever been drawn to something you couldn\u2019t quite explain?', scripture_bounds: null,
  },
  {
    id: 'beat-curiosity-2',
    story_id: 'story-curiosity',
    order: 2,
    beat_summary: 'Jesus turns and asks: "What do you want?"',
    beat_detail: 'Jesus notices them following and turns around. His first words are a question, not a statement. "What do you want?" They do not answer the question. They ask where he is staying.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A figure turned toward two others on a path, open posture, no urgency.',
    is_start: false, is_end: false,
    checkin_prompt: 'Jesus asked them: "What do you want?" If someone asked you that right now, what would you say?',
    scripture_bounds: null,
  },
  {
    id: 'beat-curiosity-3',
    story_id: 'story-curiosity',
    order: 3,
    beat_summary: 'Jesus says: "Come and see."',
    beat_detail: 'Three words. Not "believe first." Not "here is what you must do." Just: come and see. They spend the rest of the day with him. The text does not record what was said. Only that they stayed.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: false, checkin_prompt: 'The invitation was just "come and see" \u2014 no commitment required. What would make you willing to look closer at something?', scripture_bounds: null,
  },
  {
    id: 'beat-curiosity-4',
    story_id: 'story-curiosity',
    order: 4,
    beat_summary: 'Philip finds Nathanael. Nathanael is skeptical.',
    beat_detail: 'Philip goes to find Nathanael and tells him they have found the one Moses wrote about. Nathanael\'s response: "Nazareth! Can anything good come from there?" Philip does not argue. He says: "Come and see."',
    illustration_url: null, illustration_alt: null,
    visual_context: 'Two figures in conversation, one gesturing forward, the other skeptical.',
    is_start: false, is_end: false, checkin_prompt: 'Nathanael was skeptical \u2014 "Can anything good come from there?" What is something you\u2019re skeptical about right now?', scripture_bounds: null,
  },
  {
    id: 'beat-curiosity-5',
    story_id: 'story-curiosity',
    order: 5,
    beat_summary: 'Nathanael comes. Jesus already knows him.',
    beat_detail: 'When Nathanael approaches, Jesus says "Here is a true Israelite, in whom there is nothing false." Nathanael is startled. "How do you know me?" The encounter is personal before it is theological. Jesus saw him before he came looking.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: true, checkin_prompt: null, scripture_bounds: null,
  },

  // ── The Storm He Stilled (anger) — 5 beats ──
  {
    id: 'beat-anger-1',
    story_id: 'story-anger',
    order: 1,
    beat_summary: 'Jesus and the disciples get in a boat to cross the lake.',
    beat_detail: 'After a long day, Jesus tells the disciples to cross to the other side of the lake. They get in the boat. He falls asleep in the stern.',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: true, is_end: false, checkin_prompt: 'They got in the boat because he told them to. And then the storm hit. Have you ever done the right thing and had it go badly?', scripture_bounds: null,
  },
  {
    id: 'beat-anger-2',
    story_id: 'story-anger',
    order: 2,
    beat_summary: 'A massive storm hits. The boat is swamping.',
    beat_detail: 'A furious squall comes up. Waves are breaking over the boat. Water is pouring in. These are experienced fishermen and they are terrified. The situation is out of their control.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A small boat in violent dark waves, figures bracing against the storm.',
    is_start: false, is_end: false,
    checkin_prompt: 'The disciples are drowning and the one person who could help is asleep. What feels out of control in your life right now?',
    scripture_bounds: null,
  },
  {
    id: 'beat-anger-3',
    story_id: 'story-anger',
    order: 3,
    beat_summary: 'Jesus is asleep. The disciples are furious.',
    beat_detail: 'While the boat is filling with water, Jesus is asleep on a cushion in the stern. The disciples wake him and shout: "Teacher, don\'t you care if we drown?" This is not a polite request. It is an accusation.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A figure sleeping calmly while others around him are panicked, water crashing.',
    is_start: false, is_end: false, checkin_prompt: '"Don\u2019t you care?" is one of the most honest things a person can say. Who or what have you wanted to say that to?', scripture_bounds: null,
  },
  {
    id: 'beat-anger-4',
    story_id: 'story-anger',
    order: 4,
    beat_summary: 'Jesus speaks to the storm. It stops.',
    beat_detail: 'Jesus gets up and says to the wind and waves: "Quiet! Be still!" The wind dies down. The water goes flat. Complete calm. He speaks to the chaos the way you would speak to something that answers to you.',
    illustration_url: null, illustration_alt: null,
    visual_context: 'A figure standing in a boat with one hand raised, the water suddenly flat.',
    is_start: false, is_end: false, checkin_prompt: 'The storm stopped. Just like that. What would it feel like if the loudest thing in your life suddenly went quiet?', scripture_bounds: null,
  },
  {
    id: 'beat-anger-5',
    story_id: 'story-anger',
    order: 5,
    beat_summary: 'The disciples are left with a question.',
    beat_detail: 'Jesus turns to them: "Why are you so afraid? Do you still have no faith?" But the disciples are not comforted. They are terrified in a new way. They whisper to each other: "Who is this? Even the wind and the waves obey him."',
    illustration_url: null, illustration_alt: null, visual_context: null,
    is_start: false, is_end: true, checkin_prompt: null, scripture_bounds: null,
  },
];

// ─── Choices ───

export const mockBeatChoices: BeatChoice[] = [
  // Grief: linear 5-beat flow
  { id: 'choice-grief-1', beat_id: 'beat-grief-1', next_beat_id: 'beat-grief-2', choice_hint: 'Wait with the sisters', order: 0 },
  { id: 'choice-grief-2', beat_id: 'beat-grief-2', next_beat_id: 'beat-grief-3', choice_hint: 'Stay and watch', order: 0 },
  { id: 'choice-grief-3', beat_id: 'beat-grief-3', next_beat_id: 'beat-grief-4', choice_hint: 'Follow him to the tomb', order: 0 },
  { id: 'choice-grief-4', beat_id: 'beat-grief-4', next_beat_id: 'beat-grief-5', choice_hint: 'Listen', order: 0 },

  // Doubt: linear with one branch
  { id: 'choice-doubt-1', beat_id: 'beat-doubt-1', next_beat_id: 'beat-doubt-2', choice_hint: 'Stay in the locked room', order: 0 },
  { id: 'choice-doubt-2', beat_id: 'beat-doubt-2', next_beat_id: 'beat-doubt-3', choice_hint: 'Find Thomas', order: 0 },
  { id: 'choice-doubt-3a', beat_id: 'beat-doubt-3', next_beat_id: 'beat-doubt-4', choice_hint: 'Wait and see if Jesus comes back', order: 0 },
  { id: 'choice-doubt-4', beat_id: 'beat-doubt-4', next_beat_id: 'beat-doubt-5', choice_hint: 'Watch what Thomas does', order: 0 },

  // Searching: linear
  { id: 'choice-search-1', beat_id: 'beat-searching-1', next_beat_id: 'beat-searching-2', choice_hint: 'Look closer', order: 0 },
  { id: 'choice-search-2', beat_id: 'beat-searching-2', next_beat_id: 'beat-searching-3', choice_hint: 'Who finds out first?', order: 0 },
  { id: 'choice-search-3', beat_id: 'beat-searching-3', next_beat_id: 'beat-searching-4', choice_hint: 'Follow the star', order: 0 },
  { id: 'choice-search-4', beat_id: 'beat-searching-4', next_beat_id: 'beat-searching-5', choice_hint: 'See what they find', order: 0 },

  // Curiosity: linear
  { id: 'choice-curiosity-1', beat_id: 'beat-curiosity-1', next_beat_id: 'beat-curiosity-2', choice_hint: 'Follow him', order: 0 },
  { id: 'choice-curiosity-2', beat_id: 'beat-curiosity-2', next_beat_id: 'beat-curiosity-3', choice_hint: 'Stay and see', order: 0 },
  { id: 'choice-curiosity-3', beat_id: 'beat-curiosity-3', next_beat_id: 'beat-curiosity-4', choice_hint: 'Tell someone about it', order: 0 },
  { id: 'choice-curiosity-4', beat_id: 'beat-curiosity-4', next_beat_id: 'beat-curiosity-5', choice_hint: 'Come and see for yourself', order: 0 },

  // Anger: linear
  { id: 'choice-anger-1', beat_id: 'beat-anger-1', next_beat_id: 'beat-anger-2', choice_hint: 'Get in the boat', order: 0 },
  { id: 'choice-anger-2', beat_id: 'beat-anger-2', next_beat_id: 'beat-anger-3', choice_hint: 'Hold on', order: 0 },
  { id: 'choice-anger-3', beat_id: 'beat-anger-3', next_beat_id: 'beat-anger-4', choice_hint: 'Wake him up', order: 0 },
  { id: 'choice-anger-4', beat_id: 'beat-anger-4', next_beat_id: 'beat-anger-5', choice_hint: 'Sit with what just happened', order: 0 },
];

// ─── Helper functions ───

export function getMockStory(slug: string): Story | null {
  return mockStories.find((s) => s.slug === slug) ?? null;
}

export function getMockStoryByEmotion(emotionalKey: string): Story | null {
  return mockStories.find((s) => s.emotional_key === emotionalKey) ?? null;
}

export function getMockStartBeat(storySlug: string): BeatWithChoices | null {
  const story = getMockStory(storySlug);
  if (!story) return null;
  const beat = mockBeats.find((b) => b.story_id === story.id && b.is_start);
  if (!beat) return null;
  return { ...beat, choices: mockBeatChoices.filter((c) => c.beat_id === beat.id) };
}

export function getMockBeat(beatId: string): BeatWithChoices | null {
  const beat = mockBeats.find((b) => b.id === beatId);
  if (!beat) return null;
  return { ...beat, choices: mockBeatChoices.filter((c) => c.beat_id === beat.id) };
}

export function getMockStoryWithBeats(slug: string): StoryWithBeats | null {
  const story = getMockStory(slug);
  if (!story) return null;
  const beats = mockBeats
    .filter((b) => b.story_id === story.id)
    .sort((a, b) => a.order - b.order)
    .map((beat) => ({
      ...beat,
      choices: mockBeatChoices.filter((c) => c.beat_id === beat.id),
    }));
  return { ...story, beats };
}
