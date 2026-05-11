'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoryDialog } from '@/components/admin/category-dialog'

export default function CategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order')
    setCategories(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  function openNew() { setEditing(null); setDialogOpen(true) }
  function openEdit(cat: Category) { setEditing(cat); setDialogOpen(true) }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? All its products will also be deleted.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openNew} className="bg-brand-pink hover:bg-brand-pink/90 text-white">
          + New Category
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Image</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {cat.image_url ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">🍩</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="font-mono text-xs">{cat.slug}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.display_order}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} className="mr-2">Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-600">Delete</Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No categories yet. Add one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) fetchCategories() }}
        category={editing}
      />
    </div>
  )
}
