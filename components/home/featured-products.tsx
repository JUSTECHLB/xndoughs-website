'use client'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/supabase/types'

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-3">Must Try</p>
          <h2 className="font-display text-5xl font-bold text-brand-dark">Fan Favorites</h2>
          <p className="text-brand-dark/50 mt-3 text-lg">Our most-loved treats, made fresh daily</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
