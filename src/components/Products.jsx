import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
    name: 'Ashwagandha Capsules',
    tagline: 'Stress Relief',
    description: 'Premium KSM-66 Ashwagandha root extract for stress relief, energy boost, and balanced cortisol levels.',
    image: `${BASE}images/IMG-20260713-WA0010.jpg`,
    rating: 4.9,
    category: 'Capsules',
  },
  {
    id: 3,
    name: 'Brahmi Hair Oil',
    tagline: 'Hair Nourishment',
    description: 'Infused with Brahmi and Bhringraj herbs, this oil deeply nourishes the scalp and strengthens hair from root to tip.',
    image: `${BASE}images/IMG-20260713-WA0011.jpg`,
    rating: 4.7,
    category: 'Oils',
  },
  {
    id: 4,
    name: 'Aloe Vera Gel',
    tagline: 'Skin Rejuvenation',
    description: 'Pure Aloe Vera gel with turmeric extract for glowing, hydrated skin. Multi-purpose natural skincare solution.',
    image: `${BASE}images/IMG-20260713-WA0012.jpg`,
    rating: 4.6,
    category: 'Skincare',
  },
  {
    id: 5,
    name: 'Turmeric Latte Mix',
    tagline: 'Immunity Booster',
    description: 'Golden milk blend with organic turmeric, black pepper, cinnamon, and cardamom. Warm, healing, and delicious.',
    image: `${BASE}images/IMG-20260713-WA0013.jpg`,
    rating: 4.8,
    category: 'Beverages',
  },
  {
    id: 6,
    name: 'Neem Face Wash',
    tagline: 'Deep Cleansing',
    description: 'Gentle herbal face wash with neem and tea tree oil. Purifies skin, unclogs pores, and controls excess oil.',
    image: `${BASE}images/IMG-20260713-WA0014.jpg`,
    rating: 4.5,
    category: 'Skincare',
  },
  {
    id: 7,
    name: 'Giloy Juice',
    tagline: 'Immunity Defense',
    description: 'Fresh pressed Giloy stem juice — nature\'s immunity powerhouse. Helps fight infections and boosts metabolism.',
    image: `${BASE}images/IMG-20260713-WA0015.jpg`,
    rating: 4.7,
    category: 'Juices',
  },
  {
    id: 8,
    name: 'Moringa Capsules',
    tagline: 'Superfood Nutrition',
    description: 'Concentrated Moringa leaf capsules packed with vitamins, minerals, and antioxidants for overall vitality.',
    image: `${BASE}images/IMG-20260713-WA0016.jpg`,
    rating: 4.6,
    category: 'Capsules',
  },
  {
    id: 9,
    name: 'Kumkumadi Tailam',
    tagline: 'Radiant Skin Oil',
    description: 'Traditional Ayurvedic face oil with saffron and sandalwood. Reduces dark spots and evens out skin tone.',
    image: `${BASE}images/IMG-20260713-WA0017.jpg`,
    rating: 4.8,
    category: 'Oils',
  },
  {
    id: 10,
    name: 'Triphala Churna',
    tagline: 'Digestive Balance',
    description: 'Classic tri-blend powder that supports healthy digestion, detoxification, and regular bowel movements.',
    image: `${BASE}images/IMG-20260713-WA0018.jpg`,
    rating: 4.7,
    category: 'Powders',
  },
  {
    id: 11,
    name: 'Amla Hair Serum',
    tagline: 'Silky Strong Hair',
    description: 'Lightweight serum enriched with Amla and coconut oil. Tames frizz, adds shine, and protects hair from damage.',
    image: `${BASE}images/IMG-20260713-WA0019.jpg`,
    rating: 4.5,
    category: 'Oils',
  },
  {
    id: 12,
    name: 'Chyawanprash',
    tagline: 'Daily Immunity',
    description: 'Ancient Ayurvedic superfood jam with Amla and 40+ herbs. Boosts immunity, energy, and overall well-being.',
    image: `${BASE}images/IMG-20260713-WA0020.jpg`,
    rating: 4.9,
    category: 'Beverages',
  },
  {
    id: 13,
    name: 'Sandalwood Face Pack',
    tagline: 'Cooling & Brightening',
    description: 'Pure sandalwood and multani mitti face pack. Cools skin, reduces pigmentation, and adds a natural glow.',
    image: `${BASE}images/IMG-20260713-WA0021.jpg`,
    rating: 4.6,
    category: 'Skincare',
  },
  {
    id: 14,
    name: 'Shatavari Powder',
    tagline: 'Women\'s Wellness',
    description: 'Organic Shatavari root powder for hormonal balance, reproductive health, and natural vitality in women.',
    image: `${BASE}images/IMG-20260713-WA0022.jpg`,
    rating: 4.7,
    category: 'Powders',
  },
  {
    id: 15,
    name: 'Tulsi Drops',
    tagline: 'Respiratory Care',
    description: 'Concentrated Holy Basil extract drops. Supports respiratory health, relieves cold, and boosts immunity naturally.',
    image: `${BASE}images/IMG-20260713-WA0023.jpg`,
    rating: 4.8,
    category: 'Juices',
  },
  {
    id: 16,
    name: 'Herbal Massage Oil',
    tagline: 'Pain & Stress Relief',
    description: 'Warming blend of sesame, eucalyptus, and camphor oils. Relieves muscle pain, joint stiffness, and tension.',
    image: `${BASE}images/IMG-20260713-WA0024.jpg`,
    rating: 4.6,
    category: 'Oils',
  },
]

const categories = ['All', 'Powders', 'Capsules', 'Oils', 'Skincare', 'Beverages', 'Juices']
const ITEMS_PER_PAGE = 8

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredId, setHoveredId] = useState(null)

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
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                  delay: index * 0.08,
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ayur-900/10 transition-all duration-500 border border-ayur-100/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: hoveredId === product.id ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ayur-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.button
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100"
                    animate={{ y: hoveredId === product.id ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShoppingBag className="w-4 h-4 text-ayur-800" />
                  </motion.button>
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
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ayur-600 hover:text-ayur-800 transition-colors group/link"
                    whileHover={{ x: 4 }}
                  >
                    Learn More
                    <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            {/* Previous button */}
            <motion.button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-ayur-200 text-ayur-700 hover:bg-ayur-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {/* Page numbers */}
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

            {/* Next button */}
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
