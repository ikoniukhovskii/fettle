-- Website chat: AI assistant with hand-off to a person via Telegram.
-- Run once in Supabase → SQL Editor. Only the edge functions (service role) can
-- read or write these tables; the browser never touches them directly.

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- ai | waiting (asked for a person) | human (you've replied) | callback (left details) | closed
  status text not null default 'ai',
  handoff_at timestamptz,
  customer_name text,
  customer_phone text,
  page text,
  message_count int not null default 0
);

create table if not exists public.chat_messages (
  id bigserial primary key,
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant', 'human', 'system')),
  content text not null
);
create index if not exists chat_messages_session_idx on public.chat_messages (session_id, id);

-- Maps each Telegram message the bot sends to the chat it belongs to,
-- so a swipe-reply in Telegram finds its way back to the right customer.
create table if not exists public.chat_telegram_map (
  telegram_message_id bigint primary key,
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_telegram_map enable row level security;
-- No policies on purpose: anonymous visitors have no direct access.

-- Tidy-up: chats older than 12 months can be deleted (matches the privacy page).
-- delete from public.chat_sessions where created_at < now() - interval '12 months';

-- Make sure the edge functions' service role can use the new tables.
grant all on public.chat_sessions, public.chat_messages, public.chat_telegram_map to service_role;
grant usage, select on all sequences in schema public to service_role;
