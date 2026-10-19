-- Fettle review requests: one row per "how did we do?" ask.
-- Run once in Supabase → SQL Editor (the whole file).
-- Nobody can read or write this table from the website directly; only the "reviews"
-- and "telegram-webhook" edge functions touch it (with the service role).

create table if not exists public.review_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  token uuid not null unique default gen_random_uuid(),   -- secret in the email links
  source text not null default 'form' check (source in ('form', 'telegram', 'qr')),
  name text check (char_length(name) <= 80),
  email text check (char_length(email) <= 160),
  job text check (char_length(job) <= 160),                 -- "fixed the bathroom tap"
  status text not null default 'scheduled' check (status in ('scheduled', 'sent', 'reminded', 'rated', 'cancelled', 'failed')),
  send_at timestamptz,
  sent_at timestamptz,
  remind_at timestamptz,
  reminded_at timestamptz,
  opened_at timestamptz,
  rating smallint check (rating between 1 and 5),
  rated_at timestamptz,
  feedback text check (char_length(feedback) <= 2000),
  can_publish boolean not null default false,               -- OK to quote on the website
  google_clicked_at timestamptz
);
create index if not exists review_requests_due_idx on public.review_requests (status, send_at);
create index if not exists review_requests_email_idx on public.review_requests (lower(email));

alter table public.review_requests enable row level security;
-- No policies on purpose: the website can't read or write it. Edge functions use the service role.
grant select, insert, update, delete on public.review_requests to service_role;

-- Every 10 minutes, ask the "reviews" function to send any emails that are due
-- (the 6:30pm request and the one reminder three days later).
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

select cron.unschedule('fettle-review-emails') where exists (select 1 from cron.job where jobname = 'fettle-review-emails');
select cron.schedule(
  'fettle-review-emails',
  '*/10 * * * *',
  $$ select net.http_post(
       url := 'https://jxrzmghnffvyeeemqwwn.supabase.co/functions/v1/reviews',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := '{"action": "cron"}'::jsonb
     ); $$
);
