import { createClient } from '@supabase/supabase-js'
import catalog from './products.json'

const BASE = import.meta.env.BASE_URL

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * True when Supabase env vars are present. When false the app falls back to the
 * committed products.json so the site still builds and previews locally.
 */
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/**
 * Map a DB row to the shape the UI expects (camelCase, benefits/ingredients
 * guaranteed to be arrays).
 */
function fromRow(row) {
  return {
    id: Number(row.id),
    name: row.name,
    tagline: row.tagline ?? '',
    category: row.category ?? 'Uncategorised',
    price: Number(row.price) || 0,
    weight: row.weight ?? '',
    description: row.description ?? '',
    longDescription: row.long_description ?? row.description ?? '',
    howToUse: row.how_to_use ?? '',
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    image: row.image ?? '',
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
    slug: row.slug ?? null,
    published: row.published !== false,
    sortOrder: Number(row.sort_order) || 0,
  }
}

/** Map a UI product to a DB row. */
function toRow(p) {
  return {
    name: p.name,
    tagline: p.tagline ?? '',
    category: p.category ?? 'Uncategorised',
    price: Number(p.price) || 0,
    weight: p.weight ?? '',
    description: p.description ?? '',
    long_description: p.longDescription ?? p.description ?? '',
    how_to_use: p.howToUse ?? '',
    benefits: p.benefits ?? [],
    ingredients: p.ingredients ?? [],
    image: p.image ?? '',
    rating: Number(p.rating) || 0,
    reviews: Number(p.reviews) || 0,
    sort_order: Number(p.sortOrder) || 0,
    published: p.published !== false,
  }
}

/** Fetch all published products, newest sort order respected. */
export async function fetchProducts() {
  if (!supabase) return catalog
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(fromRow)
}

export async function createProduct(p) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('products')
    .insert(toRow(p))
    .select()
    .single()
  if (error) throw new Error(error.message)
  return fromRow(data)
}

export async function updateProduct(id, p) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('products')
    .update(toRow(p))
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return fromRow(data)
}

export async function deleteProduct(id) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ------------------------------------------------------------------- auth
export async function signIn(email, password) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session ?? null
}

// ------------------------------------------------------------------ images
export const BUCKET = 'product-images'

/**
 * Upload a compressed image data URL to Supabase Storage.
 *
 * Returns the public URL, which is what gets stored in products.image.
 * Storing files rather than base64 keeps the products API response small.
 */
export async function uploadImage(dataUrl, { productId, name } = {}) {
  if (!supabase) throw new Error('Supabase is not configured')

  const res = await fetch(dataUrl)
  if (!res.ok) throw new Error('Could not read the image data')
  const blob = await res.blob()

  const slug = String(name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  const path = `products/${productId ?? 'draft'}-${slug}-${Date.now()}.jpg`

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000', // 1 year — filenames are unique per upload
    upsert: false,
  })
  if (error) throw new Error(error.message)

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** Best-effort removal. Only touches objects we uploaded. */
export async function deleteImage(imageUrl) {
  if (!supabase || !imageUrl?.startsWith('http')) return
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const i = imageUrl.indexOf(marker)
  if (i === -1) return
  const path = decodeURIComponent(imageUrl.slice(i + marker.length))
  await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
}

/** True when the URL points at our bucket (as opposed to a legacy filename). */
export function isStorageUrl(image) {
  return Boolean(image?.includes(`/storage/v1/object/public/${BUCKET}/`))
}

/**
 * Resolve an image field to a displayable URL.
 * Handles all three forms in the wild:
 *   - Supabase Storage URL  https://.../product-images/products/17-soap.jpg
 *   - legacy filename       IMG-20260713-WA0009.jpg  -> served from /images
 *   - inline data URL       data:image/jpeg;base64,...  (pre-Storage rows)
 */
export function resolveImage(image) {
  if (!image) return ''
  if (image.startsWith('data:') || image.startsWith('http')) return image
  return `${BASE}images/${image}`
}

export function withImageUrls(list) {
  return list.map((p) => ({ ...p, image: resolveImage(p.image) }))
}

/** Categories derived from whatever catalog is loaded. */
export function categoriesOf(list) {
  return [...new Set(list.map((p) => p.category).filter(Boolean))]
}

/** Fallback catalog shape for local preview without env vars. */
export function localCatalog() {
  return catalog.map((p, i) => ({ ...p, sortOrder: i, published: true, slug: null }))
}