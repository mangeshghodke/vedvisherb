import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Heart, Shield, Leaf, Droplets } from 'lucide-react'

const values = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'Every ingredient is sourced directly from nature, free from synthetic chemicals and additives.',
  },
  {
    icon: Shield,
    title: 'Lab Tested',
    description: 'Rigorous quality testing ensures purity, potency, and safety in every batch we produce.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Handcrafted in small batches with care, following centuries-old Ayurvedic wisdom.',
  },
  {
    icon: Droplets,
    title: 'Sustainably Sourced',
    description: 'Ethically harvested ingredients that support local farmers and protect biodiversity.',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ayur-900 via-ayur-800 to-ayur-900" />

      {/* Decorative elements */}
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
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-ayur-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Our Story
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Rooted in Tradition,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Crafted for Today
              </span>
            </h2>

            <div className="space-y-4 text-cream-200/60 text-base leading-relaxed">
              <p>
                Vedvis Herb was born from a deep reverence for Ayurveda — the ancient Indian science of life.
                Our founder grew up watching grandmother's remedies heal entire villages using nothing but
                herbs from their garden.
              </p>
              <p>
                Today, we bridge the gap between that timeless wisdom and modern wellness needs. Every product
                in our line is a tribute to those healing traditions, made with ingredients you can trust and
                formulations that deliver real results.
              </p>
              <p>
                We believe that true wellness comes from harmony — between body, mind, and nature.
                That's why every step of our process honors both ancient practice and modern science.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                { value: '15+', label: 'Years of Trust' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '100%', label: 'Pure Ingredients' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-gold-400">{stat.value}</div>
                  <div className="text-sm text-cream-200/40 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
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
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-cream-200/50 leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
