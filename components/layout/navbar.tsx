'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-pink-light/30">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/xndoughs-logo.png"
            alt="XnDoughs"
            width={130}
            height={44}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-medium transition-colors text-sm',
                pathname === link.href
                  ? 'text-brand-pink'
                  : 'text-brand-dark/70 hover:text-brand-pink'
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/96178965285"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-pink text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-pink/90 transition-colors"
          >
            Order Now
          </a>
        </div>
        <div className="md:hidden flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-dark/70 hover:text-brand-pink text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
