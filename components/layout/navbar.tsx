'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function close() { setOpen(false) }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-pink-light/30">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" onClick={close}>
            <Image
              src="/xndoughs-logo.png"
              alt="XnDoughs"
              width={220}
              height={74}
              className="h-[72px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
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

          {/* Mobile donut toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-brand-pink-light/20 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} className="text-brand-dark" />
                </motion.span>
              ) : (
                <motion.span
                  key="hamburger"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} className="text-brand-dark" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 z-40 bg-brand-cream border-b border-brand-pink-light/30 shadow-lg md:hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col items-center gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    className={cn(
                      'block py-3.5 text-lg font-semibold border-b border-brand-dark/5 transition-colors',
                      pathname === link.href
                        ? 'text-brand-pink'
                        : 'text-brand-dark/80 hover:text-brand-pink'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.06, duration: 0.2 }}
                className="pt-4 w-full"
              >
                <a
                  href="https://wa.me/96178965285"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="block w-full text-center bg-brand-pink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-pink/90 transition-colors"
                >
                  Order Now
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>
    </>
  )
}
