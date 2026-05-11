import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/home/hero'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryGrid } from '@/components/home/category-grid'
import { BrandTeaser } from '@/components/home/brand-teaser'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featured }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('display_order')
      .limit(8),
    supabase
      .from('categories')
      .select('*')
      .order('display_order'),
  ])

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured ?? []} />
      <CategoryGrid categories={categories ?? []} />
      <BrandTeaser />
    </>
  )
}
