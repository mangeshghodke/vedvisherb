import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Check,
  X,
  Eye,
  ImageIcon,
  LogOut,
  Upload,
  AlertTriangle,
  Cloud,
  HardDrive,
} from 'lucide-react'
import { useCatalog } from '../context/useCatalog'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  signIn,
  signOut,
  getSession,
  resolveImage,
  uploadImage,
  deleteImage,
  isStorageUrl,
} from '../data/supabase'
import imageLibrary from '../data/imageLibrary'

const MAX_DIM = 1000
const JPEG_QUALITY = 0.72

const kb = (str) => Math.round((str.length / 1024) * 10) / 10
const str = (v) => String(v ?? '').trim()

const EMPTY = {
  name: '',
  tagline: '',
  category: '',
  price: '',
  weight: '',
  description: '',
  longDescription: '',
  howToUse: '',
  benefits: '',
  ingredients: '',
  image: '',
  rating: '',
  reviews: '',
}

const toList = (s) =>
  str(s)
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean)

/** Re-encode an upload as a compressed JPEG data URL to keep the row small. */
async function compressImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.readAsDataURL(file)
  })

  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error('That file is not a readable image'))
    el.src = dataUrl
  })

  if (!img.width || !img.height) throw new Error('That image has no dimensions')

  const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

export default function Dashboard() {
  const { products, categories, loading, reload, upsertLocal, removeLocal, isRemote } =
    useCatalog()

  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [imgBusy, setImgBusy] = useState(false)
  const [imgError, setImgError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    setItems(products)
  }, [products])

  const existingCategories = categories
  const previewImage = form.image ? resolveImage(form.image) : ''
  const embeddedCount = items.filter((p) => p.image?.startsWith('data:')).length

  function flash(text, kind = 'ok') {
    setNotice({ text, kind })
    setTimeout(() => setNotice(null), 4000)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setAuthBusy(true)
    setAuthError('')
    try {
      await signIn(email.trim(), password)
      setSession(await getSession())
      setPassword('')
      flash('Signed in.')
    } catch (err) {
      setAuthError(err.message || 'Could not sign in')
    } finally {
      setAuthBusy(false)
    }
  }

  async function handleLogout() {
    await signOut()
    setSession(null)
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function startAdd() {
    setForm({ ...EMPTY, category: existingCategories[0] || 'Skincare' })
    setEditing('new')
  }

  function startEdit(p) {
    setForm({
      ...EMPTY,
      ...p,
      price: String(p.price ?? ''),
      rating: String(p.rating ?? ''),
      reviews: String(p.reviews ?? ''),
      benefits: (p.benefits || []).join('\n'),
      ingredients: (p.ingredients || []).join('\n'),
    })
    setEditing(p.id)
  }

  async function handleUpload(file) {
    if (!file) return
    setImgError('')

    const looksLikeImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(file.name)
    if (!looksLikeImage) {
      setImgError(`"${file.name}" is not a supported image. Use JPG, PNG or WebP.`)
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      setImgError('That image is over 25 MB. Please use a smaller photo.')
      return
    }

    setImgBusy(true)
    try {
      const dataUrl = await compressImage(file)
      if (!dataUrl.startsWith('data:image/')) throw new Error('That image could not be processed')
      set('image', dataUrl)
    } catch (err) {
      setImgError(err?.message || 'Upload failed. Try a different image.')
    } finally {
      setImgBusy(false)
    }
  }

  function toRecord(existing) {
    const f = { ...EMPTY, ...form }
    return {
      name: str(f.name),
      tagline: str(f.tagline),
      category: str(f.category) || 'Uncategorised',
      price: Number(f.price) || 0,
      weight: str(f.weight),
      description: str(f.description),
      longDescription: str(f.longDescription) || str(f.description),
      howToUse: str(f.howToUse),
      benefits: toList(f.benefits),
      ingredients: toList(f.ingredients),
      image: str(f.image),
      rating: Number(f.rating) || 0,
      reviews: Number(f.reviews) || 0,
      // Keep the existing position when editing; only new products get a slot
      // at the end. Using items.length here reordered products on every save.
      sortOrder: existing ? Number(existing.sortOrder) || 0 : items.length,
      published: existing ? existing.published !== false : true,
    }
  }

  async function save(e) {
    e?.preventDefault()
    const original = editing !== 'new' ? items.find((p) => p.id === editing) : null
    const record = toRecord(original)
    if (!record.name) {
      flash('Please enter a product name.', 'err')
      return
    }

    // A freshly picked file is still an in-memory data URL. Upload it only
    // now, so abandoning the form never leaves an orphan file in the bucket.
    const pendingUpload = record.image.startsWith('data:')
    const previousImage = original?.image ?? null

    setBusy(true)
    try {
      if (pendingUpload) {
        record.image = await uploadImage(record.image, {
          productId: editing === 'new' ? undefined : editing,
          name: record.name,
        })
      }

      let saved
      if (editing === 'new') {
        saved = await createProduct(record)
        upsertLocal(saved)
        flash(`"${saved.name}" added.`)
      } else {
        saved = await updateProduct(editing, record)
        upsertLocal(saved)
        // Only clean up if the image actually changed, and only if we own it.
        if (previousImage && previousImage !== saved.image) {
          await deleteImage(previousImage)
        }
        flash(`"${saved.name}" updated.`)
      }
      setEditing(null)
      setForm(EMPTY)
    } catch (err) {
      flash(err.message || 'Could not save. Please try again.', 'err')
    } finally {
      setBusy(false)
    }
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setBusy(true)
    try {
      await deleteProduct(p.id)
      removeLocal(p.id)
      if (editing === p.id) {
        setEditing(null)
        setForm(EMPTY)
      }
      // Only removes objects we uploaded; legacy /images filenames are left alone.
      if (isStorageUrl(p.image)) await deleteImage(p.image)
      flash(`"${p.name}" deleted.`)
    } catch (err) {
      flash(err.message || 'Could not delete.', 'err')
    } finally {
      setBusy(false)
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(items, null, 2) + '\n'], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ------------------------------------------------------------- login gate
  if (checking) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-10 h-10 border-3 border-ayur-200 border-t-ayur-700 rounded-full animate-spin" />
      </section>
    )
  }

  if (!session) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50 px-4 py-24">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-ayur-100 p-8"
        >
          <div className="w-12 h-12 rounded-xl bg-ayur-800 flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ayur-900 mb-1 text-center">
            Admin Login
          </h1>
          <p className="text-sm text-ayur-600 mb-6 text-center">
            Sign in to manage the product catalog
          </p>

          {!isRemote && (
            <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3">
              <strong>Supabase is not configured.</strong> Copy <code>.env.example</code> to{' '}
              <code>.env</code> and add your project URL and anon key, then restart the dev server.
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-xs font-medium text-ayur-700 mb-1.5">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vedvisherb.com"
              className="form-field w-full px-4 py-3 rounded-xl border border-ayur-200 text-sm"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-ayur-700 mb-1.5">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-field w-full px-4 py-3 rounded-xl border border-ayur-200 text-sm"
            />
          </label>

          {authError && (
            <p className="text-sm text-red-600 mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={authBusy || !isRemote}
            className="w-full py-3 bg-ayur-800 text-white font-semibold rounded-xl hover:bg-ayur-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {authBusy ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/" className="block mt-4 text-xs text-ayur-500 hover:text-ayur-700 text-center">
            ← Back to site
          </Link>
        </motion.form>
      </section>
    )
  }

  // ---------------------------------------------------------------- dashboard
  return (
    <section className="min-h-screen bg-cream-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ayur-900">
              Product Dashboard
            </h1>
            <p className="text-sm text-ayur-600/70 mt-1 flex items-center gap-1.5">
              {loading ? (
                'Loading…'
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  {items.length} products · saved to the cloud · visible to everyone
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-ayur-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-ayur-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Products
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              notice.kind === 'err'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            {notice.kind === 'err' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {notice.text}
          </div>
        )}

        {embeddedCount > 0 && (
          <div className="mb-6 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              <strong>
                {embeddedCount} product{embeddedCount > 1 ? 's' : ''} still store{embeddedCount > 1 ? '' : 's'} the
                image inside the database row.
              </strong>{' '}
              New uploads go to Supabase Storage. To move these over and shrink the database, run{' '}
              <code className="px-1 bg-white rounded">npm run images:migrate</code>.
            </span>
          </div>
        )}

        {/* Form */}
        {editing !== null && (
          <motion.form
            onSubmit={save}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-8 bg-white rounded-2xl border border-ayur-100 shadow-sm overflow-hidden form-field"
          >
            <div className="px-6 py-4 border-b border-ayur-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ayur-900">
                {editing === 'new' ? 'Add Product' : `Edit: ${form.name}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm(EMPTY)
                }}
                className="p-1.5 rounded-lg hover:bg-ayur-50 text-ayur-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Kumkumadi Facial Gel"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={form.tagline}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="Glow & Clear Skin"
                />
              </Field>
              <Field label="Category">
                <input
                  list="cat-list"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  placeholder="Skincare"
                />
                <datalist id="cat-list">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Quantity / Weight">
                <input
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  placeholder="50g"
                />
              </Field>
              <Field label="Price (₹)">
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="350"
                />
              </Field>
              <Field label="Reviews count (0 hides the star rating)">
                <input
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => set('reviews', e.target.value)}
                  placeholder="0"
                />
              </Field>
              <Field label="Rating (0–5)">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => set('rating', e.target.value)}
                  placeholder="4.8"
                />
              </Field>

              <Field
                label="Product image"
                hint={
                  form.image?.startsWith('data:')
                    ? `Ready to upload — ${kb(form.image)} KB, stored when you save`
                    : isStorageUrl(form.image)
                      ? 'Saved in Supabase Storage'
                      : 'Upload a photo, or pick an existing file'
                }
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 shrink-0 rounded-xl bg-ayur-50 border border-ayur-100 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-ayur-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex gap-2">
                      <input
                        list="img-list"
                        value={form.image?.startsWith('data:') ? '' : form.image}
                        onChange={(e) => {
                          setImgError('')
                          set('image', e.target.value)
                        }}
                        placeholder="IMG-20260713-WA0009.jpg"
                        className="flex-1 min-w-0"
                      />
                      <datalist id="img-list">
                        {imageLibrary.map((f) => (
                          <option key={f} value={f} />
                        ))}
                      </datalist>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imgBusy}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-ayur-800 text-white text-xs font-semibold hover:bg-ayur-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {imgBusy ? 'Working…' : 'Upload'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          e.target.value = ''
                          handleUpload(file)
                        }}
                        className="sr-only"
                        tabIndex={-1}
                        disabled={imgBusy}
                        aria-label="Upload product image"
                      />
                    </div>

                    {form.image?.startsWith('data:') && (
                      <button
                        type="button"
                        onClick={() => set('image', '')}
                        className="text-[11px] text-ayur-600 hover:text-ayur-800 underline"
                      >
                        Remove uploaded image
                      </button>
                    )}
                  </div>
                </div>
                {imgError && <p className="mt-2 text-xs text-red-600">{imgError}</p>}
              </Field>

              <div className="sm:col-span-2">
                <Field label="Short description (card)">
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="One or two lines shown on the product card."
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Full description (detail page)">
                  <textarea
                    rows={4}
                    value={form.longDescription}
                    onChange={(e) => set('longDescription', e.target.value)}
                    placeholder="Longer text. Leave blank to reuse the short description."
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="How to use">
                  <textarea
                    rows={2}
                    value={form.howToUse}
                    onChange={(e) => set('howToUse', e.target.value)}
                    placeholder="How the customer should use it."
                  />
                </Field>
              </div>
              <Field label="Benefits" hint="One per line">
                <textarea
                  rows={4}
                  value={form.benefits}
                  onChange={(e) => set('benefits', e.target.value)}
                  placeholder={'Reduces acne\nRemoves tanning'}
                />
              </Field>
              <Field label="Ingredients" hint="One per line">
                <textarea
                  rows={4}
                  value={form.ingredients}
                  onChange={(e) => set('ingredients', e.target.value)}
                  placeholder={'Saffron\nSandalwood'}
                />
              </Field>
            </div>

            <div className="px-6 py-4 border-t border-ayur-100 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm(EMPTY)
                }}
                className="px-5 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-ayur-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-2.5 rounded-xl bg-ayur-800 text-white text-sm font-semibold hover:bg-ayur-700 disabled:opacity-50"
              >
                {busy ? 'Saving…' : editing === 'new' ? 'Add product' : 'Save changes'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {editing === null && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ayur-800 text-white text-sm font-semibold hover:bg-ayur-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add product
            </button>
          )}
          <button
            type="button"
            onClick={downloadJson}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-ayur-50 transition-colors"
          >
            <HardDrive className="w-4 h-4" />
            Backup as JSON
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-ayur-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ayur-50 text-left text-xs uppercase tracking-wider text-ayur-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ayur-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ayur-600/70">
                      Loading products…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ayur-600/70">
                      No products yet. Click "Add product" to create the first one.
                    </td>
                  </tr>
                ) : (
                  items.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-50">
                      <td className="px-4 py-3">
                        <img
                          src={resolveImage(p.image)}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-cream-100"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-ayur-900">{p.name}</div>
                        <div className="text-xs text-ayur-500">{p.tagline}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-ayur-100 text-ayur-700 text-xs font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ayur-600">{p.weight}</td>
                      <td className="px-4 py-3 font-semibold text-ayur-900">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/product/${p.id}`}
                            title="View on site"
                            className="p-2 rounded-lg hover:bg-ayur-50 text-ayur-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            title="Edit"
                            className="p-2 rounded-lg hover:bg-ayur-50 text-ayur-700"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(p)}
                            title="Delete"
                            disabled={busy}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="block">
      <span className="block text-xs font-medium text-ayur-700 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-ayur-500 mt-1">{hint}</span>}
    </div>
  )
}