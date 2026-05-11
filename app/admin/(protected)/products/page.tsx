'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ProductDialog } from '@/components/admin/product-dialog'

export default function ProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('display_order'),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts(prods ?? [])
    setCategories(cats ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  function openNew() { setEditing(null); setDialogOpen(true) }
  function openEdit(p: Product) { setEditing(p); setDialogOpen(true) }

  async function toggleFeatured(p: Product) {
    await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id)
    fetchData()
  }

  async function toggleAvailable(p: Product) {
    await supabase.from('products').update({ is_available: !p.is_available }).eq('id', p.id)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products</p>
        </div>
        <Button onClick={openNew} className="bg-brand-pink hover:bg-brand-pink/90 text-white">
          + New Product
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Image</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Featured</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Available</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">🍩</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {(p.categories as unknown as { name: string })?.name ?? '—'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Switch checked={p.is_featured} onCheckedChange={() => toggleFeatured(p)} />
                  </td>
                  <td className="px-4 py-3">
                    <Switch checked={p.is_available} onCheckedChange={() => toggleAvailable(p)} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)} className="mr-2">Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-600">Delete</Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) fetchData() }}
        product={editing}
        categories={categories}
      />
    </div>
  )
}
