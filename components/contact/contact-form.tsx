'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success("Message sent! We'll get back to you soon.")
      setName('')
      setMessage('')
    } else {
      toast.error('Failed to send. Try WhatsApp instead.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-brand-dark">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
          className="h-12 px-4 text-sm rounded-xl border-brand-dark/10 focus:border-brand-pink"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold text-brand-dark">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you're looking for: a custom order, a question, anything..."
          rows={8}
          required
          className="px-4 py-3 text-sm rounded-xl border-brand-dark/10 focus:border-brand-pink resize-none leading-relaxed"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full font-semibold text-sm"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
