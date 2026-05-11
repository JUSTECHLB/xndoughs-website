'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ImageUpload } from './image-upload'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setImageUrl(category.image_url ?? '')
      setDisplayOrder(category.display_order)
    } else {
      setName(''); setSlug(''); setImageUrl(''); setDisplayOrder(0)
    }
    setError(null)
  }, [category, open])

  function handleNameChange(value: string) {
    setName(value)
    if (!category) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const payload = { name, slug, image_url: imageUrl || null, display_order: displayOrder }
    const { error: dbError } = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload)
    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'New Category'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => handleNameChange(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1.5 font-mono text-sm" />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="mt-1.5 w-24" />
          </div>
          <div>
            <Label>Image</Label>
            <div className="mt-1.5">
              <ImageUpload value={imageUrl} onChange={setImageUrl} folder="categories" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-brand-pink hover:bg-brand-pink/90 text-white">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
