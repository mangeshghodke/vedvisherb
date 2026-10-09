-- Product image storage
-- Run in Supabase SQL Editor. Safe to run more than once.
--
-- NOTE: you must also have run schema.sql (or admin.sql) first, because the
-- write policies below reference the public.admins table.

-- ---------------------------------------------------------------- bucket
-- Public bucket: product photos are not sensitive, and this lets visitors
-- load them without a session. Access is still limited by the policies below.
--
-- Split into insert-then-update so a pre-existing bucket is repaired rather
-- than aborting the whole script.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

update storage.buckets
set public = true,
    file_size_limit = 5242880, -- 5 MB ceiling (we compress to ~60 KB first)
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'product-images';

-- ---------------------------------------------------------------- read
-- Anyone may read product images.
drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- --------------------------------------------------------------- write
-- Only emails listed in public.admins may upload, replace, or remove images.
--
-- Requires the admins table from supabase/schema.sql. Using
-- "to authenticated" alone would let any registered account overwrite images.
drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  )
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.admins a
      where a.email = (auth.jwt() ->> 'email')
    )
  );

-- ------------------------------------------------------------------ notes
-- Images are stored under products/<product-id>-<slug>.<ext> and the public
-- URL is written to products.image, e.g.
--   https://<ref>.supabase.co/storage/v1/object/public/product-images/products/17-neem-soap.jpg
--
-- Legacy rows may still hold a bare filename (e.g. IMG-0009.jpg) served from
-- /images on the site. The app resolves both forms; see resolveImage() in
-- src/data/supabase.js.