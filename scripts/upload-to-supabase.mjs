// Upload all menu images from public/menu-images/ to Supabase Storage bucket "product-images"
// Then print SQL UPDATE statements to patch categories.image_url and products.image_url
//
// Prerequisites:
//   - .env.local must contain NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
//   - The "product-images" bucket must exist in your Supabase project
//   - Images must already be downloaded (run scripts/download-menu-images.mjs first)
//
// Run with: node scripts/upload-to-supabase.mjs

import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

async function loadEnv() {
  try {
    const raw = await readFile(join(ROOT, '.env.local'), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      process.env[key] ??= val
    }
  } catch {
    // .env.local missing — caller must set env vars manually
  }
}

await loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const BUCKET = 'product-images'
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1`

async function uploadFile(localPath, storagePath) {
  const buf = await readFile(localPath)
  const ext = localPath.split('.').pop().toLowerCase()
  const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'

  const url = `${STORAGE_BASE}/object/${BUCKET}/${storagePath}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buf,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${text}`)
  }

  return `${STORAGE_BASE}/object/public/${BUCKET}/${storagePath}`
}

async function main() {
  const catDir = join(ROOT, 'public', 'menu-images', 'categories')
  const prodDir = join(ROOT, 'public', 'menu-images', 'products')

  const catFiles = await readdir(catDir)
  const prodFiles = await readdir(prodDir)

  let ok = 0, fail = 0
  const catUpdates = []
  const prodUpdates = []

  console.log(`\nUploading ${catFiles.length} category images...`)
  for (const file of catFiles) {
    const slug = file.replace(/\.[^.]+$/, '')
    const storagePath = `categories/${file}`
    try {
      const url = await uploadFile(join(catDir, file), storagePath)
      catUpdates.push({ slug, url })
      console.log(`  ✓ ${file}`)
      ok++
    } catch (e) {
      console.log(`  ✗ ${file}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nUploading ${prodFiles.length} product images...`)
  for (const file of prodFiles) {
    const name = file.replace(/\.[^.]+$/, '')
    const storagePath = `products/${file}`
    try {
      const url = await uploadFile(join(prodDir, file), storagePath)
      prodUpdates.push({ name, url, file })
      console.log(`  ✓ ${file}`)
      ok++
    } catch (e) {
      console.log(`  ✗ ${file}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed`)

  if (catUpdates.length === 0 && prodUpdates.length === 0) return

  console.log('\n-- SQL to update image URLs in the database --')
  console.log('-- Paste this into the Supabase SQL Editor --\n')

  for (const { slug, url } of catUpdates) {
    console.log(`UPDATE categories SET image_url = '${url}' WHERE slug = '${slug}';`)
  }

  for (const { name, url, file } of prodUpdates) {
    const ext = file.split('.').pop()
    const localPath = `/menu-images/products/${name}.${ext}`
    console.log(`UPDATE products SET image_url = '${url}' WHERE image_url = '${localPath}';`)
  }
}

main().catch(console.error)
