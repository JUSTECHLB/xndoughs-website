'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/lib/supabase/types'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-3">Browse</p>
          <h2 className="font-display text-5xl font-bold text-brand-dark">Our Menu</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link href={`/menu?category=${cat.slug}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-pink-light/20">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🍩</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/65 via-brand-dark/10 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white font-display font-bold text-lg leading-tight">
                    {cat.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
