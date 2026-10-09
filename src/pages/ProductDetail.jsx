import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Star,
  ArrowLeft,
  Check,
  Shield,
  RotateCcw,
  MessageCircle,
  AlertTriangle,
} from 'lucide-react'
import { useCatalog } from '../context/useCatalog'
import { withImageUrls } from '../data/supabase'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading, error, reload } = useCatalog()

  const match = products.find((p) => String(p.id) === String(id))
  const product = match ? withImageUrls([match])[0] : null

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50 pt-28">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-ayur-200 border-t-ayur-700 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-ayur-600/70 mt-4">Loading product…</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50 px-4 pt-28">
        <div className="max-w-md w-full text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-ayur-900 mb-2">
            Could not load this product
          </h2>
          <p className="text-sm text-ayur-600/70 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={reload}
              className="px-5 py-2.5 rounded-xl bg-ayur-800 text-white text-sm font-semibold hover:bg-ayur-700"
            >
              Try again
            </button>
            <Link
              to="/products"
              className="px-5 py-2.5 rounded-xl border border-ayur-200 text-sm font-medium text-ayur-700 hover:bg-ayur-50"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50 pt-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-ayur-900 mb-4">Product Not Found</h2>
          <p className="text-sm text-ayur-600/70 mb-6">
            This product may have been removed from the catalog.
          </p>
          <Link
            to="/products"
            className="text-ayur-600 hover:text-ayur-800 font-semibold"
          >
            ← Back to Products
          </Link>
        </div>
      </section>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4)

  return (
    <section className="min-h-screen bg-cream-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-ayur-600 hover:text-ayur-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        {/* Main product section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-100 shadow-2xl shadow-ayur-900/10">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-ayur-700 uppercase tracking-wider shadow-sm">
                {product.category}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-xs font-semibold text-ayur-500 uppercase tracking-widest">
                {product.category}
              </span>
              {product.reviews > 0 && (
                <>
                  <span className="text-ayur-300">|</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    <span className="text-sm font-semibold text-ayur-800">{product.rating}</span>
                    <span className="text-xs text-ayur-500">({product.reviews} reviews)</span>
                  </div>
                </>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ayur-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-ayur-600 font-medium mb-6">{product.tagline}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-ayur-900">
                ₹{product.price}
              </span>
              {product.weight && (
                <span className="text-sm text-ayur-500">/ {product.weight}</span>
              )}
            </div>

            <p className="text-ayur-700/70 leading-relaxed mb-8 whitespace-pre-line">
              {product.longDescription || product.description}
            </p>

            {product.benefits?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-sm font-semibold text-ayur-900 uppercase tracking-wider mb-3">
                  Key Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-ayur-500 flex-shrink-0" />
                      <span className="text-sm text-ayur-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <motion.a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hello, I would like to know more about ${product.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-ayur-600 to-ayur-700 text-white font-semibold rounded-full shadow-xl shadow-ayur-700/30 hover:shadow-ayur-700/50 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle className="w-5 h-5" />
                Enquire on WhatsApp
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-ayur-600 text-ayur-700 font-semibold rounded-full hover:bg-ayur-50 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Contact Us
              </motion.a>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-ayur-200/50">
              {[
                { icon: Shield, label: '100% Natural', sub: 'No chemicals' },
                { icon: RotateCcw, label: 'Handmade', sub: 'Small batches' },
              ].map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.label} className="text-center">
                    <Icon className="w-5 h-5 text-ayur-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-ayur-800">{badge.label}</div>
                    <div className="text-[10px] text-ayur-500">{badge.sub}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {product.ingredients?.length > 0 && (
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
              <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1.5 bg-ayur-50 text-ayur-700 text-xs font-medium rounded-full border border-ayur-100"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.howToUse && (
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
              <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">How to Use</h3>
              <p className="text-sm text-ayur-700/70 leading-relaxed">{product.howToUse}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
            <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">
              Product Details
            </h3>
            <div className="space-y-3">
              {[
                ...(product.weight ? [{ label: 'Weight', value: product.weight }] : []),
                { label: 'Category', value: product.category },
                ...(product.reviews > 0
                  ? [
                      { label: 'Rating', value: `${product.rating} / 5` },
                      { label: 'Reviews', value: `${product.reviews}` },
                    ]
                  : []),
              ].map((detail) => (
                <div key={detail.label} className="flex justify-between text-sm">
                  <span className="text-ayur-500">{detail.label}</span>
                  <span className="font-medium text-ayur-900">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl font-bold text-ayur-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {withImageUrls(relatedProducts).map((p) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-ayur-100/50 transition-all duration-300 h-full"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-cream-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-semibold text-ayur-900 group-hover:text-ayur-700 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs text-ayur-500 mt-1">{p.tagline}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-display text-lg font-bold text-ayur-900">
                          ₹{p.price}
                        </span>
                        {p.reviews > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                            <span className="text-xs font-semibold text-ayur-800">{p.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}