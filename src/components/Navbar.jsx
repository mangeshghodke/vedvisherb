import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Leaf } from 'lucide-react'

const navLinks = [
  { label: 'Home', section: 'hero' },
  { label: 'Products', to: '/products' },
  { label: 'About', section: 'about' },
  { label: 'Why Us', section: 'why-us' },
  { label: 'Contact', section: 'contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const lastScrollY = { current: 0 }

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > lastScrollY.current && y > 80)
      if (y > lastScrollY.current) setIsOpen(false)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleSectionClick = (section) => (e) => {
    e.preventDefault()
    setIsOpen(false)
    if (location.pathname !== '/') {
      window.location.href = '/' + '#' + section
      return
    }
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    setIsOpen(false)
    if (location.pathname !== '/') {
      window.location.href = '/'
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isHome = location.pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? 'bg-transparent'
          : 'bg-ayur-900/95 backdrop-blur-md shadow-lg shadow-ayur-900/20'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ayur-400 to-ayur-600 flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-white leading-tight tracking-tight">
                Vedvis
              </span>
              <span className="text-[10px] font-medium text-ayur-300 uppercase tracking-[0.2em] leading-none">
                Herb
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 text-sm font-medium text-cream-100/80 hover:text-white transition-colors"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold-400 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '60%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                </Link>
              ) : (
                <motion.a
                  key={link.section}
                  href={`#${link.section}`}
                  onClick={handleSectionClick(link.section)}
                  className="relative px-4 py-2 text-sm font-medium text-cream-100/80 hover:text-white transition-colors"
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold-400 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '60%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                </motion.a>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/#contact"
              onClick={handleSectionClick('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 text-ayur-900 text-sm font-semibold rounded-full shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-shadow"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-ayur-900/98 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) =>
                link.to ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-3 text-cream-100/80 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <motion.a
                    key={link.section}
                    href={`#${link.section}`}
                    onClick={handleSectionClick(link.section)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block px-4 py-3 text-cream-100/80 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </motion.a>
                )
              )}
              <Link
                to="/#contact"
                onClick={handleSectionClick('contact')}
                className="block mt-2 px-4 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-ayur-900 text-sm font-semibold rounded-lg text-center"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
