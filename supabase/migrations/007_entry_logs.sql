-- Logs conversational entry submissions for analytics

CREATE TABLE entry_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_input text NOT NULL,
  detected_lang text NOT NULL,
  emotional_key text NOT NULL,
  arc_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
