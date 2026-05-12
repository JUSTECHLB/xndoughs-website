'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/supabase/types'

export function CategoryTabs({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? 'all'

  const tabs = [
    { id: 'all', name: 'All', slug: 'all', image_url: null as string | null },
    ...categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image_url: c.image_url })),
  ]

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    router.push(`/menu?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-16 z-40 bg-brand-cream/90 backdrop-blur-sm border-b border-brand-pink-light/20">
      <div className="container mx-auto px-6">
        <div className="flex gap-0 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => {
            const isActive = tab.slug === active
            return (
              <button
                key={tab.id}
                onClick={() => select(tab.slug)}
                className={cn(
                  'relative shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive ? 'text-brand-pink' : 'text-brand-dark/50 hover:text-brand-dark'
                )}
              >
                {tab.image_url && (
                  <Image
                    src={tab.image_url}
                    alt={tab.name}
                    width={22}
                    height={22}
                    className="rounded-full object-cover shrink-0"
                  />
                )}
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
