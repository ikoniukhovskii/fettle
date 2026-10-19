-- Lets you publish customer reviews (with their permission) on the website.
-- Run once in Supabase → SQL Editor.
alter table public.review_requests add column if not exists area text check (char_length(area) <= 12);
alter table public.review_requests add column if not exists published boolean not null default false;
alter table public.review_requests add column if not exists published_at timestamptz;
create index if not exists review_requests_published_idx on public.review_requests (published, published_at desc);
