import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Heart, Shield, Leaf, Droplets } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const sectionRef = useRef(null)
  const { t } = useLanguage()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const values = [
    { icon: Leaf, titleKey: 'aboutValue1Title', descKey: 'aboutValue1Desc' },
    { icon: Shield, titleKey: 'aboutValue2Title', descKey: 'aboutValue2Desc' },
    { icon: Heart, titleKey: 'aboutValue3Title', descKey: 'aboutValue3Desc' },
    { icon: Droplets, titleKey: 'aboutValue4Title', descKey: 'aboutValue4Desc' },
  ]

  const stats = [
    { valKey: 'aboutStat1Val', labelKey: 'aboutStat1Label' },
    { valKey: 'aboutStat2Val', labelKey: 'aboutStat2Label' },
    { valKey: 'aboutStat3Val', labelKey: 'aboutStat3Label' },
  ]

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ayur-900 via-ayur-800 to-ayur-900" />

      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-ayur-500/10 rounded-full blur-3xl"
        style={{ y: bgY }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-3xl"
        style={{ y: bgY }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-ayur-300 text-xs font-semibold uppercase tracking-widest mb-6">
              {t('aboutBadge')}
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('aboutTitle1')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                {t('aboutTitle2')}
              </span>
            </h2>

            <div className="space-y-4 text-cream-200/60 text-base leading-relaxed">
              <p>{t('aboutP1')}</p>
              <p>{t('aboutP2')}</p>
              <p>{t('aboutP3')}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-gold-400">{t(stat.valKey)}</div>
                  <div className="text-sm text-cream-200/40 mt-1">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ayur-400/20 to-ayur-600/20 flex items-center justify-center mb-4 group-hover:from-ayur-400/30 group-hover:to-ayur-600/30 transition-all">
                    <Icon className="w-5 h-5 text-ayur-300" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{t(value.titleKey)}</h3>
                  <p className="text-sm text-cream-200/50 leading-relaxed">{t(value.descKey)}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
