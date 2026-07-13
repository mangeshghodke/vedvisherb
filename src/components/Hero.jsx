import { motion } from 'motion/react'
import { ArrowDown, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const floatingLeaves = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 4,
  duration: 6 + Math.random() * 4,
  size: 12 + Math.random() * 16,
}))

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ayur-900 via-ayur-800 to-ayur-700" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating leaf particles */}
      {floatingLeaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-ayur-400/20 pointer-events-none"
          style={{ left: `${leaf.x}%`, fontSize: leaf.size }}
          animate={{
            y: [-20, -100, -200],
            x: [0, 30, -20],
            rotate: [0, 180, 360],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: 'easeInOut',
          }}
        >
          🌿
        </motion.div>
      ))}

      {/* Glow orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-ayur-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/6 w-72 h-72 bg-gold-400/8 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-medium text-cream-200 tracking-wide uppercase">
              {t('heroBadge')}
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight"
            >
              {t('heroTitle1')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ayur-300 to-ayur-200">
                {t('heroTitle2')}
              </span>
              <span className="text-gold-400 italic font-medium">{t('heroTitle3')}</span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-cream-200/70 max-w-xl leading-relaxed mb-10"
          >
            {t('heroSub')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#products"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-ayur-400 to-ayur-500 text-white font-semibold rounded-full shadow-xl shadow-ayur-500/30 hover:shadow-ayur-500/50 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('heroCta1')}
              <ArrowDown className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 backdrop-blur-sm transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('heroCta2')}
            </motion.a>
          </motion.div>
        </div>

        {/* Decorative side element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 items-center justify-center"
        >
          <div className="relative w-80 h-80">
            <motion.div
              className="absolute inset-0 border border-white/5 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 border border-white/8 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-8 border border-white/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-20">🕉</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium">{t('heroScroll')}</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 bg-white/40 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
