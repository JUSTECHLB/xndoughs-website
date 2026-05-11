'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Product } from '@/lib/supabase/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden cursor-default group"
      style={{ boxShadow: '0 2px 12px rgba(201, 40, 122, 0.08)' }}
    >
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🍩</span>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-brand-dark/50 bg-white px-3 py-1 rounded-full border border-brand-dark/10">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-brand-dark text-base leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-brand-dark/50 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <p className="text-brand-pink font-bold mt-2 text-sm">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </motion.div>
  )
}
