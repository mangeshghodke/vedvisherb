# Supabase setup

One-time setup, about 15 minutes. After this, products added in the dashboard are
saved to a real database and are visible to everyone who visits the site.

---

## 1. Create the project

1. Go to <https://supabase.com> → **Start your project**
2. Pick the **Free** plan
3. Save the database password somewhere safe — you will not see it again
4. Wait ~2 minutes for provisioning

## 2. Create the table

In the Supabase dashboard:

1. **SQL Editor** → **New query**
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Click **Run**

This creates the `products` table and the security rules. The rules mean:

- Anyone can read published products (your visitors)
- Only signed-in admins can add, edit, or delete

## 3. Create the admin account

1. **Authentication** → **Users** → **Add user**
2. Enter an email and password
3. Tick **Auto Confirm User** (important — otherwise login fails)
4. **Save**

Those are the credentials your client types into the dashboard login screen.

## 4. Create the image bucket

In the Supabase dashboard:

1. **SQL Editor** → **New query**
2. Paste [`storage.sql`](./storage.sql)
3. **Run**

This creates a public `product-images` bucket with the right policies:
anyone can read, only signed-in admins can upload or delete.

## 5. Connect the app

1. **Project Settings** → **API**
2. Copy the **Project URL** and the **anon public** key

Then:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

The **anon** key is designed to be public — it ships in the browser bundle. The
security comes from the row-level rules, not from hiding this key. Never use the
`service_role` key here.

## 6. Verify locally

```bash
npm run dev
```

Go to `/dashboard`. Without env vars set you'll see a "Supabase is not configured"
notice; once set, the login form works.

---

## Where images live

| Source | Stored as | Served from |
|---|---|---|
| Photos uploaded in the dashboard | Supabase Storage, `products/<id>-<slug>.jpg` | `https://<ref>.supabase.co/storage/v1/object/public/product-images/...` |
| The original 16 photos | files in `public/images/`, committed to git | `/images/IMG-...jpg` on the site |
| Rows created before Storage existed | base64 inside the database row | inline |

Both forms work — `resolveImage()` in `src/data/supabase.js` handles a Storage
URL, a bare filename, and a data URL.

Uploads are compressed in the browser first (max 1000px, JPEG q0.72, ~60 KB), so
the database stays small and the products API response stays fast.

### Migrating the original photos to Storage (optional)

To put everything in one place and shrink the API responses:

```bash
npm run images:migrate --dry-run   # preview
npm run images:migrate             # do it
```

Needs `VITE_SUPABASE_SERVICE_ROLE_KEY` in `.env`, since it writes to Storage for
every row. Safe to re-run — rows already in Storage are skipped. The files stay
in `public/images/`, so nothing breaks if you revert.

### Free-tier limits

| | Free |
|---|---|
| Database | 500 MB |
| File storage | 1 GB (~16,000 compressed product images) |
| Egress | 10 GB/month (5 GB cached + 5 GB uncached) |

**Note:** free projects pause after 7 days of inactivity. If nobody visits for a
week the site will show an error until the project wakes up. Visiting the
Supabase dashboard periodically keeps it active; the Pro plan ($25/mo) does not
pause.

---

## Adding your existing products

The 13 existing products live in `src/data/products.json`. To load them into the
database:

```bash
npm run seed:sql
```

That writes `supabase/seed.sql`. Open the Supabase **SQL Editor**, paste the
file, and click **Run**.

Why paste rather than run a script directly? Because your anon key is blocked by
row-level security — which is exactly what you want for the live site. The SQL
Editor runs as a database superuser, so it can write without weakening those
rules. No `service_role` key needed in your project.

The seed is idempotent: rows are matched on name + sort order, so running it
twice won't create duplicates. (Your catalog has two products legitimately named
"Kumkumadi Facial Gel" at different prices — those are kept separate.)

To write directly from the command line instead, add your `service_role` key to
`.env` as `VITE_SUPABASE_SERVICE_ROLE_KEY` and run `npm run seed:products`. Note
that key bypasses all security — keep it out of git and never ship it to the
browser.

---

## Deploying

Because env vars are baked in at build time, GitHub Pages needs them configured
as repository secrets:

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Add `VITE_SUPABASE_URL`
3. Add `VITE_SUPABASE_ANON_KEY`
4. Set up a GitHub Actions workflow for Pages (see below)

For local deploys from your machine, `.env` is read automatically — just run
`npm run build` then `npm run deploy`.

---

## Troubleshooting

**Login says "Invalid login credentials"**
The user was not auto-confirmed, or the password is wrong. Re-check
Authentication → Users.

**Products page is empty**
The table exists but has no rows. Add products through the dashboard.

**"Could not load products"**
Check `.env` has both values and restart the dev server — env vars are only read
at startup.

**Client added a product but visitors cannot see it**
Check `published` is `true` for that row. The public read policy filters on it.

**Uploaded image shows a broken icon**
The bucket is missing or its policies were not applied. Re-run `storage.sql`.
Check with: `curl "$URL/storage/v1/object/public/product-images/<path>"`

**Upload fails silently**
Check the browser console. Images are stored inside the database row, so very
large photos can exceed the request limit. The dashboard warns above ~900 KB per
image. For big catalogs, save photos in `public/images/` and reference them by
filename instead.