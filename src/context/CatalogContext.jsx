import { useEffect, useState, useCallback } from 'react'
import {
  fetchProducts,
  isSupabaseConfigured,
  localCatalog,
  categoriesOf,
} from '../data/supabase'
import { CatalogContext } from './catalogContext'

/**
 * Loads the product catalog once and shares it with every page.
 * Falls back to the committed products.json when Supabase is not configured,
 * so `npm run dev` works before you add env vars.
 */
export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(() =>
    isSupabaseConfigured ? [] : localCatalog()
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return
    setLoading(true)
    setError(null)
    try {
      const list = await fetchProducts()
      setProducts(list)
    } catch (err) {
      setError(err.message || 'Could not load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Refresh when a tab regains focus so edits made elsewhere show up.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  const value = {
    products,
    loading,
    error,
    reload: load,
    categories: categoriesOf(products),
    isRemote: isSupabaseConfigured,
    /** Replace or insert locally after a successful write, for instant UI. */
    upsertLocal: (p) =>
      setProducts((prev) => {
        const i = prev.findIndex((x) => x.id === p.id)
        if (i === -1) return [...prev, p]
        const next = [...prev]
        next[i] = p
        return next
      }),
    removeLocal: (id) =>
      setProducts((prev) => prev.filter((x) => x.id !== id)),
  }

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}