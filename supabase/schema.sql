create extension if not exists "pgcrypto";

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text not null,
  description text not null default '',
  favicon_url text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.bookmarks
add column if not exists favicon_url text;

alter table public.bookmarks enable row level security;

drop policy if exists "Allow all bookmark reads" on public.bookmarks;
create policy "Allow all bookmark reads"
on public.bookmarks
for select
using (true);

drop policy if exists "Allow all bookmark inserts" on public.bookmarks;
create policy "Allow all bookmark inserts"
on public.bookmarks
for insert
with check (true);

drop policy if exists "Allow all bookmark deletes" on public.bookmarks;
create policy "Allow all bookmark deletes"
on public.bookmarks
for delete
using (true);
