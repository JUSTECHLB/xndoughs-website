'use client'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'
import type { Product, Category } from '@/lib/supabase/types'

export function ProductGrid({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('category') ?? 'all'

  const activeCategory = categories.find((c) => c.slug === activeSlug)

  const filtered =
    activeSlug === 'all'
      ? products
      : products.filter((p) => p.category_id === activeCategory?.id)

  return (
    <div className="container mx-auto px-6 py-12">
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-brand-dark/40">
          <p className="text-5xl mb-4">🍩</p>
          <p className="font-display text-xl">Coming soon...</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
