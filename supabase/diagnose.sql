-- Diagnostic: paste into Supabase SQL Editor and Run.
-- Read the results before running storage.sql again.

-- 1. Which buckets exist?
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
order by name;

-- 2. Do we have permission to write to storage.buckets?
--    Rows mean storage.sql may have failed partway.
select policyname, cmd, qual
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- 3. Does the admins table exist yet? (from schema.sql / admin.sql)
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('products', 'admins');

-- 4. Are the product write policies admin-scoped, or still wide open?
--    Look for "auth.jwt" in the qual. If absent, the catalog is writable by
--    any registered account.
select policyname, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename = 'products'
order by cmd, policyname;