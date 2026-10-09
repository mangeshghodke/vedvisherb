import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react'
import { useCatalog } from '../context/useCatalog'
import { withImageUrls } from '../data/supabase'

const ITEMS_PER_PAGE = 8

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-ayur-100/50 animate-pulse">
      <div className="aspect-[4/5] bg-cream-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-cream-100 rounded w-3/4" />
        <div className="h-3 bg-cream-100 rounded w-1/2" />
        <div className="h-3 bg-cream-100 rounded w-full" />
        <div className="h-5 bg-cream-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { products, categories, loading, error, reload } = useCatalog()
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const all = ['All', ...categories]
  const filtered =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const visible = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  return (
    <section className="relative pt-28 pb-20 md:pt-32 md:pb-24 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-ayur-100 text-ayur-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Our Collection
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ayur-900 mb-4">
            All Products
          </h1>
          <p className="text-ayur-700/60 max-w-2xl mx-auto text-lg">
            Browse our complete range of pure Ayurvedic products — each crafted with love and
            ancient wisdom.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={reload}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Category filters */}
        {all.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {all.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-ayur-800 text-white shadow-lg shadow-ayur-800/30'
                    : 'bg-white text-ayur-700 hover:bg-ayur-50 border border-ayur-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Count */}
        {!loading && !error && (
          <div className="text-center mb-6">
            <p className="text-sm text-ayur-600/60">
              Showing {visible.length} of {filtered.length} products
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
            : withImageUrls(visible).map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ayur-900/10 transition-all duration-500 border border-ayur-100/50 h-full"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ayur-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-ayur-700 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-semibold text-ayur-900 group-hover:text-ayur-700 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-ayur-500 font-medium uppercase tracking-wider">
                            {product.tagline}
                          </p>
                        </div>
                        {product.reviews > 0 && (
                          <div className="flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-full shrink-0">
                            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                            <span className="text-xs font-semibold text-ayur-800">
                              {product.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-ayur-700/60 leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-bold text-ayur-900">
                          ₹{product.price}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-ayur-600 group-hover:text-ayur-800 transition-colors">
                          View Details
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
        </div>

        {/* Empty state */}
        {!loading && !error && visible.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-ayur-900 mb-2">No products found</p>
            <p className="text-sm text-ayur-600/70">
              {activeCategory === 'All'
                ? 'The catalog is empty for now.'
                : `Nothing in "${activeCategory}" yet.`}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-ayur-200 text-ayur-700 hover:bg-ayur-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCurrentPage(n)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  page === n
                    ? 'bg-ayur-800 text-white shadow-lg shadow-ayur-800/30'
                    : 'bg-white text-ayur-700 border border-ayur-200/50 hover:bg-ayur-50'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-ayur-200 text-ayur-700 hover:bg-ayur-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}