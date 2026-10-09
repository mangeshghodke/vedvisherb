import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Heart, MessageSquare, Play } from 'lucide-react'
import { useCatalog } from '../context/useCatalog'

const BASE = import.meta.env.BASE_URL

const footerLinks = {
  Company: ['About Us', 'Our Story', 'Quality Promise', 'Sustainability', 'Careers'],
  Support: ['Contact Us', 'FAQs', 'Shipping Policy', 'Return Policy', 'Track Order'],
  Wellness: ['Ayurveda Guide', 'Health Blog', 'Ingredient Glossary', 'Dosha Quiz', 'Recipes'],
}

const socialLinks = [
  { icon: Globe, label: 'Instagram' },
  { icon: Heart, label: 'Facebook' },
  { icon: MessageSquare, label: 'Twitter' },
  { icon: Play, label: 'YouTube' },
]

export default function Footer() {
  const navigate = useNavigate()
  const { products } = useCatalog()
  const productLinks = products.slice(0, 5).map((p) => ({ label: p.name, to: `/product/${p.id}` }))
  return (
    <footer className="relative bg-ayur-900 pt-16 pb-6 overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ayur-400/20 to-transparent" />

      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-ayur-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={`${BASE}images/logo.jpeg`}
                alt="Vedvis Herb"
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
              />
              <div>
                <span className="font-display text-lg font-bold text-white leading-tight block">Vedvis</span>
                <span className="text-[9px] text-ayur-400 uppercase tracking-[0.2em]">Herb</span>
              </div>
            </div>
            <p className="text-xs text-cream-200/35 leading-relaxed mb-5 max-w-[200px]">
              Pure Ayurvedic wellness products, crafted with love and ancient wisdom.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <motion.a
                    key={s.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
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

          {/* Live product links from the catalog */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-cream-200/35 hover:text-cream-200/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-cream-200/35 hover:text-cream-200/70 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-200/25">
            &copy; {new Date().getFullYear()} Vedvis Herb. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href={`${BASE}dashboard`}
              onClick={(e) => {
                e.preventDefault()
                navigate('/dashboard')
              }}
              className="text-xs text-cream-200/20 hover:text-cream-200/40 transition-colors"
            >
              Admin
            </a>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <a key={link} href="#" onClick={(e) => e.preventDefault()} className="text-xs text-cream-200/25 hover:text-cream-200/50 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
