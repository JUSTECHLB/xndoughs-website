import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { ProductGrid } from '@/components/menu/product-grid'

export const metadata = { title: 'Menu | XnDoughs' }

export default async function MenuPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('display_order'),
    supabase
      .from('categories')
      .select('*')
      .order('display_order'),
  ])

  return (
    <>
      <div className="bg-brand-cream pt-8 pb-2">
        <div className="container mx-auto px-6 mb-6 text-center md:text-left">
          <h1 className="font-display text-5xl font-bold text-brand-dark">Our Menu</h1>
          <p className="text-brand-dark/50 mt-2">Your Sweet Escape.</p>
        </div>
      </div>
      <Suspense fallback={null}>
        <CategoryTabs categories={categories ?? []} />
        <ProductGrid products={products ?? []} categories={categories ?? []} />
      </Suspense>
    </>
  )
}
