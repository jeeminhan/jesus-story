-- Seed witness videos (run manually against Supabase)
-- Replace video_url values with real hosted video URLs before running in production
insert into witness_videos (emotional_key, lang, video_url, speaker_name)
values
  ('searching', 'en', 'https://example.com/witness-searching-en.mp4', 'Witness (searching, en)'),
  ('grief', 'en', 'https://example.com/witness-grief-en.mp4', 'Witness (grief, en)'),
  ('doubt', 'en', 'https://example.com/witness-doubt-en.mp4', 'Witness (doubt, en)'),
  ('curiosity', 'en', 'https://example.com/witness-curiosity-en.mp4', 'Witness (curiosity, en)'),
  ('anger', 'en', 'https://example.com/witness-anger-en.mp4', 'Witness (anger, en)')
on conflict do nothing;
