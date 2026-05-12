import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'

const locations = [
  { name: 'Clemenceau', phone: '71520891' },
  { name: 'Jal El Dib',  phone: '70999158' },
  { name: 'Kfarehbeb',   phone: '71012302' },
  { name: 'Batroun',     phone: '71411085' },
  { name: 'Bliss',       phone: null },
]

const navLinks = [
  ['/', 'Home'],
  ['/menu', 'Menu'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
] as const

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

          {/* Brand */}
          <div>
            <Image
              src="/xndoughs-logo.png"
              alt="XnDoughs"
              width={200}
              height={68}
              className="h-[68px] w-auto brightness-0 invert"
            />
            <p className="mt-4 text-white/50 text-sm leading-relaxed">
              Your Sweet Escape.
            </p>
            <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/xndoughs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/8 text-white/60 hover:bg-brand-pink hover:text-white transition-all duration-200"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://wa.me/96178965285"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/8 text-white/60 hover:bg-brand-pink hover:text-white transition-all duration-200"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-xs mb-5 text-white/40 uppercase tracking-widest">Pages</p>
            <ul className="space-y-3">
              {navLinks.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/60 text-sm hover:text-brand-pink-light transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <p className="font-semibold text-xs mb-5 text-white/40 uppercase tracking-widest">Find Us</p>
            <ul className="space-y-3.5">
              {locations.map(({ name, phone }) => (
                <li key={name} className="flex items-start gap-2.5 justify-center md:justify-start">
                  <MapPin size={14} className="text-brand-pink shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white/80 text-sm leading-none">{name}</span>
                    {phone && (
                      <a
                        href={`tel:+961${phone}`}
                        className="text-white/40 text-xs hover:text-brand-pink-light transition-colors flex items-center gap-1"
                      >
                        <Phone size={10} />
                        {phone}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/25 text-xs">
          <span className="text-center sm:text-left">© {new Date().getFullYear()} XnDoughs. All rights reserved.</span>
          <span>
            Powered by{' '}
            <a
              href="https://justechlb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors underline underline-offset-2"
            >
              JUSTECH
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
