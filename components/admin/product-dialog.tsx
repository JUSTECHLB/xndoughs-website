'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ImageUpload } from './image-upload'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  product?: Product | null
  categories: Category[]
}

export function ProductDialog({ open, onOpenChange, product, categories }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [displayOrder, setDisplayOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description ?? '')
      setPrice(String(product.price))
      setCategoryId(product.category_id)
      setImageUrl(product.image_url ?? '')
      setIsFeatured(product.is_featured)
      setIsAvailable(product.is_available)
      setDisplayOrder(product.display_order)
    } else {
      setName(''); setDescription(''); setPrice(''); setCategoryId('')
      setImageUrl(''); setIsFeatured(false); setIsAvailable(true); setDisplayOrder(0)
    }
    setError(null)
  }, [product, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryId) { setError('Please select a category'); return }
    setLoading(true)
    setError(null)
    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: categoryId,
      image_url: imageUrl || null,
      is_featured: isFeatured,
      is_available: isAvailable,
      display_order: displayOrder,
    }
    const { error: dbError } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)
    setLoading(false)
    if (dbError) { setError(dbError.message); return }
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1.5 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (USD)</Label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image</Label>
            <div className="mt-1.5">
              <ImageUpload value={imageUrl} onChange={setImageUrl} folder="products" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="featured" className="cursor-pointer">Featured on Home</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <Label htmlFor="available" className="cursor-pointer">Available</Label>
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
