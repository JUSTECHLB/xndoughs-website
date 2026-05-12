import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'XnDoughs | Handcrafted Desserts with Heart',
  description: 'Artisan donuts, cookies, cinnamon rolls and more. Your Sweet Escape.',
  openGraph: {
    title: 'XnDoughs',
    description: 'Your Sweet Escape.',
    images: ['/xndoughs-logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
