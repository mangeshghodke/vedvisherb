import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShoppingBag, Star, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const BASE = import.meta.env.BASE_URL

const productKeys = [
  { id: 1, nameKey: 'prod1Name', tagKey: 'prod1Tag', descKey: 'prod1Desc', image: `${BASE}images/IMG-20260713-WA0009.jpg`, rating: 4.8, category: 'Powders' },
  { id: 2, nameKey: 'prod2Name', tagKey: 'prod2Tag', descKey: 'prod2Desc', image: `${BASE}images/IMG-20260713-WA0010.jpg`, rating: 4.9, category: 'Capsules' },
  { id: 3, nameKey: 'prod3Name', tagKey: 'prod3Tag', descKey: 'prod3Desc', image: `${BASE}images/IMG-20260713-WA0011.jpg`, rating: 4.7, category: 'Oils' },
  { id: 4, nameKey: 'prod4Name', tagKey: 'prod4Tag', descKey: 'prod4Desc', image: `${BASE}images/IMG-20260713-WA0012.jpg`, rating: 4.6, category: 'Skincare' },
  { id: 5, nameKey: 'prod5Name', tagKey: 'prod5Tag', descKey: 'prod5Desc', image: `${BASE}images/IMG-20260713-WA0013.jpg`, rating: 4.8, category: 'Beverages' },
  { id: 6, nameKey: 'prod6Name', tagKey: 'prod6Tag', descKey: 'prod6Desc', image: `${BASE}images/IMG-20260713-WA0014.jpg`, rating: 4.5, category: 'Skincare' },
  { id: 7, nameKey: 'prod7Name', tagKey: 'prod7Tag', descKey: 'prod7Desc', image: `${BASE}images/IMG-20260713-WA0015.jpg`, rating: 4.7, category: 'Juices' },
  { id: 8, nameKey: 'prod8Name', tagKey: 'prod8Tag', descKey: 'prod8Desc', image: `${BASE}images/IMG-20260713-WA0016.jpg`, rating: 4.6, category: 'Capsules' },
]

const categories = ['All', 'Powders', 'Capsules', 'Oils', 'Skincare', 'Beverages', 'Juices']

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)
  const { t } = useLanguage()

  const products = productKeys.map((p) => ({
    ...p,
    name: t(p.nameKey),
    tagline: t(p.tagKey),
    description: t(p.descKey),
  }))

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
            {t('productsBadge')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ayur-900 mb-4">
            {t('productsTitle1')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ayur-600 to-ayur-400">
              {t('productsTitle2')}
            </span>
          </h2>
          <p className="text-ayur-700/60 max-w-2xl mx-auto text-lg">
            {t('productsSub')}
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
                    {t('productsLearnMore')}
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
