'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const floatingItems = [
  { emoji: '🍩', top: '18%', left: '62%', delay: '0s',   duration: '4.2s', size: '3.5rem' },
  { emoji: '🍪', top: '38%', left: '78%', delay: '1.1s',  duration: '5.0s', size: '2.5rem' },
  { emoji: '🧁', top: '60%', left: '68%', delay: '0.6s',  duration: '4.6s', size: '3rem'   },
  { emoji: '🍩', top: '72%', left: '82%', delay: '1.8s',  duration: '3.8s', size: '2rem'   },
  { emoji: '🎂', top: '22%', left: '88%', delay: '2.2s',  duration: '5.4s', size: '2.8rem' },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen bg-brand-cream overflow-hidden flex items-center">
      <div
        className="absolute top-[-8%] right-[5%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8A5C8 0%, transparent 70%)', opacity: 0.35 }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8A5C8 0%, transparent 70%)', opacity: 0.2 }}
      />

      {floatingItems.map((item, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none hidden md:block"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationName: 'float',
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          {item.emoji}
        </span>
      ))}

      <div className="container mx-auto px-6 relative z-10 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-center md:text-left mx-auto md:mx-0"
        >
          <motion.p variants={fadeUp} className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-5">
            Handcrafted with Heart
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-brand-dark leading-[1.05] text-6xl md:text-7xl lg:text-8xl"
          >
            Made with<br />
            <span className="text-brand-pink">Love &</span><br />
            Dough.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-7 text-lg md:text-xl text-brand-dark/60 max-w-md leading-relaxed mx-auto md:mx-0">
            Donuts, cookies, cinnamon rolls, and more. Your sweet escape, handcrafted with heart.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link
              href="/menu"
              className="bg-brand-pink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-pink/90 transition-all hover:shadow-lg"
            >
              Explore Our Menu
            </Link>
            <a
              href="https://wa.me/96178965285"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-pink text-brand-pink px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-pink/5 transition-colors"
            >
              Order via WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
