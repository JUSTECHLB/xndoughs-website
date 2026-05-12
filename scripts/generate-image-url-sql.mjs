// Regenerates supabase/update-image-urls.sql matching products by name+category
// instead of by image_url (which was empty after seed ran without local paths).
//
// Run with: node scripts/generate-image-url-sql.mjs

import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const STORAGE_BASE = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images'

// Read category image extensions from the uploaded files
// (categories stored as categories/<slug>.<ext>)
const catExts = {
  'boxes':          'png',
  'breakables':     'png',
  'brownies':       'png',
  'cake-pops':      'png',
  'cinnamon-rolls': 'png',
  'cookies':        'png',
  'croissants':     'jpg',
  'cupcakes':       'png',
  'giant-cookies':  'png',
  'oreos':          'png',
  'rice-krispies':  'png',
}

// Full product mapping: [category_slug, product_display_name, storage_filename]
// storage_filename is the file in the products/ folder (without extension, always .jpg)
const products = [
  // Cookies
  ['cookies', 'Chocolate Chip',                     'cookie-chocolate-chip'],
  ['cookies', 'Nutella',                            'cookie-nutella'],
  ['cookies', 'Snickers',                           'cookie-snickers'],
  ['cookies', 'Mars',                               'cookie-mars'],
  ['cookies', 'Twix',                               'cookie-twix'],
  ['cookies', 'Oreo',                               'cookie-oreo'],
  ['cookies', 'Red Velvet',                         'cookie-red-velvet'],
  ['cookies', 'Red Velvet Nutella',                 'cookie-red-velvet-nutella'],
  ['cookies', 'Half Red Velvet Half Chocolate Chip','cookie-half-rv-half-choc'],
  ['cookies', 'M&M',                               'cookie-mm'],
  ['cookies', 'Bueno',                              'cookie-bueno'],
  ['cookies', 'Lotus',                              'cookie-lotus'],
  ['cookies', 'Red Velvet Oreo',                    'cookie-red-velvet-oreo'],
  ['cookies', 'New Yorker',                         'cookie-newyorker'],
  ['cookies', 'White Chocolate New Yorker',         'cookie-white-choc-newyorker'],
  ['cookies', 'Double Chocolate New Yorker',        'cookie-double-choc-newyorker'],
  ['cookies', 'Marshmallow',                        'cookie-marshmallow'],
  ['cookies', 'Mini Cookies',                       'cookie-mini'],
  // Cinnamon Rolls
  ['cinnamon-rolls', 'Original',    'cinnamon-original'],
  ['cinnamon-rolls', 'Nutella',     'cinnamon-nutella'],
  ['cinnamon-rolls', 'Lotus',       'cinnamon-lotus'],
  ['cinnamon-rolls', 'Oreo',        'cinnamon-oreo'],
  ['cinnamon-rolls', 'Red Velvet',  'cinnamon-red-velvet'],
  ['cinnamon-rolls', 'Pistachio',   'cinnamon-pistachio'],
  // Brownies
  ['brownies', 'Nutella Brownie', 'brownie-nutella'],
  ['brownies', 'Caramel Twix',   'brownie-caramel-twix'],
  ['brownies', 'Brookie',        'brownie-brookie'],
  ['brownies', 'Lotus Blondie',  'brownie-lotus-blondie'],
  // Cupcakes
  ['cupcakes', 'Classic Cupcake',                'cupcake-classic'],
  ['cupcakes', 'Cupcake with Sugar Piece',       'cupcake-with-sugar-piece'],
  ['cupcakes', 'Cookie Dough Layered Chocolate', 'cupcake-cookie-dough-choc'],
  ['cupcakes', 'Red Velvet Layered',             'cupcake-red-velvet-layered'],
  ['cupcakes', 'Red Velvet Oreo',                'cupcake-red-velvet-oreo'],
  ['cupcakes', 'Vanilla Layered',                'cupcake-vanilla-layered'],
  ['cupcakes', 'Box of 4 Cupcakes',              'cupcake-box-of-4'],
  // Cake Pops
  ['cake-pops', 'Vanilla',              'cakepop-vanilla'],
  ['cake-pops', 'Chocolate',            'cakepop-chocolate'],
  ['cake-pops', 'Red Velvet',           'cakepop-red-velvet'],
  ['cake-pops', 'Cookie Dough',         'cakepop-cookie-dough'],
  ['cake-pops', 'Cookie Dough Nutella', 'cakepop-cookie-dough-nutella'],
  ['cake-pops', 'Red Velvet Nutella',   'cakepop-red-velvet-nutella'],
  ['cake-pops', 'Rainbow',              'cakepop-rainbow'],
  // Croissants
  ['croissants', 'Chocolate',        'croissant-chocolate'],
  ['croissants', 'Four Cheeses',     'croissant-four-cheeses'],
  ['croissants', 'Turkey & Cheese',  'croissant-turkey-cheese'],
  ['croissants', 'Spicy Feta',       'croissant-spicy-feta'],
  ["croissants", "Lotus Hershey's",  'croissant-lotus-hersheys'],
  ['croissants', 'Crème Brûlée',    'croissant-creme-brulee'],
  ['croissants', 'Pistachio',        'croissant-pistachio'],
  ['croissants', 'Crookie',          'croissant-crookie'],
  ['croissants', 'Lotus Crookie',    'croissant-lotus-crookie'],
  // Giant Cookies
  ['giant-cookies', 'Giant Cookie 34 cm',            'giant-34cm'],
  ['giant-cookies', 'Giant Cookie 34 cm + Toppings', 'giant-34cm-toppings'],
  ['giant-cookies', 'Giant Cookie 20 cm',            'giant-20cm'],
  ['giant-cookies', 'Giant Cookie 20 cm + Toppings', 'giant-20cm-toppings'],
  ['giant-cookies', 'Giant Heart Cookie',            'giant-heart'],
  // Boxes
  ['boxes', 'Box of 6',           'box-of-6'],
  ['boxes', 'Box of 12',          'box-of-12'],
  ['boxes', 'Box of 6 Cinnamons', 'box-of-6'],
  ['boxes', 'Dessert Box',        'box-dessert'],
  // Breakables (only those with images)
  ['breakables', 'Small Heart',               'breakable-small-heart'],
  ['breakables', 'Large Heart',               'breakable-large-heart'],
  ['breakables', 'Cookie Dough Nutella Heart','breakable-cookie-dough-heart'],
  ['breakables', 'Donut',                     'breakable-donut'],
  ['breakables', 'Giant Egg',                 'breakable-giant-egg'],
  // Oreos
  ['oreos', 'Oreo Dipped in Chocolate',  'oreo-dipped'],
  ['oreos', 'Cookie Dough Oreo Nutella', 'oreo-cookie-dough-nutella'],
  ['oreos', 'Oreo Box',                  'oreo-box'],
  // Rice Krispies
  ['rice-krispies', 'Rice Krispies',               'rice-krispies'],
  ['rice-krispies', 'Fruity Pebble Rice Krispies', 'rice-krispies-fruity'],
]

function escape(s) {
  return s.replace(/'/g, "''")
}

const lines = ['-- Update image URLs (matched by product name + category slug)']
lines.push('-- Run this in the Supabase SQL Editor\n')

// Categories
for (const [slug, ext] of Object.entries(catExts)) {
  const url = `${STORAGE_BASE}/categories/${slug}.${ext}`
  lines.push(`UPDATE categories SET image_url = '${url}' WHERE slug = '${slug}';`)
}

lines.push('')

// Products — single statement using a VALUES join
lines.push('UPDATE products AS p')
lines.push('SET image_url = v.url')
lines.push('FROM (VALUES')

const rows = products.map(([catSlug, name, filename], i) => {
  const url = `${STORAGE_BASE}/products/${filename}.jpg`
  const comma = i < products.length - 1 ? ',' : ''
  return `  ('${escape(catSlug)}', '${escape(name)}', '${url}')${comma}`
})

lines.push(rows.join('\n'))
lines.push(') AS v(cat_slug, prod_name, url)')
lines.push('JOIN categories c ON c.slug = v.cat_slug')
lines.push('WHERE p.name = v.prod_name AND p.category_id = c.id;')

const sql = lines.join('\n') + '\n'

const outPath = join(ROOT, 'supabase', 'update-image-urls.sql')
await writeFile(outPath, sql)
console.log(`Written to supabase/update-image-urls.sql (${products.length} products, ${Object.keys(catExts).length} categories)`)
