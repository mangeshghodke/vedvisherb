import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Star, ChevronRight, ChevronLeft } from 'lucide-react'
import products from '../data/products'

const categories = ['All', 'Skincare', 'Oils', 'Haircare']
const ITEMS_PER_PAGE = 12

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCategoryChange = (cat) => {
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
            Browse our complete range of pure Ayurvedic products — each crafted with love and ancient wisdom.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-ayur-800 text-white shadow-lg shadow-ayur-800/30'
                  : 'bg-white text-ayur-700 hover:bg-ayur-50 border border-ayur-200/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Products count */}
        <div className="text-center mb-6">
          <p className="text-sm text-ayur-600/60">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {/* Products grid */}
        <div key={currentPage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product, index) => (
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
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ayur-900 group-hover:text-ayur-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-ayur-500 font-medium uppercase tracking-wider">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                      <span className="text-xs font-semibold text-ayur-800">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-ayur-700/60 leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-ayur-900">₹{product.price}</span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <motion.button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-ayur-200 text-ayur-700 hover:bg-ayur-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-ayur-800 text-white shadow-lg shadow-ayur-800/30'
                    : 'bg-white text-ayur-700 border border-ayur-200/50 hover:bg-ayur-50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {page}
              </motion.button>
            ))}

            <motion.button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-ayur-200 text-ayur-700 hover:bg-ayur-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
