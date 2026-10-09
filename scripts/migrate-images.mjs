/**
 * Moves legacy product images from public/images into Supabase Storage and
 * rewrites products.image to the public URL.
 *
 *   node scripts/migrate-images.mjs --dry-run
 *   node scripts/migrate-images.mjs
 *
 * Rows already pointing at Storage are skipped, so re-running is safe.
 * Requires VITE_SUPABASE_SERVICE_ROLE_KEY because it writes to Storage for
 * every row, including drafts an anon session cannot see.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const file = '.env'
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let value = m[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[m[1]]) process.env[m[1]] = value
  }
}
loadEnv()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const BUCKET = 'product-images'
const dryRun = process.argv.includes('--dry-run')

if (!url || !key) {
  console.error('Missing credentials. Set VITE_SUPABASE_URL and an API key in .env')
  process.exit(1)
}

const slugify = (s) =>
  String(s || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

const isStorageUrl = (v) => Boolean(v?.includes(`/storage/v1/object/public/${BUCKET}/`))

async function main() {
  const supabase = createClient(url, key)

  const { data: rows, error } = await supabase
    .from('products')
    .select('id, name, image')
  if (error) {
    console.error('Could not read products:', error.message)
    process.exit(1)
  }

  const todo = (rows ?? []).filter((r) => r.image && !isStorageUrl(r.image))
  const inlined = todo.filter((r) => r.image.startsWith('data:'))
  const files = todo.filter((r) => !r.image.startsWith('data:'))

  const missing = files.filter((r) => !fs.existsSync(path.resolve('public/images', r.image)))

  console.log(`${rows?.length ?? 0} products total`)
  console.log(`  ${todo.length} need migrating`)
  console.log(`    ${files.length} reference a file in public/images`)
  console.log(`    ${inlined.length} are inline data URLs`)
  console.log(`  ${(rows?.length ?? 0) - todo.length} already in Storage`)

  if (missing.length) {
    console.log(`\n  ! ${missing.length} reference a file that is not on disk:`)
    for (const m of missing) console.log(`    - ${m.name}: ${m.image}`)
  }

  if (dryRun || todo.length === 0) {
    if (dryRun) console.log('\nDry run — nothing written.')
    return
  }

  if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\nThis needs VITE_SUPABASE_SERVICE_ROLE_KEY in .env.')
    console.error('Found in Supabase -> Project Settings -> API -> service_role.')
    process.exit(1)
  }

  let ok = 0
  let failed = 0

  for (const row of todo) {
    try {
      let blob
      let ext = 'jpg'

      if (row.image.startsWith('data:')) {
        const res = await fetch(row.image)
        blob = await res.blob()
      } else {
        blob = fs.readFileSync(path.resolve('public/images', row.image))
        const m = row.image.match(/\.(png|webp|avif|jpe?g)$/i)
        ext = (m?.[1] || 'jpg').toLowerCase().replace('jpeg', 'jpg')
      }

      const objectPath = `products/${row.id}-${slugify(row.name)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, blob, {
          contentType: blob.type || `image/${ext}`,
          cacheControl: '31536000',
          upsert: true,
        })
      if (upErr) throw new Error(upErr.message)

      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl

      const { error: dbErr } = await supabase
        .from('products')
        .update({ image: publicUrl })
        .eq('id', row.id)
      if (dbErr) throw new Error(dbErr.message)

      ok++
      console.log(`  migrated  ${row.name}`)
    } catch (err) {
      failed++
      console.error(`  FAILED    ${row.name}: ${err.message}`)
    }
  }

  console.log(`\nDone. ${ok} migrated, ${failed} failed.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})