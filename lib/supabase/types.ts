export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  display_order: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_featured: boolean
  is_available: boolean
  display_order: number
  created_at: string
  categories?: Category
}

export interface PageContent {
  id: string
  page: string
  section: string
  content: Record<string, unknown>
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  message: string
  created_at: string
}
