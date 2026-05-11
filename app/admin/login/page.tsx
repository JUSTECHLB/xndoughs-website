'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-sm">
        <div className="flex justify-center mb-8">
          <Image src="/xndoughs-logo.png" alt="XnDoughs" width={120} height={40} className="h-10 w-auto" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-dark mb-1 text-center">Admin Login</h1>
        <p className="text-brand-dark/40 text-sm text-center mb-8">XnDoughs dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
