-- Admin lockdown (corrected)
--
-- WHY THIS FILE WAS REWRITTEN
-- The previous version had a self-referencing policy: the policy on
-- public.admins itself queried public.admins. Postgres rejects that at runtime
-- with "42P17: infinite recursion detected in policy for relation admins",
-- and because every write policy on public.products consults that table, the
-- failure hits inserts, updates and deletes.
--
-- The fix is a SECURITY DEFINER helper. It runs as the table owner, so it
-- bypasses RLS on public.admins, and no policy needs to query admins anymore.

-- ---------------------------------------------------------------- helper
-- Drop first, in case an older version exists with a different return type.
drop function if exists public.is_admin();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where email = auth.jwt() ->> 'email'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------- admins
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz default now()
);

-- Replace the self-referencing select policy with a flat one. is_admin() is
-- SECURITY DEFINER, so this does not recurse.
drop policy if exists "admins can read admins" on public.admins;
create policy "admins can read admins"
  on public.admins for select
  to authenticated
  using (public.is_admin());

-- CHANGE THIS to your real address before running.
insert into public.admins (email) values ('YOUR-EMAIL@example.com')
on conflict (email) do nothing;

-- --------------------------------------------------------- product writes
drop policy if exists "products are readable by everyone" on public.products;
create policy "products are readable by everyone"
  on public.products for select
  using (published = true);

drop policy if exists "admins can insert products" on public.products;
create policy "admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update products" on public.products;
create policy "admins can update products"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete products" on public.products;
create policy "admins can delete products"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------ verify
-- These should both be true once you are signed in as the listed admin:
--   select public.is_admin() as am_i_admin;
--
-- And still work for visitors:
--   select count(*) from public.products;