import { motion } from 'motion/react'
import { Check, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function WhyChoose() {
  const { t } = useLanguage()

  const reasons = [
    { icon: Check, titleKey: 'whyReason1Title', descKey: 'whyReason1Desc', accent: 'from-emerald-400 to-emerald-600' },
    { icon: Truck, titleKey: 'whyReason2Title', descKey: 'whyReason2Desc', accent: 'from-blue-400 to-blue-600' },
    { icon: RotateCcw, titleKey: 'whyReason3Title', descKey: 'whyReason3Desc', accent: 'from-amber-400 to-amber-600' },
    { icon: HeadphonesIcon, titleKey: 'whyReason4Title', descKey: 'whyReason4Desc', accent: 'from-purple-400 to-purple-600' },
  ]

  const testimonials = [
    { nameKey: 'whyTest1Name', roleKey: 'whyTest1Role', textKey: 'whyTest1Text', rating: 5 },
    { nameKey: 'whyTest2Name', roleKey: 'whyTest2Role', textKey: 'whyTest2Text', rating: 5 },
    { nameKey: 'whyTest3Name', roleKey: 'whyTest3Role', textKey: 'whyTest3Text', rating: 5 },
  ]

  return (
    <section id="why-us" className="relative py-24 md:py-32 bg-cream-50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ayur-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-ayur-100 text-ayur-600 text-xs font-semibold uppercase tracking-widest mb-4">
            {t('whyBadge')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ayur-900 mb-4">
            {t('whyTitle1')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ayur-600 to-ayur-400">{t('whyTitle2')}</span>
          </h2>
          <p className="text-ayur-700/60 max-w-2xl mx-auto text-lg">
            {t('whySub')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white p-7 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-ayur-900/8 border border-ayur-100/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.accent} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ayur-900 mb-2">{t(reason.titleKey)}</h3>
                <p className="text-sm text-ayur-700/55 leading-relaxed">{t(reason.descKey)}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-400/10 text-gold-600 text-xs font-semibold uppercase tracking-widest mb-4">
            {t('whyTestBadge')}
          </span>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-ayur-900">
            {t('whyTestTitle')}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tItem, i) => (
            <motion.div
              key={tItem.nameKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="relative bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg border border-ayur-100/50 transition-all duration-500"
            >
              <div className="absolute top-5 right-6 font-display text-6xl text-ayur-100 leading-none select-none">
                &ldquo;
              </div>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: tItem.rating }).map((_, j) => (
                  <span key={j} className="text-gold-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-ayur-700/65 leading-relaxed mb-6 relative z-10">
                &ldquo;{t(tItem.textKey)}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ayur-300 to-ayur-500 flex items-center justify-center text-white font-semibold text-sm">
                  {t(tItem.nameKey).charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ayur-900">{t(tItem.nameKey)}</div>
                  <div className="text-xs text-ayur-500">{t(tItem.roleKey)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
