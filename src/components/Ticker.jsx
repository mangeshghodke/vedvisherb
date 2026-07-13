import { motion } from 'motion/react'

const items = [
  '🌿 100% Natural',
  '✦ Lab Tested',
  '🌱 Organic Certified',
  '💛 Handcrafted with Care',
  '🕉 Ancient Formulations',
  '🚚 Free Shipping 999+',
  '♻ Sustainable Sourcing',
  '🏆 Trusted by 50K+',
]

export default function Ticker() {
  const duplicated = [...items, ...items, ...items]

  return (
    <div className="relative bg-ayur-800 border-y border-ayur-700/50 overflow-hidden py-4">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 25,
            ease: 'linear',
          },
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={i}
            className="text-sm font-medium text-cream-200/40 tracking-wide flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
