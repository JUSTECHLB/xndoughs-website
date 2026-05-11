'use client'
import { motion } from 'framer-motion'

interface Value { icon: string; title: string; text: string }

export function ValuesSection({ values }: { values: Value[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      {values.map((value, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">{value.icon}</div>
          <h3 className="font-display text-xl font-bold text-brand-dark mb-2">{value.title}</h3>
          <p className="text-brand-dark/55 text-sm leading-relaxed">{value.text}</p>
        </motion.div>
      ))}
    </div>
  )
}
