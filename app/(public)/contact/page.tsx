import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata = { title: 'Contact — XnDoughs' }

interface ContactInfo { whatsapp: string; location: string; instagram: string }

export default async function ContactPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page', 'contact')
    .eq('section', 'info')
    .single()

  const info = (data?.content as ContactInfo) ?? {
    whatsapp: '96178965285',
    location: 'Clemenceau, Beirut, Lebanon',
    instagram: 'https://www.instagram.com/xndoughs/',
  }

  return (
    <section className="py-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-4">Get in Touch</p>
          <h1 className="font-display text-6xl font-bold text-brand-dark">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <a
              href={`https://wa.me/${info.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shrink-0">💬</div>
              <div>
                <p className="font-semibold text-brand-dark group-hover:text-brand-pink transition-colors">WhatsApp</p>
                <p className="text-brand-dark/50 text-sm">Chat with us directly</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-brand-pink-light/30 rounded-full flex items-center justify-center text-2xl shrink-0">📍</div>
              <div>
                <p className="font-semibold text-brand-dark">Location</p>
                <p className="text-brand-dark/50 text-sm">{info.location}</p>
              </div>
            </div>

            <a
              href={info.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-brand-pink-light/30 rounded-full flex items-center justify-center text-2xl shrink-0">📷</div>
              <div>
                <p className="font-semibold text-brand-dark group-hover:text-brand-pink transition-colors">Instagram</p>
                <p className="text-brand-dark/50 text-sm">@xndoughs</p>
              </div>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
