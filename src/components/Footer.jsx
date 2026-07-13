import { motion } from 'motion/react'
import { Leaf, Globe, Heart, MessageSquare, Play } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const socialLinks = [
  { icon: Globe, label: 'Instagram' },
  { icon: Heart, label: 'Facebook' },
  { icon: MessageSquare, label: 'Twitter' },
  { icon: Play, label: 'YouTube' },
]

export default function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    [t('footerProd')]: [
      t('ftLinkProd1'), t('ftLinkProd2'), t('ftLinkProd3'), t('ftLinkProd4'), t('ftLinkProd5'),
    ],
    [t('footerCompany')]: [
      t('ftLinkComp1'), t('ftLinkComp2'), t('ftLinkComp3'), t('ftLinkComp4'), t('ftLinkComp5'),
    ],
    [t('footerSupport')]: [
      t('ftLinkSup1'), t('ftLinkSup2'), t('ftLinkSup3'), t('ftLinkSup4'), t('ftLinkSup5'),
    ],
    [t('footerWellness')]: [
      t('ftLinkWell1'), t('ftLinkWell2'), t('ftLinkWell3'), t('ftLinkWell4'), t('ftLinkWell5'),
    ],
  }

  return (
    <footer className="relative bg-ayur-900 pt-20 pb-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ayur-400/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-ayur-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-ayur-800 to-ayur-700 rounded-2xl p-8 md:p-12 mb-16 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {t('footerNewsletter')}
              </h3>
              <p className="text-cream-200/50 text-sm">
                {t('footerNewsletterSub')}
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder={t('footerEmailPh')}
                className="flex-1 md:w-72 px-5 py-3 bg-white/[0.06] border border-white/10 rounded-l-full text-white text-sm placeholder:text-cream-200/25 focus:outline-none focus:border-ayur-400/50"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-ayur-900 font-semibold rounded-r-full text-sm whitespace-nowrap"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('footerSubscribe')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ayur-400 to-ayur-600 flex items-center justify-center">
                <Leaf className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white leading-tight block">Vedvis</span>
                <span className="text-[9px] text-ayur-400 uppercase tracking-[0.2em]">Herb</span>
              </div>
            </div>
            <p className="text-xs text-cream-200/35 leading-relaxed mb-5 max-w-[200px]">
              {t('footerDesc')}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <motion.a
                    key={s.label}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors"
                    whileHover={{ y: -2 }}
                    aria-label={s.label}
                  >
                    <Icon className="w-4 h-4 text-cream-200/50" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-cream-200/35 hover:text-cream-200/70 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-200/25">
            {t('footerCopyright')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-cream-200/25 hover:text-cream-200/50 transition-colors">
              {t('footerPrivacy')}
            </a>
            <a href="#" className="text-xs text-cream-200/25 hover:text-cream-200/50 transition-colors">
              {t('footerTerms')}
            </a>
            <a href="#" className="text-xs text-cream-200/25 hover:text-cream-200/50 transition-colors">
              {t('footerCookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
