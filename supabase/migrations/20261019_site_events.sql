-- Site events: one row per postcode check, enquiry, membership request, video-call click etc.
-- Run once in Supabase → SQL Editor.
-- Visitors can only ADD rows (never read them). Only the "insights" edge function reads them.

create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null check (char_length(type) <= 40),        -- postcode_check | lead | video_call_click | call_click | whatsapp_click
  area text check (char_length(area) <= 8),                   -- postcode district, e.g. SW10
  covered boolean,                                            -- inside Fettle's area?
  page text check (char_length(page) <= 120),
  visitor_id text check (char_length(visitor_id) <= 40),      -- random ID; kept between visits only with cookie consent
  is_owner boolean not null default false,                    -- true on Ilia's own devices (opened /?me once)
  consented boolean not null default false,                   -- visitor accepted analytics (so Clarity has a recording)
  detail text check (char_length(detail) <= 200)
);
create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_type_area_idx on public.site_events (type, area);

alter table public.site_events enable row level security;

drop policy if exists "anyone can add an event" on public.site_events;
create policy "anyone can add an event" on public.site_events
  for insert to anon, authenticated
  with check (type in ('postcode_check', 'lead', 'video_call_click', 'call_click', 'whatsapp_click'));

grant insert on public.site_events to anon, authenticated;
-- No select policy on purpose: the data is private to you.

-- Tidy-up (matches the privacy page): events older than 12 months can be deleted with
--   delete from public.site_events where created_at < now() - interval '12 months';
