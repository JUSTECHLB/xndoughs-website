import { createClient } from '@/lib/supabase/server'
import { ValuesSection } from '@/components/about/values-section'

export const metadata = { title: 'About | XnDoughs' }

interface HeroContent { headline: string; subtext: string }
interface StoryContent { text: string }
interface ValueItem { icon: string; title: string; text: string }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: contents } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'about')

  const heroRow = contents?.find((c) => c.section === 'hero')
  const storyRow = contents?.find((c) => c.section === 'story')
  const valuesRow = contents?.find((c) => c.section === 'values')

  const hero = (heroRow?.content as HeroContent) ?? { headline: 'Handcrafted With Love', subtext: 'Your Sweet Escape.' }
  const story = (storyRow?.content as StoryContent) ?? { text: '' }
  const values = (valuesRow?.content as ValueItem[]) ?? []

  return (
    <>
      <section className="py-28 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-5">Our Story</p>
          <h1 className="font-display text-6xl font-bold text-brand-dark leading-tight">{hero.headline}</h1>
          <p className="mt-5 text-xl text-brand-dark/55">{hero.subtext}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-4xl font-bold text-brand-dark mb-6 leading-tight">
                From our kitchen<br />to yours
              </h2>
              <p className="text-brand-dark/65 leading-relaxed text-lg">{story.text}</p>
            </div>
            <div className="aspect-square rounded-3xl bg-brand-pink-light/25 flex items-center justify-center">
              <span className="text-8xl">🍩</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <ValuesSection values={values} />
          </div>
        </div>
      </section>
    </>
  )
}
