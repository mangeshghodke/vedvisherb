/**
 * Interaction tests for the Supabase-backed dashboard.
 * Run: npm run test:dashboard
 *
 * The Supabase module is mocked so these run without network or credentials.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'

// --- Supabase mock -------------------------------------------------------
const state = {
  rows: [
    {
      id: 1,
      name: 'Kumkumadi Facial Gel',
      tagline: 'Glow & Clear Skin',
      category: 'Skincare',
      price: 350,
      weight: '50g',
      description: 'Short copy',
      long_description: 'Long copy',
      how_to_use: 'Apply twice daily',
      benefits: ['Reduces acne'],
      ingredients: ['Saffron'],
      image: 'IMG-20260713-WA0009.jpg',
      rating: 4.8,
      reviews: 0,
      sort_order: 0,
      published: true,
    },
    {
      id: 2,
      name: 'Herbal Hair Oil',
      tagline: 'Hair Care',
      category: 'Oils',
      price: 329,
      weight: '200ml',
      description: 'Oil copy',
      long_description: '',
      how_to_use: '',
      benefits: [],
      ingredients: [],
      image:
        'https://test.supabase.co/storage/v1/object/public/product-images/products/2-hair-oil.jpg',
      rating: 4.7,
      reviews: 0,
      sort_order: 1,
      published: true,
    },
  ],
  nextId: 3,
  authed: false,
  failWrite: false,
  failUpload: false,
  calls: [],
  uploads: [],
  removals: [],
}

vi.mock('../src/data/supabase', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    isSupabaseConfigured: true,
    supabase: {},
    fetchProducts: async () => {
      state.calls.push('fetchProducts')
      return state.rows.map((r) => ({ ...r, sortOrder: r.sort_order }))
    },
    createProduct: async (p) => {
      state.calls.push('createProduct')
      if (state.failWrite) throw new Error('Insert failed')
      const row = { ...p, id: state.nextId++ }
      state.rows.push(row)
      return { ...row }
    },
    updateProduct: async (id, p) => {
      state.calls.push('updateProduct')
      if (state.failWrite) throw new Error('Update failed')
      state.rows = state.rows.map((r) => (r.id === id ? { ...r, ...p } : r))
      return state.rows.find((r) => r.id === id)
    },
    deleteProduct: async (id) => {
      state.calls.push('deleteProduct')
      if (state.failWrite) throw new Error('Delete failed')
      state.rows = state.rows.filter((r) => r.id !== id)
    },
    signIn: async (_email, password) => {
      state.calls.push('signIn')
      if (password !== 'correct-horse') throw new Error('Invalid login credentials')
      state.authed = true
    },
    signOut: async () => {
      state.authed = false
    },
    getSession: async () => (state.authed ? { user: { email: 'a@b.c' } } : null),
    uploadImage: async (dataUrl, opts) => {
      state.calls.push('uploadImage')
      if (state.failUpload) throw new Error('Storage upload failed')
      const url = `https://test.supabase.co/storage/v1/object/public/product-images/products/${
        opts?.productId ?? 'draft'
      }-${opts?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? 'x'}.jpg`
      state.uploads.push({ dataUrl, opts, url })
      return url
    },
    deleteImage: async (imageUrl) => {
      state.calls.push('deleteImage')
      state.removals.push(imageUrl)
    },
  }
})

const { CatalogProvider } = await import('../src/context/CatalogContext.jsx')
const Dashboard = (await import('../src/pages/Dashboard.jsx')).default

// --- helpers -------------------------------------------------------------
const wait = (ms = 40) => new Promise((r) => setTimeout(r, ms))

let container
let root

async function render() {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(
      <MemoryRouter>
        <CatalogProvider>
          <Dashboard />
        </CatalogProvider>
      </MemoryRouter>
    )
    await wait(80)
  })
}

async function click(el) {
  await act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await wait(40)
  })
}

async function type(el, value) {
  const proto =
    el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
  await act(async () => {
    setter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    await wait(10)
  })
}

async function submit(form) {
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await wait(60)
  })
}

const byText = (sel, text) =>
  [...container.querySelectorAll(sel)].find((e) => e.textContent.trim() === text)

const lastForm = () => [...container.querySelectorAll('form')].at(-1)
const rowNamed = (name) =>
  [...container.querySelectorAll('tbody tr')].find((r) => r.textContent.includes(name))
const dbRow = (name) => state.rows.find((r) => r.name === name)

async function login() {
  await type(container.querySelector('input[type="email"]'), 'admin@vedvisherb.com')
  await type(container.querySelector('input[type="password"]'), 'correct-horse')
  await submit(container.querySelector('form'))
  await wait(80)
}

// ======================================================================
describe('dashboard', () => {
  beforeEach(async () => {
    state.rows = state.rows.slice(0, 2).map((r) => ({ ...r }))
    state.nextId = 3
    state.authed = false
    state.failWrite = false
    state.failUpload = false
    state.calls = []
    state.uploads = []
    state.removals = []
    globalThis.__canvasCalls.toDataURL = 0
    globalThis.__canvasCalls.quality = null
    document.body.innerHTML = ''
    await render()
  })

  it('shows a login form when signed out', () => {
    expect(container.querySelector('input[type="password"]')).toBeTruthy()
    expect(container.querySelector('table')).toBeFalsy()
  })

  it('rejects bad credentials', async () => {
    await type(container.querySelector('input[type="email"]'), 'admin@vedvisherb.com')
    await type(container.querySelector('input[type="password"]'), 'wrong-password')
    await submit(container.querySelector('form'))
    expect(container.textContent).toContain('Invalid login credentials')
    expect(container.querySelector('table')).toBeFalsy()
  })

  it('signs in and lists products from the database', async () => {
    await login()
    expect(container.querySelector('table')).toBeTruthy()
    expect(container.textContent).toContain('Kumkumadi Facial Gel')
    expect(container.textContent).toContain('Herbal Hair Oil')
    expect(container.textContent).toContain('visible to everyone')
    expect(byText('button', 'Sign out')).toBeTruthy()
  })

  it('adds a product and writes it to the database', async () => {
    await login()
    await click(byText('button', 'Add product'))

    const form = lastForm()
    expect(form.querySelector('button[type="submit"]')).toBeTruthy()

    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Test Face Serum')
    await type(form.querySelector('input[placeholder="Glow & Clear Skin"]'), 'Brighten')
    await type(form.querySelector('input[placeholder="50g"]'), '30ml')
    await type(form.querySelector('input[placeholder="350"]'), '499')

    const boxes = [...form.querySelectorAll('textarea')]
    await type(boxes.find((b) => b.placeholder.includes('Reduces acne')), 'Brightens skin\nEvens tone')
    await type(boxes.find((b) => b.placeholder === 'Saffron\nSandalwood'), 'Saffron\nNiacinamide')

    await submit(form)

    expect(state.calls).toContain('createProduct')
    expect(container.textContent).toContain('Test Face Serum')
    expect(container.querySelectorAll('tbody tr').length).toBe(3)
    expect(dbRow('Test Face Serum').price).toBe(499)
    expect(Array.isArray(dbRow('Test Face Serum').benefits)).toBe(true)
    expect(dbRow('Test Face Serum').benefits).toEqual(['Brightens skin', 'Evens tone'])
  })

  it('compresses an uploaded image and stores it in Supabase Storage', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()

    const fileInput = form.querySelector('input[type="file"]')
    expect(fileInput.getAttribute('accept')).toBe(
      'image/jpeg,image/png,image/webp,image/avif'
    )

    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    await act(async () => {
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await wait(80)
    })

    const c = globalThis.__canvasCalls
    expect(c.toDataURL).toBeGreaterThan(0)
    expect(c.quality).toBe(0.72)
    // White base fill before drawing keeps transparent PNGs from going black.
    expect(c.fillRect).toBeGreaterThan(0)
    expect(c.drawImage).toBeGreaterThan(0)

    // Nothing is uploaded yet — abandoning the form must not leave an orphan.
    expect(state.uploads).toHaveLength(0)

    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Uploaded Pic')
    await submit(form)

    expect(state.calls).toContain('uploadImage')
    expect(state.uploads).toHaveLength(1)
    // The DB stores a URL, never the base64 payload.
    const stored = dbRow('Uploaded Pic').image
    expect(stored).toMatch(/^https:\/\/test\.supabase\.co\/storage\/v1\/object\/public\//)
    expect(stored).not.toMatch(/^data:/)
  })

  it('surfaces a Storage upload failure and saves nothing', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()

    const fileInput = form.querySelector('input[type="file"]')
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    await act(async () => {
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await wait(80)
    })

    state.failUpload = true
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Never Saved')
    await submit(form)

    expect(container.textContent).toContain('Storage upload failed')
    expect(state.rows.some((r) => r.name === 'Never Saved')).toBe(false)
    expect(state.calls).not.toContain('createProduct')
    state.failUpload = false
  })

  it('does not upload when no new file was picked', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'No Image')
    await submit(form)
    expect(state.uploads).toHaveLength(0)
    expect(dbRow('No Image')).toBeTruthy()
  })

  it('removes the old Storage object when an image is replaced', async () => {
    await login()
    const original = dbRow('Herbal Hair Oil').image

    await click(
      [...rowNamed('Herbal Hair Oil').querySelectorAll('button')].find(
        (b) => b.getAttribute('title') === 'Edit'
      )
    )
    const form = lastForm()

    const fileInput = form.querySelector('input[type="file"]')
    const file = new File(['x'], 'new.jpg', { type: 'image/jpeg' })
    await act(async () => {
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await wait(80)
    })
    await submit(form)

    expect(state.calls).toContain('uploadImage')
    expect(state.removals).toContain(original)
  })

  it('leaves legacy /images filenames alone on edit', async () => {
    await login()
    await click(
      [...rowNamed('Kumkumadi Facial Gel').querySelectorAll('button')].find(
        (b) => b.getAttribute('title') === 'Edit'
      )
    )
    const form = lastForm()
    await type(form.querySelector('input[placeholder="350"]'), '375')
    await submit(form)

    expect(dbRow('Kumkumadi Facial Gel').image).toBe('IMG-20260713-WA0009.jpg')
    expect(state.removals).toHaveLength(0)
  })

  it('deletes the Storage object when a product is deleted', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Doomed')
    const fileInput = form.querySelector('input[type="file"]')
    const file = new File(['x'], 'd.jpg', { type: 'image/jpeg' })
    await act(async () => {
      Object.defineProperty(fileInput, 'files', { value: [file], configurable: true })
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
      await wait(80)
    })
    await submit(form)

    const uploadedUrl = dbRow('Doomed').image
    expect(uploadedUrl).toMatch(/^https:/)

    await click(
      [...rowNamed('Doomed').querySelectorAll('button')].find(
        (b) => b.getAttribute('title') === 'Delete'
      )
    )

    expect(state.removals).toContain(uploadedUrl)
    expect(state.rows.some((r) => r.name === 'Doomed')).toBe(false)
  })

  it('edits a product and persists the change', async () => {
    await login()
    await click(byText('button', 'Add product'))
    let form = lastForm()
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Editable')
    await submit(form)

    await click(
      [...rowNamed('Editable').querySelectorAll('button')].find(
        (b) => b.getAttribute('title') === 'Edit'
      )
    )
    form = lastForm()
    expect(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]').value).toBe('Editable')

    await type(form.querySelector('input[placeholder="350"]'), '599')
    await submit(form)

    expect(state.calls).toContain('updateProduct')
    expect(dbRow('Editable').price).toBe(599)
    expect(rowNamed('Editable').textContent).toContain('599')
  })

  it('surfaces a write failure without adding the row', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()
    state.failWrite = true

    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Doomed')
    await submit(form)

    expect(container.textContent).toContain('Insert failed')
    expect(container.textContent).not.toContain('Doomed')
    expect(state.rows.some((r) => r.name === 'Doomed')).toBe(false)
    state.failWrite = false
  })

  it('blocks a blank product name', async () => {
    await login()
    await click(byText('button', 'Add product'))
    await submit(lastForm())
    expect(container.textContent).toContain('Please enter a product name')
  })

  it('deletes a product', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Temp')
    await submit(form)

    await click(
      [...rowNamed('Temp').querySelectorAll('button')].find(
        (b) => b.getAttribute('title') === 'Delete'
      )
    )

    expect(state.calls).toContain('deleteProduct')
    expect(rowNamed('Temp')).toBeUndefined()
    expect(container.querySelectorAll('tbody tr').length).toBe(2)
    expect(state.rows.some((r) => r.name === 'Temp')).toBe(false)
  })

  it('accepts a brand new category', async () => {
    await login()
    await click(byText('button', 'Add product'))
    const form = lastForm()
    await type(form.querySelector('input[placeholder="Kumkumadi Facial Gel"]'), 'Hair Serum')
    await type(form.querySelector('input[placeholder="Skincare"]'), 'Haircare')
    await submit(form)
    expect(dbRow('Hair Serum').category).toBe('Haircare')
  })

  it('signs out back to the login form', async () => {
    await login()
    await click(byText('button', 'Sign out'))
    expect(container.querySelector('input[type="password"]')).toBeTruthy()
    expect(container.querySelector('table')).toBeFalsy()
  })
})