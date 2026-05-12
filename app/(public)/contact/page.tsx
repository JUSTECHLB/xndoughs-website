import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata = { title: 'Contact | XnDoughs' }

interface ContactInfo { whatsapp: string; instagram: string }

const locations = [
  { name: 'Clemenceau', phone: '71520891' },
  { name: 'Jal El Dib',  phone: '70999158' },
  { name: 'Kfarehbeb',   phone: '71012302' },
  { name: 'Batroun',     phone: '71411085' },
  { name: 'Bliss',       phone: null },
]

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
          <div className="space-y-5">
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

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-brand-pink-light/30 rounded-full flex items-center justify-center text-2xl shrink-0">📍</div>
                <p className="font-semibold text-brand-dark">Our Locations</p>
              </div>
              <ul className="space-y-3.5 pl-1">
                {locations.map(({ name, phone }) => (
                  <li key={name} className="flex items-center justify-between">
                    <span className="text-brand-dark/80 text-sm font-medium">{name}</span>
                    {phone ? (
                      <a
                        href={`tel:+961${phone}`}
                        className="text-brand-dark/40 text-sm hover:text-brand-pink transition-colors"
                      >
                        {phone}
                      </a>
                    ) : (
                      <span className="text-brand-dark/30 text-xs italic">Coming soon</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-10">
            <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Send a Message</h2>
            <p className="text-brand-dark/40 text-sm mb-8">We usually reply within a few hours.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
