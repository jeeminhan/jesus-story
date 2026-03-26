import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seedLanguages() {
  console.log('Seeding languages...');
  const { error } = await supabase.from('languages').upsert(
    [
      { code: 'en', name: 'English', native_name: 'English' },
      { code: 'zh', name: 'Chinese', native_name: '中文' },
      { code: 'es', name: 'Spanish', native_name: 'Espanol' },
      { code: 'hi', name: 'Hindi', native_name: 'Hindi' },
      { code: 'ko', name: 'Korean', native_name: 'Korean' },
      { code: 'ar', name: 'Arabic', native_name: 'Arabic' },
    ],
    { onConflict: 'code' },
  );

  if (error) {
    throw error;
  }
}

async function seedArc() {
  console.log('Seeding arc...');
  const { data: arc, error } = await supabase
    .from('arcs')
    .upsert({ slug: 'the-king-who-came', order: 1, is_published: true }, { onConflict: 'slug' })
    .select('id, slug')
    .single();

  if (error || !arc) {
    throw error ?? new Error('Unable to upsert arc');
  }

  const { error: translationError } = await supabase.from('arc_translations').upsert(
    [
      {
        arc_id: arc.id,
        lang: 'en',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
      {
        arc_id: arc.id,
        lang: 'zh',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
      {
        arc_id: arc.id,
        lang: 'es',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
      {
        arc_id: arc.id,
        lang: 'hi',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
      {
        arc_id: arc.id,
        lang: 'ko',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
      {
        arc_id: arc.id,
        lang: 'ar',
        title: 'The King Who Came',
        tagline: 'A story about a rescue no one expected.',
      },
    ],
    { onConflict: 'arc_id,lang' },
  );

  if (translationError) {
    throw translationError;
  }

  return arc.id;
}

async function seedScenes(arcId: string) {
  console.log('Seeding scenes...');

  const sceneDefs = [
    { slug: 'the-waiting', is_start: true, is_end: false },
    { slug: 'a-different-kind-of-king', is_start: false, is_end: false },
    { slug: 'the-shepherds-path', is_start: false, is_end: false },
    { slug: 'the-scholars-path', is_start: false, is_end: false },
    { slug: 'what-do-you-do-with-a-king', is_start: false, is_end: false },
    { slug: 'the-rescue', is_start: false, is_end: false },
    { slug: 'the-invitation', is_start: false, is_end: true },
  ];

  const ids: Record<string, string> = {};

  for (const scene of sceneDefs) {
    const { data, error } = await supabase
      .from('scenes')
      .upsert({ arc_id: arcId, ...scene }, { onConflict: 'arc_id,slug' })
      .select('id, slug')
      .single();

    if (error || !data) {
      throw error ?? new Error(`Unable to upsert scene ${scene.slug}`);
    }

    ids[scene.slug] = data.id;
  }

  return ids;
}

async function seedSceneTranslations(sceneIds: Record<string, string>) {
  console.log('Seeding English scene content...');

  const sceneContent: Record<string, { title: string; body: string }> = {
    'the-waiting': {
      title: 'The Waiting',
      body: `Long ago, before you were born, before your country had a name, the world was broken. People searched for something they could not quite name and still felt the ache. Somewhere deep inside, everyone seemed to know: this is not how it was supposed to be.\n\nBut there was a whisper. Ancient and quiet. It said: someone is coming. Someone who will put everything right. Someone who has loved you since before the stars were lit.\n\nAnd the world waited.`,
    },
    'a-different-kind-of-king': {
      title: 'A Different Kind of King',
      body: `When the King finally came, he did not arrive the way kings usually do. Not with armies, not with gold, not with a palace of marble and light. He came as a baby, small and helpless, in a place where animals slept.\n\nThe one who made the stars chose to sleep under them. This was not a mistake. This was the plan.`,
    },
    'the-shepherds-path': {
      title: "The Shepherds' Path",
      body: `That night, on a hillside outside the little town, shepherds sat in the dark. They were not important people. Then the sky broke open with light, and a messenger said: do not be afraid. Good news has come. A Savior has been born.\n\nThe shepherds ran to find him.`,
    },
    'the-scholars-path': {
      title: "The Scholars' Journey",
      body: `Far away, men who studied the sky noticed a new star moving with purpose. They packed their bags and followed it for months through deserts and foreign cities.\n\nThey believed a ruler had come, and they would not stop until they found him.`,
    },
    'what-do-you-do-with-a-king': {
      title: 'What Do You Do With a King?',
      body: `When the travelers arrived, they knelt and offered gifts fit for royalty. Something in them recognized this was the one they had been searching for.\n\nBut others felt fear instead of wonder. This is always the question in every age: what do you do when a true king arrives?`,
    },
    'the-rescue': {
      title: 'The Rescue',
      body: `The child grew and spoke with authority no one had heard before. He healed the sick, forgave sin, and called the lost by name.\n\nThen he was killed by the people he came to save. But death could not hold him. On the third day, the tomb was empty.`,
    },
    'the-invitation': {
      title: 'The Invitation',
      body: `This story is not finished. The King who came is still calling people from every nation, every background, every story.\n\nHe invites you not to a list of rules, but to himself. Would you like to explore what it means to follow him with others?`,
    },
  };

  for (const [slug, content] of Object.entries(sceneContent)) {
    const sceneId = sceneIds[slug];
    const { error } = await supabase.from('scene_translations').upsert(
      {
        scene_id: sceneId,
        lang: 'en',
        title: content.title,
        body: content.body,
        audio_url: null,
      },
      { onConflict: 'scene_id,lang' },
    );

    if (error) {
      throw error;
    }
  }
}

async function seedChoices(sceneIds: Record<string, string>) {
  console.log('Seeding choices...');

  const sceneIdList = Object.values(sceneIds);
  const { data: existingChoices, error: existingChoicesError } = await supabase
    .from('choices')
    .select('id')
    .in('scene_id', sceneIdList);

  if (existingChoicesError) {
    throw existingChoicesError;
  }

  const existingChoiceIds = (existingChoices ?? []).map((row) => row.id);
  if (existingChoiceIds.length > 0) {
    const { error: deleteTranslationsError } = await supabase
      .from('choice_translations')
      .delete()
      .in('choice_id', existingChoiceIds);

    if (deleteTranslationsError) {
      throw deleteTranslationsError;
    }
  }

  const { error: deleteChoicesError } = await supabase.from('choices').delete().in('scene_id', sceneIdList);
  if (deleteChoicesError) {
    throw deleteChoicesError;
  }

  async function createChoice(sceneSlug: string, nextSceneSlug: string, order: number) {
    const { data, error } = await supabase
      .from('choices')
      .insert({
        scene_id: sceneIds[sceneSlug],
        next_scene_id: sceneIds[nextSceneSlug],
        order,
      })
      .select('id')
      .single();

    if (error || !data) {
      throw error ?? new Error(`Unable to create choice ${sceneSlug} -> ${nextSceneSlug}`);
    }

    return data.id;
  }

  const c1 = await createChoice('the-waiting', 'a-different-kind-of-king', 0);
  const c2a = await createChoice('a-different-kind-of-king', 'the-shepherds-path', 0);
  const c2b = await createChoice('a-different-kind-of-king', 'the-scholars-path', 1);
  const c3 = await createChoice('the-shepherds-path', 'what-do-you-do-with-a-king', 0);
  const c4 = await createChoice('the-scholars-path', 'what-do-you-do-with-a-king', 0);
  const c5 = await createChoice('what-do-you-do-with-a-king', 'the-rescue', 0);
  const c6 = await createChoice('the-rescue', 'the-invitation', 0);

  const { error } = await supabase.from('choice_translations').upsert(
    [
      { choice_id: c1, lang: 'en', label: 'I want to hear more about the King who was coming' },
      {
        choice_id: c2a,
        lang: 'en',
        label: 'Follow the shepherds, the ordinary people who heard the news first',
      },
      {
        choice_id: c2b,
        lang: 'en',
        label: 'Follow the scholars, the wise men who traveled from afar',
      },
      { choice_id: c3, lang: 'en', label: 'See what the shepherds found' },
      { choice_id: c4, lang: 'en', label: 'See where the star led them' },
      { choice_id: c5, lang: 'en', label: 'What happened to this King?' },
      { choice_id: c6, lang: 'en', label: 'What does this mean for me?' },
    ],
    { onConflict: 'choice_id,lang' },
  );

  if (error) {
    throw error;
  }
}

async function run() {
  await seedLanguages();
  const arcId = await seedArc();
  const sceneIds = await seedScenes(arcId);
  await seedSceneTranslations(sceneIds);
  await seedChoices(sceneIds);
  console.log('Seed complete!');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
