import type { ArcWithTranslation, Language, SceneWithContent, WitnessVideo } from './types';

export const mockLanguages: Language[] = [
  { id: 'lang-en', code: 'en', name: 'English', native_name: 'English', is_active: true },
  { id: 'lang-zh', code: 'zh', name: 'Chinese', native_name: '中文', is_active: true },
  { id: 'lang-es', code: 'es', name: 'Spanish', native_name: 'Español', is_active: true },
  { id: 'lang-hi', code: 'hi', name: 'Hindi', native_name: 'हिन्दी', is_active: true },
  { id: 'lang-ko', code: 'ko', name: 'Korean', native_name: '한국어', is_active: true },
  { id: 'lang-ar', code: 'ar', name: 'Arabic', native_name: 'العربية', is_active: true },
];

export const mockArcs: ArcWithTranslation[] = [
  {
    id: 'arc-grief',
    slug: 'when-he-wept',
    order: 1,
    is_published: true,
    emotional_key: 'grief',
    title: 'When He Wept',
    tagline: 'A story for the ache that stays after the room goes quiet.',
  },
  {
    id: 'arc-doubt',
    slug: 'the-night-he-answered',
    order: 2,
    is_published: true,
    emotional_key: 'doubt',
    title: 'The Night He Answered',
    tagline: 'A story for the person who needs more than slogans.',
  },
  {
    id: 'arc-searching',
    slug: 'the-king-who-came',
    order: 3,
    is_published: true,
    emotional_key: 'searching',
    title: 'The King Who Came',
    tagline: 'A story about a rescue no one expected.',
  },
  {
    id: 'arc-curiosity',
    slug: 'come-and-see',
    order: 4,
    is_published: true,
    emotional_key: 'curiosity',
    title: 'Come and See',
    tagline: 'A story for the person who is open, observant, and not yet convinced.',
  },
  {
    id: 'arc-anger',
    slug: 'the-storm-he-stilled',
    order: 5,
    is_published: true,
    emotional_key: 'anger',
    title: 'The Storm He Stilled',
    tagline: 'A story for the noise inside you when everything feels too much.',
  },
];

export const mockArc = mockArcs.find((arc) => arc.slug === 'the-king-who-came') ?? mockArcs[0];

export const mockConnectMessage = {
  id: 'msg-1',
  reply_token: 'mock-reply-token',
};

const mockScenesList: SceneWithContent[] = [
  {
    id: 'scene-grief-1',
    arc_id: 'arc-grief',
    slug: 'the-empty-room',
    is_start: true,
    is_end: false,
    light_world: false,
    title: 'The Empty Room',
    body: 'The room still holds their shape. The chair. The cup. The quiet. Grief is strange that way. The world keeps moving while one part of it feels as though it stopped.\n\nMary and Martha knew that feeling. By the time Jesus reached them, the house had already learned how to whisper around sorrow.',
    audio_url: null,
    choices: [
      {
        id: 'choice-grief-1',
        scene_id: 'scene-grief-1',
        next_scene_id: 'scene-grief-2',
        order: 0,
        label: 'Walk with him toward the house of grief',
      },
    ],
  },
  {
    id: 'scene-grief-2',
    arc_id: 'arc-grief',
    slug: 'the-road-to-bethany',
    is_start: false,
    is_end: false,
    light_world: false,
    title: 'The Road to Bethany',
    body: 'When Martha met him on the road, she did not speak carefully. She spoke honestly. "If you had been here, my brother would not have died."\n\nJesus did not recoil from the accusation. He stayed close enough to hear the heartbreak underneath it.',
    audio_url: null,
    choices: [
      {
        id: 'choice-grief-2',
        scene_id: 'scene-grief-2',
        next_scene_id: 'scene-grief-3',
        order: 0,
        label: 'Keep going to the place where he wept',
      },
    ],
  },
  {
    id: 'scene-grief-3',
    arc_id: 'arc-grief',
    slug: 'at-the-tomb',
    is_start: false,
    is_end: true,
    light_world: true,
    title: 'At the Tomb',
    body: 'At the tomb, Jesus did not hurry past their grief to a lesson. He wept. Before he changed anything, he entered the sorrow that was already there.\n\nThe God who could raise the dead first stood beside the mourners and cried.',
    audio_url: null,
    choices: [],
  },
  {
    id: 'scene-doubt-1',
    arc_id: 'arc-doubt',
    slug: 'the-locked-room',
    is_start: true,
    is_end: false,
    light_world: false,
    title: 'The Locked Room',
    body: 'The room was closed. The doors were shut. Everyone inside had already learned how hope can embarrass you.\n\nThomas was not there for the first story. He only had the secondhand version: "We saw him." Sometimes doubt begins exactly there, at the point where someone else says they know.',
    audio_url: null,
    choices: [
      {
        id: 'choice-doubt-1',
        scene_id: 'scene-doubt-1',
        next_scene_id: 'scene-doubt-2',
        order: 0,
        label: 'Stay with Thomas in the unanswered night',
      },
    ],
  },
  {
    id: 'scene-doubt-2',
    arc_id: 'arc-doubt',
    slug: 'the-offered-hands',
    is_start: false,
    is_end: false,
    light_world: false,
    title: 'The Offered Hands',
    body: 'A week later Jesus came back into the locked room and spoke directly to the doubter. Not around him. Not over him. To him.\n\n"Put your finger here. See my hands." He met skepticism with nearness, not shame.',
    audio_url: null,
    choices: [
      {
        id: 'choice-doubt-2',
        scene_id: 'scene-doubt-2',
        next_scene_id: 'scene-doubt-3',
        order: 0,
        label: 'Hear what happens when doubt is answered',
      },
    ],
  },
  {
    id: 'scene-doubt-3',
    arc_id: 'arc-doubt',
    slug: 'my-lord-my-god',
    is_start: false,
    is_end: true,
    light_world: true,
    title: 'My Lord, My God',
    body: 'Thomas did not stop being thoughtful when he believed. He simply found a truth sturdy enough to bear his whole weight.\n\nJesus did not ask him to pretend certainty. He gave him something real enough to touch.',
    audio_url: null,
    choices: [],
  },
  {
    id: 'scene-searching-1',
    arc_id: 'arc-searching',
    slug: 'the-waiting',
    is_start: true,
    is_end: false,
    light_world: false,
    title: 'The Waiting',
    body: 'Long ago, before you were born, the world was broken. People searched for something they could not name and still felt the ache.\n\nBut there was a whisper: someone is coming. Someone who will put everything right. And the world waited.',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-1',
        scene_id: 'scene-searching-1',
        next_scene_id: 'scene-searching-2',
        order: 0,
        label: 'I want to hear more about the King who was coming',
      },
    ],
  },
  {
    id: 'scene-searching-2',
    arc_id: 'arc-searching',
    slug: 'a-different-kind-of-king',
    is_start: false,
    is_end: false,
    light_world: false,
    title: 'A Different Kind of King',
    body: 'When the King finally came, he did not arrive with armies or palaces. He came as a baby in a borrowed stable.\n\nThe one who made the stars chose to sleep under them.',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-2a',
        scene_id: 'scene-searching-2',
        next_scene_id: 'scene-searching-3',
        order: 0,
        label: 'Follow the shepherds, the ordinary people who heard the news first',
      },
      {
        id: 'choice-searching-2b',
        scene_id: 'scene-searching-2',
        next_scene_id: 'scene-searching-4',
        order: 1,
        label: 'Follow the scholars, the wise men who traveled from afar',
      },
    ],
  },
  {
    id: 'scene-searching-3',
    arc_id: 'arc-searching',
    slug: 'the-shepherds-path',
    is_start: false,
    is_end: false,
    light_world: false,
    title: "The Shepherds' Path",
    body: 'Shepherds in the dark hills heard the sky announce good news: a Savior had been born.\n\nThey ran to find him.',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-3',
        scene_id: 'scene-searching-3',
        next_scene_id: 'scene-searching-5',
        order: 0,
        label: 'See what the shepherds found',
      },
    ],
  },
  {
    id: 'scene-searching-4',
    arc_id: 'arc-searching',
    slug: 'the-scholars-path',
    is_start: false,
    is_end: false,
    light_world: false,
    title: "The Scholars' Journey",
    body: 'Scholars from far away followed a star for months, convinced a true king had come.\n\nThey would not stop until they found him.',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-4',
        scene_id: 'scene-searching-4',
        next_scene_id: 'scene-searching-5',
        order: 0,
        label: 'See where the star led them',
      },
    ],
  },
  {
    id: 'scene-searching-5',
    arc_id: 'arc-searching',
    slug: 'what-do-you-do-with-a-king',
    is_start: false,
    is_end: false,
    light_world: false,
    title: 'What Do You Do With a King?',
    body: 'Some knelt in wonder. Others reacted in fear. The same question remains for every heart: what do you do when a true king arrives?',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-5',
        scene_id: 'scene-searching-5',
        next_scene_id: 'scene-searching-6',
        order: 0,
        label: 'What happened to this King?',
      },
    ],
  },
  {
    id: 'scene-searching-6',
    arc_id: 'arc-searching',
    slug: 'the-rescue',
    is_start: false,
    is_end: false,
    light_world: true,
    title: 'The Rescue',
    body: 'He healed, forgave, and welcomed the lost. Then he was killed by the ones he came to save.\n\nThree days later, the tomb was empty.',
    audio_url: null,
    choices: [
      {
        id: 'choice-searching-6',
        scene_id: 'scene-searching-6',
        next_scene_id: 'scene-searching-7',
        order: 0,
        label: 'What does this mean for me?',
      },
    ],
  },
  {
    id: 'scene-searching-7',
    arc_id: 'arc-searching',
    slug: 'the-invitation',
    is_start: false,
    is_end: true,
    light_world: true,
    title: 'The Invitation',
    body: 'This story is not finished. The King invites people from every place and every background to come to him.',
    audio_url: null,
    choices: [],
  },
  {
    id: 'scene-curiosity-1',
    arc_id: 'arc-curiosity',
    slug: 'the-tree-at-noon',
    is_start: true,
    is_end: false,
    light_world: true,
    title: 'The Tree at Noon',
    body: 'Curiosity often looks like distance. Zacchaeus climbed a tree because he wanted to see without being seen.\n\nJesus did not let him remain a spectator for long.',
    audio_url: null,
    choices: [
      {
        id: 'choice-curiosity-1',
        scene_id: 'scene-curiosity-1',
        next_scene_id: 'scene-curiosity-2',
        order: 0,
        label: 'See what happens when Jesus looks up',
      },
    ],
  },
  {
    id: 'scene-curiosity-2',
    arc_id: 'arc-curiosity',
    slug: 'come-and-see-scene',
    is_start: false,
    is_end: false,
    light_world: true,
    title: 'Come and See',
    body: 'Jesus did not open with an argument. He opened with an invitation. "Come and see."\n\nThe curious were welcomed near enough to discover for themselves.',
    audio_url: null,
    choices: [
      {
        id: 'choice-curiosity-2',
        scene_id: 'scene-curiosity-2',
        next_scene_id: 'scene-curiosity-3',
        order: 0,
        label: 'Stay long enough to hear him say your name',
      },
    ],
  },
  {
    id: 'scene-curiosity-3',
    arc_id: 'arc-curiosity',
    slug: 'the-name-he-knew',
    is_start: false,
    is_end: true,
    light_world: true,
    title: 'The Name He Knew',
    body: 'Before Nathanael had a category for Jesus, Jesus already knew him.\n\nSometimes curiosity becomes trust when you realize you are being seen more deeply than you expected.',
    audio_url: null,
    choices: [],
  },
  {
    id: 'scene-anger-1',
    arc_id: 'arc-anger',
    slug: 'the-waterline',
    is_start: true,
    is_end: false,
    light_world: false,
    title: 'The Waterline',
    body: 'Anger can feel like a storm with nowhere to go. The disciples knew that feeling on the lake. Wind in every direction. Water where the floor used to be.\n\nAnd Jesus, somehow, asleep in the middle of it.',
    audio_url: null,
    choices: [
      {
        id: 'choice-anger-1',
        scene_id: 'scene-anger-1',
        next_scene_id: 'scene-anger-2',
        order: 0,
        label: 'Stay in the boat long enough to hear what he says',
      },
    ],
  },
  {
    id: 'scene-anger-2',
    arc_id: 'arc-anger',
    slug: 'the-voice-in-the-storm',
    is_start: false,
    is_end: false,
    light_world: false,
    title: 'The Voice in the Storm',
    body: 'He stood and spoke into the noise. Not with panic. Not with more violence. With authority.\n\n"Peace. Be still." The chaos did not vanish because it was ignored. It yielded because someone greater named its limit.',
    audio_url: null,
    choices: [
      {
        id: 'choice-anger-2',
        scene_id: 'scene-anger-2',
        next_scene_id: 'scene-anger-3',
        order: 0,
        label: 'See what remains when the waves finally go quiet',
      },
    ],
  },
  {
    id: 'scene-anger-3',
    arc_id: 'arc-anger',
    slug: 'the-deeper-calm',
    is_start: false,
    is_end: true,
    light_world: true,
    title: 'The Deeper Calm',
    body: 'The lake became still, but so did something inside the boat.\n\nJesus did not shame their fear or their anger. He simply revealed that they were not alone inside it.',
    audio_url: null,
    choices: [],
  },
];

export const mockScenes: Record<string, SceneWithContent> = Object.fromEntries(
  mockScenesList.map((scene) => [scene.id, scene]),
);

const scenesByArcSlug = new Map<string, SceneWithContent[]>(
  mockArcs.map((arc) => [arc.slug, mockScenesList.filter((scene) => scene.arc_id === arc.id)]),
);

export function getMockPublishedArcs() {
  return mockArcs;
}

export function getMockArcBySlug(slug: string) {
  const arc = mockArcs.find((entry) => entry.slug === slug);
  if (!arc) {
    return null;
  }

  return {
    id: arc.id,
    slug: arc.slug,
    emotional_key: arc.emotional_key ?? null,
  };
}

export function getMockStartScene(arcSlug: string) {
  const scenes = scenesByArcSlug.get(arcSlug) ?? [];
  return scenes.find((scene) => scene.is_start) ?? null;
}

export function getMockScenesForArc(arcSlug: string) {
  return scenesByArcSlug.get(arcSlug) ?? [];
}

export function getMockSceneById(sceneId: string) {
  return mockScenes[sceneId] ?? null;
}

export const mockWitnessVideos: WitnessVideo[] = [
  {
    id: 'wv-grief',
    arc_id: 'arc-grief',
    emotional_key: 'grief',
    lang: 'en',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster_url: null,
    caption_url: null,
    speaker_name: 'Naomi',
  },
  {
    id: 'wv-doubt',
    arc_id: 'arc-doubt',
    emotional_key: 'doubt',
    lang: 'en',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster_url: null,
    caption_url: null,
    speaker_name: 'Daniel',
  },
  {
    id: 'wv-searching',
    arc_id: 'arc-searching',
    emotional_key: 'searching',
    lang: 'en',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster_url: null,
    caption_url: null,
    speaker_name: 'A witness',
  },
  {
    id: 'wv-curiosity',
    arc_id: 'arc-curiosity',
    emotional_key: 'curiosity',
    lang: 'en',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster_url: null,
    caption_url: null,
    speaker_name: 'Elias',
  },
  {
    id: 'wv-anger',
    arc_id: 'arc-anger',
    emotional_key: 'anger',
    lang: 'en',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster_url: null,
    caption_url: null,
    speaker_name: 'Mara',
  },
];
