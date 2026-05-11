'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string) => void
  folder?: string
}

export function ImageUpload({ value, onChange, folder = 'misc' }: ImageUploadProps) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    setUploading(true)
    setError(null)
    const path = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '_')}`
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    onChange(publicUrl)
    setUploading(false)
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onChange('')}
          >
            Remove
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}
