import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag, Star, ChevronRight } from 'lucide-react'

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
]

const categories = ['All', 'Powders', 'Capsules', 'Oils', 'Skincare', 'Beverages', 'Juices']

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

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
              onClick={() => setActiveCategory(cat)}
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
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
      </div>
    </section>
  )
}
