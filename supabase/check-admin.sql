-- Check whether the admin policies are recursive.
-- A self-referencing policy on public.admins raises
-- "42P17: infinite recursion detected in policy for relation admins"
-- at runtime, which breaks every product write.
--
-- Run this AFTER admin.sql.

-- 1. Is is_admin() defined and SECURITY DEFINER?
select
  p.proname,
  p.prosecdef                as security_definer,
  p.proconfig                as config,
  pg_get_function_result(p.oid) as returns
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'is_admin';

-- 2. Does any policy on admins still query admins directly? (should be none)
select policyname, cmd, qual
from pg_policies
where schemaname = 'public' and tablename = 'admins';

-- 3. Confirm the admin list holds the email you sign in with.
select email from public.admins order by email;

-- 4. Final functional check: sign in as that admin, then
--    select public.is_admin() as am_i_admin;   -- expect true