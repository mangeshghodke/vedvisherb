import { useState } from 'react'
import { motion } from 'motion/react'
import { Send, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for reaching out! We will get back to you shortly.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ayur-800 via-ayur-900 to-ayur-900" />

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ayur-400/30 to-transparent" />
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-ayur-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-ayur-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Get in Touch
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Let's Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Wellness Journey
              </span>
            </h2>

            <p className="text-cream-200/50 text-base leading-relaxed mb-10 max-w-md">
              Have questions about our products or need personalized Ayurvedic advice?
              We're here to help you find the right path to natural wellness.
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: '+91 98765 43210', sub: 'Mon - Sat, 9am to 6pm' },
                { icon: Mail, label: 'hello@vedvisherb.com', sub: 'We reply within 24 hours' },
                { icon: MapPin, label: 'Mumbai, Maharashtra, India', sub: 'Visit our experience center' },
                { icon: MessageCircle, label: 'WhatsApp Us', sub: 'Quick responses via WhatsApp' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-ayur-300" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-cream-200/35 mt-0.5">{item.sub}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-3xl p-8 md:p-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-medium text-cream-200/50 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-ayur-400/50 focus:ring-1 focus:ring-ayur-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cream-200/50 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-ayur-400/50 focus:ring-1 focus:ring-ayur-400/30 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-medium text-cream-200/50 uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-ayur-400/50 focus:ring-1 focus:ring-ayur-400/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cream-200/50 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-ayur-400/50 focus:ring-1 focus:ring-ayur-400/30 transition-all appearance-none"
                  >
                    <option value="" className="bg-ayur-900">Select a topic</option>
                    <option value="product" className="bg-ayur-900">Product Inquiry</option>
                    <option value="consultation" className="bg-ayur-900">Ayurvedic Consultation</option>
                    <option value="order" className="bg-ayur-900">Order Support</option>
                    <option value="wholesale" className="bg-ayur-900">Wholesale / Bulk</option>
                    <option value="other" className="bg-ayur-900">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-cream-200/50 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-ayur-400/50 focus:ring-1 focus:ring-ayur-400/30 transition-all resize-none"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-gold-400 to-gold-500 text-ayur-900 font-semibold rounded-full shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send className="w-4 h-4" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
