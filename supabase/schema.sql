-- Setup & Deploy — Supabase schema for the `messages` table.
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Source of truth: ai/features/setup-deploy.feature.md §5.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Public visitors may submit the contact form (INSERT only)
create policy "public can insert messages"
  on public.messages for insert
  to anon
  with check (true);

-- Only authenticated admin may read messages (Back Office)
create policy "authenticated can read messages"
  on public.messages for select
  to authenticated
  using (true);

-- Only authenticated admin may delete messages (Back Office)
create policy "authenticated can delete messages"
  on public.messages for delete
  to authenticated
  using (true);
