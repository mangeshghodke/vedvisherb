-- Admin lockdown
--
-- WHY THIS FILE EXISTS
-- The original policies granted writes to `to authenticated`, which means ANY
-- user who signs up gets full insert/update/delete on the products table. With
-- public sign-ups enabled, that is an open door.
--
-- This replaces those policies with a check against an explicit admin list, and
-- points sign-ups at a closed setting.
--
-- Run once in the Supabase SQL Editor.

-- ---------------------------------------------------------------- admins
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

-- Only signed-in users may read the admin list, and only admins may see it.
drop policy if exists "admins can read admins" on public.admins;
create policy "admins can read admins"
  on public.admins for select
  to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

-- Seed the list with YOUR email. Change this before running.
insert into public.admins (email) values ('YOUR-EMAIL@example.com')
on conflict (email) do nothing;

-- --------------------------------------------------------- product writes
-- Replace the permissive policies with ones that verify the caller is a
-- listed admin. Public read stays as-is.

drop policy if exists "products are readable by everyone" on public.products;
create policy "products are readable by everyone"
  on public.products for select
  using (published = true);

drop policy if exists "admins can insert products" on public.products;
create policy "admins can insert products"
  on public.products for insert
  to authenticated
  with check (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

drop policy if exists "admins can update products" on public.products;
create policy "admins can update products"
  on public.products for update
  to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

drop policy if exists "admins can delete products" on public.products;
create policy "admins can delete products"
  on public.products for delete
  to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

-- ------------------------------------------------- close public sign-ups
-- Only run this if you sign in through the dashboard with an existing account.
-- It stops anyone registering their own account.
--
-- update auth.config
--    set enable_signup = false
--  where instance_id = (select instance_id from auth.instances limit 1);
--
-- Alternatively: Supabase dashboard -> Authentication -> Sign In / Providers
-- -> disable "Email" under "Email Provider".

-- ------------------------------------------------------------ verify
-- After running, this should return your row only:
--   select * from public.admins;
-- And this should still work for visitors:
--   select count(*) from public.products;