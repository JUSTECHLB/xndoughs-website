'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🍩' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/content', label: 'Page Content', icon: '📝' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Image src="/xndoughs-logo.png" alt="XnDoughs" width={100} height={34} className="h-8 w-auto" />
        <p className="text-xs text-gray-400 mt-1.5 font-medium">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-pink/10 text-brand-pink'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-500 text-sm"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
