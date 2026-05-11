# XnDoughs Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playful Gen-Z-energy marketing website for XnDoughs dessert shop with public showcase pages and a protected admin panel for managing products, categories, and page content via Supabase.

**Architecture:** Next.js 15 App Router with a `(public)` route group (Navbar + Footer) for showcase pages and a separate `/admin` section (sidebar nav). The home page server component fetches data and passes it to client components. Client components handle all animations, forms, and image uploads. Next.js middleware protects all `/admin/*` routes via Supabase session checks.

**Tech Stack:** Next.js 15, TailwindCSS, Shadcn UI, Supabase (PostgreSQL + Auth + Storage), Framer Motion, Vercel

---

## File Map

```
app/
  layout.tsx                    root layout: fonts, body, global CSS
  globals.css                   CSS vars, float keyframe animation
  (public)/
    layout.tsx                  public layout: Navbar + Footer
    page.tsx                    Home page (server, fetches featured + categories)
    menu/page.tsx               Menu page (server, fetches all data)
    about/page.tsx              About page (server, fetches page_content)
    contact/page.tsx            Contact page (server, fetches page_content)
  admin/
    login/page.tsx              Admin login form (NO sidebar)
    (protected)/                Route group — all routes here get sidebar layout
      layout.tsx                Admin layout: sidebar wrapper
      page.tsx                  Admin dashboard  (/admin)
      products/page.tsx         Products CRUD    (/admin/products)
      categories/page.tsx       Categories CRUD  (/admin/categories)
      content/page.tsx          Page content editor (/admin/content)
  api/contact/route.ts          POST: store contact form submission

components/
  layout/
    navbar.tsx                  Public nav (logo + links + WhatsApp CTA)
    footer.tsx                  Public footer
  home/
    hero.tsx                    Hero section with Framer Motion animations
    featured-products.tsx       Horizontal product grid (client, receives props)
    category-grid.tsx           Category image grid (client, receives props)
    brand-teaser.tsx            Brand statement section
  product-card.tsx              Shared product card with hover effect
  menu/
    category-tabs.tsx           Sticky tab bar with URL sync (client)
    product-grid.tsx            Animated product grid with filter (client)
  about/
    values-section.tsx          Values/philosophy section
  contact/
    contact-form.tsx            Contact form (client, posts to API)
  admin/
    sidebar.tsx                 Admin sidebar navigation
    image-upload.tsx            Supabase Storage uploader (client)
    category-dialog.tsx         Create/edit category modal (client)
    product-dialog.tsx          Create/edit product modal (client)

lib/
  supabase/
    client.ts                   Browser client factory
    server.ts                   Server client factory (async cookies)
    types.ts                    Shared TypeScript interfaces
  utils.ts                      cn() helper

middleware.ts                   Redirect unauthenticated /admin/* to /admin/login
supabase/migrations/001_initial.sql   All tables + RLS + seed data
public/xndoughs-logo.png        Logo asset (moved from project root)
```

---

## Task 1: Initialize Next.js project and install dependencies

**Files:**
- Create: all Next.js scaffold files
- Create: `.env.local.example`

- [ ] **Step 1: Run create-next-app in the existing directory**

```bash
cd /Users/omarchounan/Desktop/xndoughs
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

When prompted "The directory . contains files that could conflict" → answer **y** to continue. Answer the prompts: TypeScript=Yes, ESLint=Yes, Tailwind=Yes, src/ directory=No, App Router=Yes, import alias=Yes (`@/*`).

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion
npm install -D @types/node
```

- [ ] **Step 3: Initialize Shadcn UI**

```bash
npx shadcn@latest init -d
```

When prompted for style choose **Default**, base color choose **Rose**, CSS variables choose **Yes**.

- [ ] **Step 4: Add required Shadcn components**

```bash
npx shadcn@latest add button card table dialog sheet form input label select switch badge tabs toast textarea separator
```

- [ ] **Step 5: Move logo to public directory**

```bash
cp /Users/omarchounan/Desktop/xndoughs/xndoughs-logo.png /Users/omarchounan/Desktop/xndoughs/public/xndoughs-logo.png
```

- [ ] **Step 6: Create .env.local.example**

Create `.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: initialize Next.js 15 project with Shadcn and Supabase deps"
```

---

## Task 2: Supabase project setup and database migration

**Files:**
- Create: `supabase/migrations/001_initial.sql`
- Create: `.env.local` (not committed)

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com → New project. Note down the **Project URL** and **anon public** key from Settings → API.

- [ ] **Step 2: Create .env.local**

```bash
# .env.local (create manually, do NOT commit this file)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Add `.env.local` to `.gitignore` if not already there:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 3: Write the migration SQL**

Create `supabase/migrations/001_initial.sql`:

```sql
create extension if not exists "uuid-ossp";

create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_featured boolean not null default false,
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz default now()
);

create table page_content (
  id uuid primary key default uuid_generate_v4(),
  page text not null,
  section text not null,
  content jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique(page, section)
);

create table contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table categories enable row level security;
alter table products enable row level security;
alter table page_content enable row level security;
alter table contact_submissions enable row level security;

create policy "Public read categories" on categories for select to anon using (true);
create policy "Public read products" on products for select to anon using (true);
create policy "Public read page_content" on page_content for select to anon using (true);
create policy "Public insert contact" on contact_submissions for insert to anon with check (true);

create policy "Admin all categories" on categories for all to authenticated using (true) with check (true);
create policy "Admin all products" on products for all to authenticated using (true) with check (true);
create policy "Admin all page_content" on page_content for all to authenticated using (true) with check (true);
create policy "Admin read submissions" on contact_submissions for select to authenticated using (true);

insert into page_content (page, section, content) values
  ('about', 'hero', '{"headline": "Handcrafted With Love", "subtext": "Born in Beirut, made from scratch."}'),
  ('about', 'story', '{"text": "XnDoughs started with a simple belief: that every bite should feel like a celebration. From our kitchen in Clemenceau to yours, every donut, cookie, and cinnamon roll is made with the finest ingredients and a whole lot of love."}'),
  ('about', 'values', '[{"icon": "🧡", "title": "Made From Scratch", "text": "No shortcuts. Ever."}, {"icon": "⭐", "title": "Premium Ingredients", "text": "Only the best make the cut."}, {"icon": "✨", "title": "Crafted With Love", "text": "Every piece tells a story."}]'),
  ('contact', 'info', '{"whatsapp": "96178965285", "location": "Clemenceau, Beirut, Lebanon", "instagram": "https://www.instagram.com/xndoughs/"}');
```

- [ ] **Step 4: Run the migration in Supabase**

In Supabase dashboard → SQL Editor → paste the full contents of `001_initial.sql` → Run.

- [ ] **Step 5: Create Supabase Storage bucket**

In Supabase dashboard → Storage → New bucket:
- Name: `product-images`
- Public bucket: **Yes** (toggle on)

Then go to Storage → Policies → add policy for `product-images`:
- For `INSERT`: allow authenticated users
- Policy expression: `(role() = 'authenticated')`

Or paste this in SQL Editor:
```sql
create policy "Authenticated users can upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "Public can view images"
  on storage.objects for select to anon
  using (bucket_id = 'product-images');
```

- [ ] **Step 6: Create an admin user**

In Supabase dashboard → Authentication → Users → Invite user (or Add user) with the email/password the xndoughs team will use.

- [ ] **Step 7: Commit**

```bash
git add supabase/ .gitignore .env.local.example
git commit -m "feat: add database migration and Supabase setup instructions"
```

---

## Task 3: Supabase client configuration and TypeScript types

**Files:**
- Create: `lib/supabase/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/utils.ts`

- [ ] **Step 1: Write shared TypeScript types**

Create `lib/supabase/types.ts`:

```typescript
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
```

- [ ] **Step 2: Write browser client factory**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Write server client factory**

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 4: Write utils**

Create `lib/utils.ts` (or update if Shadcn already created it — add the `cn` helper if missing):

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add Supabase client factories and shared types"
```

---

## Task 4: Next.js middleware for admin route protection

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware**

Create `middleware.ts` at the project root:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/admin'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify middleware is correct**

Run the dev server and navigate to `http://localhost:3000/admin` — confirm it redirects to `/admin/login`.

```bash
npm run dev
```

Open browser → go to `http://localhost:3000/admin` → should redirect to `http://localhost:3000/admin/login`.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware to protect admin routes"
```

---

## Task 5: Tailwind config, global CSS, and root layout

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `app/layout.tsx`

- [ ] **Step 1: Update tailwind.config.ts with brand colors and fonts**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#C9287A',
          'pink-light': '#E8A5C8',
          cream: '#FFF8F5',
          dark: '#1A0A0F',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 2: Update app/globals.css**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 20 100% 98%;
    --foreground: 341 44% 7%;
    --card: 0 0% 100%;
    --card-foreground: 341 44% 7%;
    --popover: 0 0% 100%;
    --popover-foreground: 341 44% 7%;
    --primary: 329 64% 47%;
    --primary-foreground: 0 0% 100%;
    --secondary: 329 55% 92%;
    --secondary-foreground: 341 44% 7%;
    --muted: 329 20% 96%;
    --muted-foreground: 329 10% 50%;
    --accent: 329 55% 92%;
    --accent-foreground: 341 44% 7%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 329 20% 90%;
    --input: 329 20% 90%;
    --ring: 329 64% 47%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-brand-cream text-brand-dark font-sans;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(4deg); }
}
```

- [ ] **Step 3: Write root layout**

Replace `app/layout.tsx` with:

```typescript
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'XnDoughs — Handcrafted Desserts in Beirut',
  description: 'Artisan donuts, cookies, cinnamon rolls and more. Made from scratch in Clemenceau, Beirut.',
  openGraph: {
    title: 'XnDoughs',
    description: 'Handcrafted desserts made from scratch in Beirut.',
    images: ['/xndoughs-logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: configure brand colors, fonts, and root layout"
```

---

## Task 6: Public layout, Navbar, and Footer

**Files:**
- Create: `app/(public)/layout.tsx`
- Create: `components/layout/navbar.tsx`
- Create: `components/layout/footer.tsx`

- [ ] **Step 1: Write Navbar**

Create `components/layout/navbar.tsx`:

```typescript
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-pink-light/30">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/xndoughs-logo.png"
            alt="XnDoughs"
            width={130}
            height={44}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-medium transition-colors text-sm',
                pathname === link.href
                  ? 'text-brand-pink'
                  : 'text-brand-dark/70 hover:text-brand-pink'
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/96178965285"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-pink text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-pink/90 transition-colors"
          >
            Order Now
          </a>
        </div>
        {/* Mobile: just show Order Now */}
        <div className="md:hidden flex items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-dark/70 hover:text-brand-pink text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Write Footer**

Create `components/layout/footer.tsx`:

```typescript
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="container mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Image
              src="/xndoughs-logo.png"
              alt="XnDoughs"
              width={110}
              height={38}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-white/50 text-sm leading-relaxed">
              Handcrafted desserts made from scratch. Located in Clemenceau, Beirut.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wide">Pages</p>
              <ul className="space-y-2.5 text-white/50 text-sm">
                {([['/', 'Home'], ['/menu', 'Menu'], ['/about', 'About'], ['/contact', 'Contact']] as const).map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-brand-pink-light transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wide">Connect</p>
              <ul className="space-y-2.5 text-white/50 text-sm">
                <li>
                  <a
                    href="https://www.instagram.com/xndoughs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-pink-light transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/96178965285"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-pink-light transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-white/30 text-xs">
          © {new Date().getFullYear()} XnDoughs. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Write public layout**

Create `app/(public)/layout.tsx`:

```typescript
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(public\)/ components/layout/
git commit -m "feat: add public layout, Navbar, and Footer"
```

---

## Task 7: Shared ProductCard component

**Files:**
- Create: `components/product-card.tsx`

- [ ] **Step 1: Write ProductCard**

Create `components/product-card.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Product } from '@/lib/supabase/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden cursor-default"
      style={{ boxShadow: '0 2px 12px rgba(201, 40, 122, 0.08)' }}
    >
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🍩</span>
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-brand-dark/50 bg-white px-3 py-1 rounded-full border border-brand-dark/10">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-brand-dark text-base leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-brand-dark/50 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <p className="text-brand-pink font-bold mt-2 text-sm">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/product-card.tsx
git commit -m "feat: add shared ProductCard component with hover animation"
```

---

## Task 8: Home — Hero section

**Files:**
- Create: `components/home/hero.tsx`

- [ ] **Step 1: Write Hero**

Create `components/home/hero.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const floatingItems = [
  { emoji: '🍩', top: '18%', left: '62%', delay: '0s',   duration: '4.2s', size: '3.5rem' },
  { emoji: '🍪', top: '38%', left: '78%', delay: '1.1s',  duration: '5.0s', size: '2.5rem' },
  { emoji: '🧁', top: '60%', left: '68%', delay: '0.6s',  duration: '4.6s', size: '3rem'   },
  { emoji: '🍩', top: '72%', left: '82%', delay: '1.8s',  duration: '3.8s', size: '2rem'   },
  { emoji: '🎂', top: '22%', left: '88%', delay: '2.2s',  duration: '5.4s', size: '2.8rem' },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen bg-brand-cream overflow-hidden flex items-center">
      {/* Soft blob */}
      <div
        className="absolute top-[-8%] right-[5%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #E8A5C8 0%, transparent 70%)',
          opacity: 0.35,
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #E8A5C8 0%, transparent 70%)',
          opacity: 0.2,
        }}
      />

      {/* Floating food items */}
      {floatingItems.map((item, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none hidden md:block"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationName: 'float',
            animationDuration: item.duration,
            animationDelay: item.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        >
          {item.emoji}
        </span>
      ))}

      <div className="container mx-auto px-6 relative z-10 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.p variants={fadeUp} className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-5">
            Handcrafted in Beirut
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-brand-dark leading-[1.05] text-6xl md:text-7xl lg:text-8xl"
          >
            Made with<br />
            <span className="text-brand-pink">Love &</span><br />
            Dough.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-7 text-lg md:text-xl text-brand-dark/60 max-w-md leading-relaxed">
            Donuts, cookies, cinnamon rolls, and more — all made from scratch at our Clemenceau kitchen.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="bg-brand-pink text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-pink/90 transition-all hover:shadow-lg hover:shadow-brand-pink/25"
            >
              Explore Our Menu
            </Link>
            <a
              href="https://wa.me/96178965285"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-pink text-brand-pink px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-pink/5 transition-colors"
            >
              Order via WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/hero.tsx
git commit -m "feat: add Hero section with Framer Motion animations and floating items"
```

---

## Task 9: Home — Featured Products and Category Grid

**Files:**
- Create: `components/home/featured-products.tsx`
- Create: `components/home/category-grid.tsx`

- [ ] **Step 1: Write FeaturedProducts**

Create `components/home/featured-products.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/supabase/types'

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-3">
            Must Try
          </p>
          <h2 className="font-display text-5xl font-bold text-brand-dark">Fan Favorites</h2>
          <p className="text-brand-dark/50 mt-3 text-lg">Our most-loved treats, made fresh daily</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write CategoryGrid**

Create `components/home/category-grid.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/lib/supabase/types'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-3">
            Browse
          </p>
          <h2 className="font-display text-5xl font-bold text-brand-dark">Our Menu</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link href={`/menu?category=${cat.slug}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-pink-light/20">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🍩</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/65 via-brand-dark/10 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white font-display font-bold text-lg leading-tight">
                    {cat.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/
git commit -m "feat: add FeaturedProducts and CategoryGrid home sections"
```

---

## Task 10: Home — Brand Teaser and Home page assembly

**Files:**
- Create: `components/home/brand-teaser.tsx`
- Create: `app/(public)/page.tsx`

- [ ] **Step 1: Write BrandTeaser**

Create `components/home/brand-teaser.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'

export function BrandTeaser() {
  return (
    <section className="py-28 bg-brand-pink relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/70 font-bold tracking-[0.2em] uppercase text-xs mb-5">
            Our Promise
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight max-w-2xl mx-auto">
            No shortcuts.<br />Ever.
          </h2>
          <p className="mt-6 text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
            Every item is made from scratch in our Clemenceau kitchen. Real ingredients, real love, real flavor.
          </p>
          <a
            href="https://wa.me/96178965285"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-10 bg-white text-brand-pink font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white/90 transition-colors"
          >
            Order via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Assemble Home page**

Create `app/(public)/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/home/hero'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryGrid } from '@/components/home/category-grid'
import { BrandTeaser } from '@/components/home/brand-teaser'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featured }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('display_order')
      .limit(8),
    supabase
      .from('categories')
      .select('*')
      .order('display_order'),
  ])

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured ?? []} />
      <CategoryGrid categories={categories ?? []} />
      <BrandTeaser />
    </>
  )
}
```

- [ ] **Step 3: Start dev server and verify home page renders**

```bash
npm run dev
```

Open `http://localhost:3000` — you should see the hero section, empty featured products (no products yet), empty category grid, and brand teaser.

- [ ] **Step 4: Commit**

```bash
git add components/home/brand-teaser.tsx app/\(public\)/page.tsx
git commit -m "feat: assemble Home page with all sections"
```

---

## Task 11: Menu page

**Files:**
- Create: `components/menu/category-tabs.tsx`
- Create: `components/menu/product-grid.tsx`
- Create: `app/(public)/menu/page.tsx`

- [ ] **Step 1: Write CategoryTabs**

Create `components/menu/category-tabs.tsx`:

```typescript
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/supabase/types'

export function CategoryTabs({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? 'all'

  const tabs = [{ id: 'all', name: 'All', slug: 'all' }, ...categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))]

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    router.push(`/menu?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-16 z-40 bg-brand-cream/90 backdrop-blur-sm border-b border-brand-pink-light/20">
      <div className="container mx-auto px-6">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide py-1">
          {tabs.map((tab) => {
            const isActive = tab.slug === active || (tab.slug === 'all' && active === 'all')
            return (
              <button
                key={tab.id}
                onClick={() => select(tab.slug)}
                className={cn(
                  'relative shrink-0 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive ? 'text-brand-pink' : 'text-brand-dark/50 hover:text-brand-dark'
                )}
              >
                {tab.name}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-pink rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write ProductGrid**

Create `components/menu/product-grid.tsx`:

```typescript
'use client'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'
import type { Product, Category } from '@/lib/supabase/types'

export function ProductGrid({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const searchParams = useSearchParams()
  const activeSlug = searchParams.get('category') ?? 'all'

  const activeCategory = categories.find((c) => c.slug === activeSlug)

  const filtered =
    activeSlug === 'all'
      ? products
      : products.filter((p) => p.category_id === activeCategory?.id)

  return (
    <div className="container mx-auto px-6 py-12">
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-brand-dark/40">
          <p className="text-5xl mb-4">🍩</p>
          <p className="font-display text-xl">Coming soon...</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write Menu page**

Create `app/(public)/menu/page.tsx`:

```typescript
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { ProductGrid } from '@/components/menu/product-grid'

export const metadata = { title: 'Menu — XnDoughs' }

export default async function MenuPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('display_order'),
    supabase
      .from('categories')
      .select('*')
      .order('display_order'),
  ])

  return (
    <>
      <div className="bg-brand-cream pt-8 pb-2">
        <div className="container mx-auto px-6 mb-6">
          <h1 className="font-display text-5xl font-bold text-brand-dark">Our Menu</h1>
          <p className="text-brand-dark/50 mt-2">Everything made fresh, from scratch.</p>
        </div>
      </div>
      <Suspense fallback={null}>
        <CategoryTabs categories={categories ?? []} />
        <ProductGrid products={products ?? []} categories={categories ?? []} />
      </Suspense>
    </>
  )
}
```

- [ ] **Step 4: Verify menu page**

Open `http://localhost:3000/menu` — page should load with "All" tab active and empty grid. Add a test category/product in Supabase and verify it appears.

- [ ] **Step 5: Commit**

```bash
git add components/menu/ app/\(public\)/menu/
git commit -m "feat: add Menu page with animated category tabs and product grid"
```

---

## Task 12: About page

**Files:**
- Create: `components/about/values-section.tsx`
- Create: `app/(public)/about/page.tsx`

- [ ] **Step 1: Write ValuesSection**

Create `components/about/values-section.tsx`:

```typescript
'use client'
import { motion } from 'framer-motion'

interface Value { icon: string; title: string; text: string }

export function ValuesSection({ values }: { values: Value[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      {values.map((value, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">{value.icon}</div>
          <h3 className="font-display text-xl font-bold text-brand-dark mb-2">{value.title}</h3>
          <p className="text-brand-dark/55 text-sm leading-relaxed">{value.text}</p>
        </motion.div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write About page**

Create `app/(public)/about/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { ValuesSection } from '@/components/about/values-section'

export const metadata = { title: 'About — XnDoughs' }

interface HeroContent { headline: string; subtext: string }
interface StoryContent { text: string }
interface ValueItem { icon: string; title: string; text: string }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: contents } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'about')

  const heroRow = contents?.find((c) => c.section === 'hero')
  const storyRow = contents?.find((c) => c.section === 'story')
  const valuesRow = contents?.find((c) => c.section === 'values')

  const hero = (heroRow?.content as HeroContent) ?? { headline: 'Handcrafted With Love', subtext: 'Born in Beirut, made from scratch.' }
  const story = (storyRow?.content as StoryContent) ?? { text: '' }
  const values = (valuesRow?.content as ValueItem[]) ?? []

  return (
    <>
      {/* Hero */}
      <section className="py-28 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-5">
            Our Story
          </p>
          <h1 className="font-display text-6xl font-bold text-brand-dark leading-tight">
            {hero.headline}
          </h1>
          <p className="mt-5 text-xl text-brand-dark/55">{hero.subtext}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-4xl font-bold text-brand-dark mb-6 leading-tight">
                From our kitchen<br />to yours
              </h2>
              <p className="text-brand-dark/65 leading-relaxed text-lg">{story.text}</p>
            </div>
            <div className="aspect-square rounded-3xl bg-brand-pink-light/25 flex items-center justify-center">
              <span className="text-8xl">🍩</span>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <ValuesSection values={values} />
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/about/ app/\(public\)/about/
git commit -m "feat: add About page with dynamic content from Supabase"
```

---

## Task 13: Contact page and API route

**Files:**
- Create: `components/contact/contact-form.tsx`
- Create: `app/api/contact/route.ts`
- Create: `app/(public)/contact/page.tsx`

- [ ] **Step 1: Write API route**

Create `app/api/contact/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, message } = await request.json()

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_submissions')
    .insert({ name: name.trim(), message: message.trim() })

  if (error) {
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Write ContactForm**

Create `components/contact/contact-form.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const { toast } = useToast()
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
      toast({ title: 'Message sent!', description: "We'll get back to you soon." })
      setName('')
      setMessage('')
    } else {
      toast({ title: 'Error', description: 'Failed to send. Try WhatsApp instead.', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you're looking for..."
          rows={5}
          required
          className="mt-1.5 resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Write Contact page**

Create `app/(public)/contact/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata = { title: 'Contact — XnDoughs' }

interface ContactInfo { whatsapp: string; location: string; instagram: string }

export default async function ContactPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('page_content')
    .select('content')
    .eq('page', 'contact')
    .eq('section', 'info')
    .single()

  const info = (data?.content as ContactInfo) ?? {
    whatsapp: '96178965285',
    location: 'Clemenceau, Beirut, Lebanon',
    instagram: 'https://www.instagram.com/xndoughs/',
  }

  return (
    <section className="py-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-brand-pink font-bold tracking-[0.2em] uppercase text-xs mb-4">Get in Touch</p>
          <h1 className="font-display text-6xl font-bold text-brand-dark">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <a
              href={`https://wa.me/${info.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">💬</div>
              <div>
                <p className="font-semibold text-brand-dark group-hover:text-brand-pink transition-colors">WhatsApp</p>
                <p className="text-brand-dark/50 text-sm">Chat with us directly</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-white rounded-2xl p-6">
              <div className="w-12 h-12 bg-brand-pink-light/30 rounded-full flex items-center justify-center text-2xl">📍</div>
              <div>
                <p className="font-semibold text-brand-dark">Location</p>
                <p className="text-brand-dark/50 text-sm">{info.location}</p>
              </div>
            </div>

            <a
              href={info.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-brand-pink-light/30 rounded-full flex items-center justify-center text-2xl">📷</div>
              <div>
                <p className="font-semibold text-brand-dark group-hover:text-brand-pink transition-colors">Instagram</p>
                <p className="text-brand-dark/50 text-sm">@xndoughs</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/contact/ app/api/ app/\(public\)/contact/
git commit -m "feat: add Contact page, form, and API route for submissions"
```

---

## Task 14: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Write admin login page**

Create `app/admin/login/page.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-sm">
        <div className="flex justify-center mb-8">
          <Image src="/xndoughs-logo.png" alt="XnDoughs" width={120} height={40} className="h-10 w-auto" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-dark mb-1 text-center">Admin Login</h1>
        <p className="text-brand-dark/40 text-sm text-center mb-8">XnDoughs dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify login**

Open `http://localhost:3000/admin/login` — form should render. Enter the admin credentials created in Task 2 → should redirect to `/admin`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/
git commit -m "feat: add admin login page with Supabase Auth"
```

---

## Task 15: Admin layout, sidebar, and dashboard

**Files:**
- Create: `components/admin/sidebar.tsx`
- Create: `app/admin/(protected)/layout.tsx`
- Create: `app/admin/(protected)/page.tsx`

- [ ] **Step 1: Write admin Sidebar**

Create `components/admin/sidebar.tsx`:

```typescript
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🍩' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/content', label: 'Page Content', icon: '📝' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Image src="/xndoughs-logo.png" alt="XnDoughs" width={100} height={34} className="h-8 w-auto" />
        <p className="text-xs text-gray-400 mt-1.5 font-medium">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-pink/10 text-brand-pink'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-500 text-sm"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Write admin layout (route-group only — login page is excluded)**

Create `app/admin/(protected)/layout.tsx`:

```typescript
import { AdminSidebar } from '@/components/admin/sidebar'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
```

Note: `app/admin/login/page.tsx` sits **outside** this route group so it does NOT get the sidebar.

- [ ] **Step 3: Write admin dashboard**

Create `app/admin/(protected)/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: categoryCount },
    { count: submissionCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Products', value: productCount ?? 0, icon: '🍩' },
    { label: 'Categories', value: categoryCount ?? 0, icon: '📂' },
    { label: 'Contact Messages', value: submissionCount ?? 0, icon: '💬' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome back to XnDoughs admin.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="text-3xl mb-3">{stat.icon}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/admin/sidebar.tsx "app/admin/(protected)/"
git commit -m "feat: add admin layout, sidebar, and dashboard"
```

---

## Task 16: Admin image upload component

**Files:**
- Create: `components/admin/image-upload.tsx`

- [ ] **Step 1: Write ImageUpload**

Create `components/admin/image-upload.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/image-upload.tsx
git commit -m "feat: add ImageUpload component with Supabase Storage"
```

---

## Task 17: Admin Categories CRUD

**Files:**
- Create: `components/admin/category-dialog.tsx`
- Create: `app/admin/(protected)/categories/page.tsx`

- [ ] **Step 1: Write CategoryDialog**

Create `components/admin/category-dialog.tsx`:

```typescript
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
  const [imageUrl, setImageUrl] = useState<string>('')
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
      setName('')
      setSlug('')
      setImageUrl('')
      setDisplayOrder(0)
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
    if (dbError) {
      setError(dbError.message)
      return
    }
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
```

- [ ] **Step 2: Write Categories admin page**

Create `app/admin/(protected)/categories/page.tsx`:

```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CategoryDialog } from '@/components/admin/category-dialog'
import Image from 'next/image'

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
```

- [ ] **Step 3: Verify categories CRUD**

Open `http://localhost:3000/admin/categories` — add a test category, edit it, then delete it. Confirm each action works.

- [ ] **Step 4: Commit**

```bash
git add components/admin/category-dialog.tsx "app/admin/(protected)/categories/"
git commit -m "feat: add admin Categories CRUD with image upload"
```

---

## Task 18: Admin Products CRUD

**Files:**
- Create: `components/admin/product-dialog.tsx`
- Create: `app/admin/(protected)/products/page.tsx`

- [ ] **Step 1: Write ProductDialog**

Create `components/admin/product-dialog.tsx`:

```typescript
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
      setName(''); setDescription(''); setPrice(''); setCategoryId(''); setImageUrl('')
      setIsFeatured(false); setIsAvailable(true); setDisplayOrder(0)
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
            <Select value={categoryId} onValueChange={setCategoryId}>
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
```

- [ ] **Step 2: Write Products admin page**

Create `app/admin/(protected)/products/page.tsx`:

```typescript
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
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
```

- [ ] **Step 3: Verify products CRUD**

Open `http://localhost:3000/admin/products`. Add a product, toggle featured/available, edit, delete. Confirm changes appear on the public menu page.

- [ ] **Step 4: Commit**

```bash
git add components/admin/product-dialog.tsx "app/admin/(protected)/products/"
git commit -m "feat: add admin Products CRUD with inline toggles and image upload"
```

---

## Task 19: Admin Content editor

**Files:**
- Create: `app/admin/(protected)/content/page.tsx`

- [ ] **Step 1: Write Content editor page**

Create `app/admin/(protected)/content/page.tsx`:

```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface AboutHero { headline: string; subtext: string }
interface AboutStory { text: string }
interface ContactInfo { whatsapp: string; location: string; instagram: string }

export default function ContentPage() {
  const supabase = createClient()
  const { toast } = useToast()
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
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Saved!', description: `${page} / ${section} updated.` })
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
          {/* About Hero */}
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
              onClick={() => save('about', 'hero', aboutHero)}
              disabled={loading}
              className="bg-brand-pink hover:bg-brand-pink/90 text-white"
            >
              Save Hero
            </Button>
          </div>

          {/* About Story */}
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
              onClick={() => save('about', 'story', aboutStory)}
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
              onClick={() => save('contact', 'info', contactInfo)}
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
```

- [ ] **Step 2: Verify content editor**

Open `http://localhost:3000/admin/content` → update About headline → open `http://localhost:3000/about` → confirm change is reflected.

- [ ] **Step 3: Commit**

```bash
git add "app/admin/(protected)/content/"
git commit -m "feat: add admin Content editor for About and Contact pages"
```

---

## Task 20: Final verification and deployment prep

**Files:**
- Create: `vercel.json` (optional, only if needed)

- [ ] **Step 1: Add sample data via admin**

Open `http://localhost:3000/admin`. Add at least:
- 3 categories (e.g., Donuts, Cookies, Cinnamon Rolls) with images
- 5 products spread across categories, mark 4 as featured

- [ ] **Step 2: Full site walkthrough**

Check each page:
- `http://localhost:3000` — Hero, featured products, category grid, brand teaser all show
- `http://localhost:3000/menu` — Products appear, category tabs filter correctly with animation
- `http://localhost:3000/about` — Story and values render from Supabase data
- `http://localhost:3000/contact` — Info cards and form render; submit form, check Supabase `contact_submissions` table
- `http://localhost:3000/admin` — Dashboard shows counts
- Sign out → confirm redirect to login; sign back in → confirm dashboard access

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. Fix any type errors before continuing.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: `Route (app)` table shows all routes compiled successfully with no errors.

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted, add the environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Or set them in the Vercel dashboard under Settings → Environment Variables before deploying.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: xndoughs website complete — all pages, admin panel, and deployment"
```
