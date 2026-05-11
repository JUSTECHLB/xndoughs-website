import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Image
              src="/xndoughs-logo.png"
              alt="XnDoughs"
              width={110}
              height={38}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-white/50 text-sm leading-relaxed">
              Handcrafted desserts made from scratch. Located in Clemenceau, Beirut.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wide">Pages</p>
              <ul className="space-y-2.5 text-white/50 text-sm">
                {([['/', 'Home'], ['/menu', 'Menu'], ['/about', 'About'], ['/contact', 'Contact']] as const).map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-brand-pink-light transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wide">Connect</p>
              <ul className="space-y-2.5 text-white/50 text-sm">
                <li>
                  <a
                    href="https://www.instagram.com/xndoughs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-pink-light transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/96178965285"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-pink-light transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-white/30 text-xs">
          © {new Date().getFullYear()} XnDoughs. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
