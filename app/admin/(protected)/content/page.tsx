'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AboutHero { headline: string; subtext: string }
interface AboutStory { text: string }
interface ContactInfo { whatsapp: string; location: string; instagram: string }

export default function ContentPage() {
  const supabase = createClient()
  const [aboutHero, setAboutHero] = useState<AboutHero>({ headline: '', subtext: '' })
  const [aboutStory, setAboutStory] = useState<AboutStory>({ text: '' })
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ whatsapp: '', location: '', instagram: '' })
  const [loading, setLoading] = useState(false)

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from('page_content').select('*')
    data?.forEach((row) => {
      if (row.page === 'about' && row.section === 'hero') setAboutHero(row.content as AboutHero)
      if (row.page === 'about' && row.section === 'story') setAboutStory(row.content as AboutStory)
      if (row.page === 'contact' && row.section === 'info') setContactInfo(row.content as ContactInfo)
    })
  }, [supabase])

  useEffect(() => { fetchContent() }, [fetchContent])

  async function save(page: string, section: string, content: Record<string, unknown>) {
    setLoading(true)
    const { error } = await supabase
      .from('page_content')
      .upsert({ page, section, content, updated_at: new Date().toISOString() }, { onConflict: 'page,section' })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`${page} / ${section} updated.`)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Page Content</h1>
      <p className="text-gray-500 text-sm mb-8">Edit text that appears on the public pages.</p>

      <Tabs defaultValue="about" className="max-w-2xl">
        <TabsList className="mb-6">
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Hero Section</h2>
            <div>
              <Label>Headline</Label>
              <Input
                value={aboutHero.headline}
                onChange={(e) => setAboutHero((p) => ({ ...p, headline: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Subtext</Label>
              <Input
                value={aboutHero.subtext}
                onChange={(e) => setAboutHero((p) => ({ ...p, subtext: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <Button
              onClick={() => save('about', 'hero', aboutHero as unknown as Record<string, unknown>)}
              disabled={loading}
              className="bg-brand-pink hover:bg-brand-pink/90 text-white"
            >
              Save Hero
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Brand Story</h2>
            <div>
              <Label>Story Text</Label>
              <Textarea
                value={aboutStory.text}
                onChange={(e) => setAboutStory({ text: e.target.value })}
                rows={6}
                className="mt-1.5 resize-none"
              />
            </div>
            <Button
              onClick={() => save('about', 'story', aboutStory as unknown as Record<string, unknown>)}
              disabled={loading}
              className="bg-brand-pink hover:bg-brand-pink/90 text-white"
            >
              Save Story
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Contact Information</h2>
            <div>
              <Label>WhatsApp Number (digits only, e.g. 96178965285)</Label>
              <Input
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo((p) => ({ ...p, whatsapp: e.target.value }))}
                className="mt-1.5 font-mono"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={contactInfo.location}
                onChange={(e) => setContactInfo((p) => ({ ...p, location: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                value={contactInfo.instagram}
                onChange={(e) => setContactInfo((p) => ({ ...p, instagram: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <Button
              onClick={() => save('contact', 'info', contactInfo as unknown as Record<string, unknown>)}
              disabled={loading}
              className="bg-brand-pink hover:bg-brand-pink/90 text-white"
            >
              Save Contact Info
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
