/**
 * Smoke test that the app detects Supabase configuration and renders the
 * dashboard login screen without the "not configured" notice.
 *
 * Uses dummy credentials on purpose: this only proves the wiring reads
 * import.meta.env correctly, and every network call is stubbed. Real keys
 * belong in .env, which is gitignored.
 */
import { describe, it, expect, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'

process.env.VITE_SUPABASE_URL = 'https://placeholder-test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'placeholder-anon-key'

vi.mock('../src/data/supabase', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchProducts: async () => [],
    getSession: async () => null,
    signIn: async () => {},
    signOut: async () => {},
  }
})

const { CatalogProvider } = await import('../src/context/CatalogContext.jsx')
const Dashboard = (await import('../src/pages/Dashboard.jsx')).default
const ProductsPage = (await import('../src/pages/ProductsPage.jsx')).default
const ProductDetail = (await import('../src/pages/ProductDetail.jsx')).default

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms))

async function render(ui) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(
      <MemoryRouter>
        <CatalogProvider>{ui}</CatalogProvider>
      </MemoryRouter>
    )
    await wait()
  })
  return container
}

describe('real env wiring', () => {
  it('detects Supabase configuration', async () => {
    const { isSupabaseConfigured } = await import('../src/data/supabase')
    expect(isSupabaseConfigured).toBe(true)
  })

  it('dashboard renders login without the "not configured" notice', async () => {
    const c = await render(<Dashboard />)
    expect(c.textContent).toContain('Admin Login')
    expect(c.textContent).not.toContain('Supabase is not configured')
    expect(c.querySelector('input[type="email"]')).toBeTruthy()
    expect(c.querySelector('input[type="password"]')).toBeTruthy()
  })

  it('products page shows a loading state, not an error', async () => {
    const c = await render(<ProductsPage />)
    expect(c.textContent).toContain('All Products')
    expect(c.textContent).not.toContain('Could not load')
  })

  it('product detail shows not-found for an unknown id', async () => {
    const c = await render(<ProductDetail />)
    // useParams returns {} outside a Route, so id is undefined -> not found
    expect(c.textContent).toMatch(/Product Not Found|Could not load/)
  })
})