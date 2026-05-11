'use client'
import { motion } from 'framer-motion'

export function BrandTeaser() {
  return (
    <section className="py-28 bg-brand-pink relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/70 font-bold tracking-[0.2em] uppercase text-xs mb-5">Our Promise</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight max-w-2xl mx-auto">
            No shortcuts.<br />Ever.
          </h2>
          <p className="mt-6 text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
            Every item is made from scratch in our Clemenceau kitchen. Real ingredients, real love, real flavor.
          </p>
          <a
            href="https://wa.me/96178965285"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-10 bg-white text-brand-pink font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/90 transition-colors"
          >
            Order via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
