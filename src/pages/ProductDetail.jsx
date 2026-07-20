import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, ShoppingCart, ArrowLeft, Check, Truck, Shield, RotateCcw } from 'lucide-react'
import products from '../data/products'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream-50 pt-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-ayur-900 mb-4">Product Not Found</h2>
          <Link to="/" className="text-ayur-600 hover:text-ayur-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </section>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
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
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-ayur-600 hover:text-ayur-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        {/* Main product section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-100 shadow-2xl shadow-ayur-900/10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-ayur-700 uppercase tracking-wider shadow-sm">
                {product.category}
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Category & Rating */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-ayur-500 uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-ayur-300">|</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                <span className="text-sm font-semibold text-ayur-800">{product.rating}</span>
                <span className="text-xs text-ayur-500">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ayur-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-ayur-600 font-medium mb-6">{product.tagline}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-ayur-900">₹{product.price}</span>
              <span className="text-sm text-ayur-500">/ {product.weight}</span>
            </div>

            {/* Description */}
            <p className="text-ayur-700/70 leading-relaxed mb-8">{product.longDescription}</p>

            {/* Benefits */}
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

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <motion.button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-ayur-600 to-ayur-700 text-white font-semibold rounded-full shadow-xl shadow-ayur-700/30 hover:shadow-ayur-700/50 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>
              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-ayur-600 text-ayur-700 font-semibold rounded-full hover:bg-ayur-50 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Order on WhatsApp
              </motion.a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ayur-200/50">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'On orders ₹999+' },
                { icon: Shield, label: '100% Natural', sub: 'No chemicals' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
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

        {/* Details tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {/* Ingredients */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
            <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">Ingredients</h3>
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

          {/* How to Use */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
            <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">How to Use</h3>
            <p className="text-sm text-ayur-700/70 leading-relaxed">{product.howToUse}</p>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-ayur-100/50">
            <h3 className="font-display text-lg font-semibold text-ayur-900 mb-4">Product Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Weight', value: product.weight },
                { label: 'Category', value: product.category },
                { label: 'Rating', value: `${product.rating} / 5` },
                { label: 'Reviews', value: `${product.reviews}+` },
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
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-ayur-100/50 transition-all duration-300"
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
                        <span className="font-display text-lg font-bold text-ayur-900">₹{p.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                          <span className="text-xs font-semibold text-ayur-800">{p.rating}</span>
                        </div>
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
