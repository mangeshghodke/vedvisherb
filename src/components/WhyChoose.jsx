import { motion } from 'motion/react'
import { Check, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react'

const reasons = [
  {
    icon: Check,
    title: 'Certified Organic',
    description: 'All products carry organic certification from recognized authorities.',
    accent: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on orders above ₹999. Swift dispatch within 24 hours.',
    accent: 'from-blue-400 to-blue-600',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return within 30 days for a complete refund.',
    accent: 'from-amber-400 to-amber-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Guidance',
    description: 'Our Ayurvedic experts are available for personalized wellness consultations.',
    accent: 'from-purple-400 to-purple-600',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Yoga Instructor',
    text: 'The Triphala powder has transformed my digestion. I feel lighter and more energetic than ever. Vedvis Herb products are truly authentic.',
    rating: 5,
  },
  {
    name: 'Rajesh Gupta',
    role: 'Software Engineer',
    text: 'Ashwagandha capsules helped me manage work stress naturally. No more sleepless nights. Highly recommend for anyone with a demanding schedule.',
    rating: 5,
  },
  {
    name: 'Meera Patel',
    role: 'Home Maker',
    text: 'My entire family uses Vedvis Herb products. The Brahmi hair oil has made my hair so much stronger. Trustworthy quality every time.',
    rating: 5,
  },
]

export default function WhyChoose() {
  return (
    <section id="why-us" className="relative py-24 md:py-32 bg-cream-50 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ayur-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-ayur-100 text-ayur-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Why Vedvis Herb
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ayur-900 mb-4">
            The Vedvis Herb
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ayur-600 to-ayur-400"> Promise</span>
          </h2>
          <p className="text-ayur-700/60 max-w-2xl mx-auto text-lg">
            We don't just sell products — we deliver trust, quality, and a commitment to your holistic well-being.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white p-7 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-ayur-900/8 border border-ayur-100/50 transition-all duration-500"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.accent} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-display text-lg font-semibold text-ayur-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-ayur-700/55 leading-relaxed">{reason.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-400/10 text-gold-600 text-xs font-semibold uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-ayur-900">
            Loved by Thousands
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="relative bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg border border-ayur-100/50 transition-all duration-500"
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 font-display text-6xl text-ayur-100 leading-none select-none">
                "
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-gold-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-sm text-ayur-700/65 leading-relaxed mb-6 relative z-10">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ayur-300 to-ayur-500 flex items-center justify-center text-white font-semibold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ayur-900">{t.name}</div>
                  <div className="text-xs text-ayur-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
