-- Product image storage
-- Run AFTER schema.sql / admin.sql — the write policies call public.is_admin().
-- Safe to run more than once.

-- ---------------------------------------------------------------- bucket
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
-- Only listed admins. Uses the SECURITY DEFINER helper so there is no
-- recursion through public.admins.
drop policy if exists "admins can upload product images" on storage.objects;
create policy "admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins can update product images" on storage.objects;
create policy "admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admins can delete product images" on storage.objects;
create policy "admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ------------------------------------------------------------------ notes
-- Images are stored under products/<id>-<slug>.jpg and the public URL is
-- written to products.image, e.g.
--   https://<ref>.supabase.co/storage/v1/object/public/product-images/products/17-neem-soap.jpg
--
-- Legacy rows may still hold a bare filename (e.g. IMG-0009.jpg) served from
-- /images on the site. The app resolves both forms; see resolveImage() in
-- src/data/supabase.js.