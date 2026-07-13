import { useState } from 'react'
import { motion } from 'motion/react'
import { ShoppingBag, Star, ChevronRight, ChevronLeft } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

const products = [
  {
    id: 1,
    name: 'Kumkumadi Facial Gel',
    tagline: 'Glow & Clear Skin',
    description: 'Reduces acne, pimples, and facial tanning. Naturally enhances skin radiance for a fresh, glowing complexion.',
    image: `${BASE}images/IMG-20260713-WA0009.jpg`,
    rating: 4.8,
    category: 'Skincare',
  },
  {
    id: 2,
    name: 'Kumkumadi Gel with 24K Gold',
    tagline: 'Luxury Skin Treatment',
    description: 'Premium Kumkumadi gel enriched with 24K gold. Reduces dark spots, pigmentation, and signs of aging for radiant skin.',
    image: `${BASE}images/IMG-20260713-WA0010.jpg`,
    rating: 4.9,
    category: 'Skincare',
  },
  {
    id: 3,
    name: 'Kumkumadi Facial Gel',
    tagline: 'Herbal Skin Glow',
    description: 'Handmade Ayurvedic facial gel with traditional Kumkumadi formulation. Brightens complexion and heals damaged skin naturally.',
    image: `${BASE}images/IMG-20260713-WA0011.jpg`,
    rating: 4.7,
    category: 'Skincare',
  },
  {
    id: 4,
    name: 'Kumkumadi Mirage Beauty Oil',
    tagline: 'Radiance Oil',
    description: 'Luxurious beauty oil with Kumkumadi herbs. Deeply nourishes skin, reduces blemishes, and adds a natural golden glow.',
    image: `${BASE}images/IMG-20260713-WA0012.jpg`,
    rating: 4.6,
    category: 'Oils',
  },
  {
    id: 5,
    name: 'Kumkumadi Mirage Beauty Oil',
    tagline: '24K Gold Infused',
    description: 'Premium beauty oil infused with 24K gold and Kumkumadi extract. Fights aging, hydrates deeply, and restores skin luminosity.',
    image: `${BASE}images/IMG-20260713-WA0013.jpg`,
    rating: 4.8,
    category: 'Oils',
  },
  {
    id: 6,
    name: '36 Herbs Hair Oil',
    tagline: 'Complete Hair Care',
    description: 'Handmade hair oil with 36 Ayurvedic herbs. Controls hair fall, strengthens roots, and promotes thick, healthy hair growth.',
    image: `${BASE}images/IMG-20260713-WA0014.jpg`,
    rating: 4.7,
    category: 'Oils',
  },
  {
    id: 7,
    name: 'Herbs Hair Oil',
    tagline: 'Natural Hair Strength',
    description: 'Traditional herbal hair oil blend. Nourishes scalp, reduces dandruff, and brings back natural shine and softness.',
    image: `${BASE}images/IMG-20260713-WA0015.jpg`,
    rating: 4.6,
    category: 'Oils',
  },
  {
    id: 8,
    name: 'Neem Tulsi Soap',
    tagline: 'Anti-Acne Cleanser',
    description: 'Combat acne and pimples naturally. Infused with Neem & Tulsi extracts to fight breakouts and give clear, radiant skin.',
    image: `${BASE}images/IMG-20260713-WA0016.jpg`,
    rating: 4.8,
    category: 'Skincare',
  },
  {
    id: 9,
    name: 'Herbal Hair Oil',
    tagline: 'No Chemicals, Pure Care',
    description: 'Say goodbye to hair problems. No straighteners, no chemicals — just pure, beautiful, healthy hair the natural way.',
    image: `${BASE}images/IMG-20260713-WA0017.jpg`,
    rating: 4.7,
    category: 'Oils',
  },
  {
    id: 10,
    name: 'Ayurvedic Hair Treatment',
    tagline: 'Deep Root Nutrition',
    description: 'Intensive hair treatment oil with rare Ayurvedic herbs. Repairs damaged hair, prevents split ends, and adds lasting volume.',
    image: `${BASE}images/IMG-20260713-WA0018.jpg`,
    rating: 4.5,
    category: 'Oils',
  },
  {
    id: 11,
    name: 'Charcoal & Neem Facewash',
    tagline: 'Deep Pore Cleansing',
    description: 'Natural herbal facewash with Charcoal, Neem, and Turmeric extracts. Detoxifies skin, removes impurities, and controls oil.',
    image: `${BASE}images/IMG-20260713-WA0019.jpg`,
    rating: 4.7,
    category: 'Skincare',
  },
  {
    id: 12,
    name: 'Kerala Herbal Shampoo',
    tagline: 'Handmade Hair Wash',
    description: 'Traditional Kerala herbal shampoo made with natural ingredients. Gentle cleansing, strengthens hair, and adds natural shine.',
    image: `${BASE}images/IMG-20260713-WA0020.jpg`,
    rating: 4.6,
    category: 'Haircare',
  },
  {
    id: 13,
    name: 'Kumkumadi Soap with 24K Gold',
    tagline: 'Luxury Bath Bar',
    description: 'Handmade Kumkumadi soap infused with 24K gold. Gently cleanses, moisturizes, and leaves skin soft, smooth, and glowing.',
    image: `${BASE}images/IMG-20260713-WA0021.jpg`,
    rating: 4.8,
    category: 'Skincare',
  },
  {
    id: 14,
    name: 'Herbs Hair Oil',
    tagline: 'Handmade Herbal Blend',
    description: 'Premium handmade hair oil with concentrated herbal extracts. Reduces hair fall, nourishes scalp, and boosts hair growth.',
    image: `${BASE}images/IMG-20260713-WA0022.jpg`,
    rating: 4.6,
    category: 'Oils',
  },
  {
    id: 15,
    name: 'Ubtan Soap',
    tagline: '3-in-1 Ritual',
    description: 'Not just ubtan soap — it\'s a 3-in-1 ritual. Deep moisturization, gentle exfoliation, and natural brightening in one bar.',
    image: `${BASE}images/IMG-20260713-WA0023.jpg`,
    rating: 4.7,
    category: 'Skincare',
  },
  {
    id: 16,
    name: 'Ayurvedic Skin Remedy',
    tagline: 'Ethical Ayurvedic Care',
    description: 'Improve your skin tone with essential ethical Ayurvedic remedies. Natural ingredients for healthier, more even-toned skin.',
    image: `${BASE}images/IMG-20260713-WA0024.jpg`,
    rating: 4.5,
    category: 'Skincare',
  },
]

const categories = ['All', 'Skincare', 'Oils', 'Haircare']
const ITEMS_PER_PAGE = 8

export default function Products() {
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
            Every product is a promise — pure ingredients, traditional formulations, and the healing power of Ayurveda.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
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
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ayur-900/10 transition-all duration-500 border border-ayur-100/50"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ayur-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ShoppingBag className="w-4 h-4 text-ayur-800" />
                </div>
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
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ayur-600 hover:text-ayur-800 transition-colors group/link"
                >
                  Learn More
                  <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
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
