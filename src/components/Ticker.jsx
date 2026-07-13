import { motion } from 'motion/react'
import { useLanguage } from '../context/LanguageContext'

const items = ['ticker1', 'ticker2', 'ticker3', 'ticker4', 'ticker5', 'ticker6', 'ticker7', 'ticker8']

export default function Ticker() {
  const { t } = useLanguage()
  const allItems = [...items, ...items, ...items]

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
        {allItems.map((key, i) => (
          <span
            key={i}
            className="text-sm font-medium text-cream-200/40 tracking-wide flex-shrink-0"
          >
            {t(key)}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
