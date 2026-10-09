import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, ChevronRight, AlertTriangle } from 'lucide-react'
import { useCatalog } from '../context/useCatalog'
import { withImageUrls } from '../data/supabase'

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

export default function FeaturedProducts() {
  const { products, loading, error, reload } = useCatalog()
  const featured = useMemo(() => products.slice(0, 8), [products])

  return (
    <section id="products" className="relative py-24 md:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-ayur-100 text-ayur-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Our Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ayur-900 mb-4">
            Nature's Finest
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ayur-600 to-ayur-400">
              Healing Remedies
            </span>
          </h2>
          <p className="text-ayur-700/60 max-w-2xl mx-auto text-lg">
            Every product is a promise — pure ingredients, traditional formulations, and the healing
            power of Ayurveda.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4 max-w-xl mx-auto">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
            : withImageUrls(featured).map((product, index) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
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

        {!loading && !error && featured.length === 0 && (
          <p className="text-center text-ayur-700/60 py-12">No products yet.</p>
        )}

        {!loading && featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-ayur-800 text-white font-semibold rounded-full shadow-lg shadow-ayur-800/30 hover:shadow-ayur-800/50 hover:bg-ayur-700 transition-all"
            >
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}