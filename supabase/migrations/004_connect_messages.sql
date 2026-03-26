create table if not exists connect_messages (
  id uuid primary key default gen_random_uuid(),
  arc_id uuid references arcs(id),
  lang text,
  emotional_key text,
  message text not null default '',
  reply_token uuid unique not null default gen_random_uuid(),
  coordinator_reply text,
  created_at timestamptz not null default now()
);

create index if not exists connect_messages_reply_token_idx on connect_messages(reply_token);
