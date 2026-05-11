# XnDoughs Website — Design Spec

**Date:** 2026-05-11  
**Status:** Approved  
**Scope:** Marketing/showcase website with admin panel (no ordering)

---

## 1. Overview

A modern, playful, Gen-Z-energy marketing website for **XnDoughs** — a Lebanese dessert shop specializing in donuts and a wide range of baked goods, located in Clemenceau, Beirut. The site showcases products and brand identity. Online ordering is explicitly out of scope for this phase.

**Tech stack:** Next.js 15 (App Router), TailwindCSS, Shadcn UI, Supabase (PostgreSQL + Auth + Storage), Vercel

---

## 2. Architecture

### Rendering Strategy
Server components fetch data from Supabase on each request. No client-side data fetching on public pages — content is always fresh, fast, and SEO-friendly. Client components are used only where Framer Motion animations require browser APIs.

### Route Structure
```
/                    → Home (public, server component)
/menu                → Menu with category filter (public)
/about               → About / brand story (public)
/contact             → Contact info + form (public)
/admin               → Admin dashboard (protected)
/admin/login         → Supabase Auth login
/admin/products      → Product CRUD
/admin/categories    → Category CRUD
/admin/content       → Edit About + Contact page text
```

### Auth Flow
Admin routes check the Supabase session server-side via middleware. Unauthenticated requests to `/admin/*` redirect to `/admin/login`. Only email/password auth is needed (single small team).

---

## 3. Database Schema

### `categories`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | auto-generated |
| name | text | "Cookies", "Cinnamon Rolls" |
| slug | text | "cookies", "cinnamon-rolls" |
| image_url | text | Supabase Storage URL |
| display_order | integer | controls sort order |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | auto-generated |
| category_id | uuid FK | → categories |
| name | text | product name |
| description | text | optional short description |
| price | numeric | USD |
| image_url | text | Supabase Storage URL |
| is_featured | boolean | shows on Home page |
| is_available | boolean | hide without deleting |
| display_order | integer | controls sort order within category |

### `page_content`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | auto-generated |
| page | text | "about" or "contact" |
| section | text | "hero", "story", "address", "whatsapp", etc. |
| content | jsonb | flexible structure per section |

### Row-Level Security
All tables have RLS enabled. Public role: `SELECT` only. Authenticated admin role: full `INSERT`, `UPDATE`, `DELETE`.

---

## 4. Visual Design

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Hot pink (primary) | `#C9287A` | Buttons, accents, headings |
| Soft pink (secondary) | `#E8A5C8` | Backgrounds, hover states |
| Cream (base) | `#FFF8F5` | Page background |
| Near-black | `#1A0A0F` | Body text |
| White | `#FFFFFF` | Cards, surfaces |

### Typography
- **Display / headings:** Playfair Display (Google Fonts) — editorial, elegant
- **Body / UI:** Inter (Google Fonts) — clean, readable, modern

### Animation (Framer Motion)
- **Hero:** Floating donut/product illustrations drift slowly; headline staggers in on load
- **Scroll reveals:** Product cards and content sections animate in as they enter the viewport
- **Product card hover:** Slight lift + hot pink glow box-shadow
- **Menu tabs:** Sliding underline indicator animates between active categories
- **Page transitions:** Smooth fade + upward slide between routes

---

## 5. Pages

### Home (`/`)
1. **Hero** — Full-screen, cream background with floating product/donut illustrations. Large display headline ("Handcrafted with love in Beirut"), sub-copy, and a hot-pink CTA button linking to `/menu`
2. **Featured Products** — Horizontal scroll strip of products where `is_featured = true`. Each card shows image, name, price, and a hover glow effect
3. **Category Grid** — Visual grid of all categories with image + name. Clicking navigates to `/menu?category=<slug>`
4. **Brand Teaser** — Short punchy brand statement section with a warm background
5. **Footer CTA** — "Order via WhatsApp" button + Instagram link

### Menu (`/menu`)
- Sticky category tab bar at the top; active tab has sliding hot-pink underline
- URL reflects active category: `/menu?category=cookies`
- Product grid below: responsive 2–4 column layout
- Each card: product image, name, price, availability badge (hidden if `is_available = false`)
- Animated category switch: cards fade/slide out and new ones animate in

### About (`/about`)
- Split layout: brand story text (left) + large product photography (right)
- Values/philosophy section below (icons + short text)
- Content editable via `page_content` table (page = "about")

### Contact (`/contact`)
- WhatsApp button (primary CTA, links to `wa.me/<number>`)
- Phone number, location (Clemenceau, Beirut)
- Instagram link
- Simple contact form (name, message) — submissions stored in a `contact_submissions` Supabase table; no email relay needed for this phase
- Content editable via `page_content` table (page = "contact")

---

## 6. Admin Panel (`/admin`)

Built with Shadcn UI components on a clean minimal layout. Sidebar navigation with links to each section.

### Products (`/admin/products`)
- Shadcn data table listing all products with columns: image thumbnail, name, category, price, featured toggle, available toggle, actions
- "New Product" button opens a Shadcn dialog/sheet with form fields
- Image upload via Supabase Storage; preview shown before save
- Drag-to-reorder within category (updates `display_order`)
- Inline toggle for `is_featured` and `is_available`

### Categories (`/admin/categories`)
- Data table: image, name, slug, display_order
- CRUD via dialog/sheet
- Image upload via Supabase Storage
- Drag-to-reorder

### Content (`/admin/content`)
- Tab per page (About, Contact)
- Editable text fields per section key, saved to `page_content`
- Allows admin to update brand story, address, WhatsApp number without code changes

### Auth
- `/admin/login` — simple email/password form using Supabase Auth
- Session managed via Supabase SSR helpers (`@supabase/ssr`)
- Next.js middleware protects all `/admin/*` routes

---

## 7. Out of Scope (This Phase)
- Online ordering / cart / checkout
- Arabic language support
- Customer accounts
- Email marketing / newsletters
- Loyalty program
