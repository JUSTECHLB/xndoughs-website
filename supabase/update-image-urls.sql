-- Update image URLs (matched by product name + category slug)
-- Run this in the Supabase SQL Editor

UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/boxes.png' WHERE slug = 'boxes';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/breakables.png' WHERE slug = 'breakables';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/brownies.png' WHERE slug = 'brownies';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/cake-pops.png' WHERE slug = 'cake-pops';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/cinnamon-rolls.png' WHERE slug = 'cinnamon-rolls';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/cookies.png' WHERE slug = 'cookies';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/croissants.jpg' WHERE slug = 'croissants';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/cupcakes.png' WHERE slug = 'cupcakes';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/giant-cookies.png' WHERE slug = 'giant-cookies';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/oreos.png' WHERE slug = 'oreos';
UPDATE categories SET image_url = 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/categories/rice-krispies.png' WHERE slug = 'rice-krispies';

UPDATE products AS p
SET image_url = v.url
FROM (VALUES
  ('cookies', 'Chocolate Chip', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-chocolate-chip.jpg'),
  ('cookies', 'Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-nutella.jpg'),
  ('cookies', 'Snickers', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-snickers.jpg'),
  ('cookies', 'Mars', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-mars.jpg'),
  ('cookies', 'Twix', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-twix.jpg'),
  ('cookies', 'Oreo', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-oreo.jpg'),
  ('cookies', 'Red Velvet', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-red-velvet.jpg'),
  ('cookies', 'Red Velvet Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-red-velvet-nutella.jpg'),
  ('cookies', 'Half Red Velvet Half Chocolate Chip', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-half-rv-half-choc.jpg'),
  ('cookies', 'M&M', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-mm.jpg'),
  ('cookies', 'Bueno', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-bueno.jpg'),
  ('cookies', 'Lotus', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-lotus.jpg'),
  ('cookies', 'Red Velvet Oreo', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-red-velvet-oreo.jpg'),
  ('cookies', 'New Yorker', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-newyorker.jpg'),
  ('cookies', 'White Chocolate New Yorker', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-white-choc-newyorker.jpg'),
  ('cookies', 'Double Chocolate New Yorker', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-double-choc-newyorker.jpg'),
  ('cookies', 'Marshmallow', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-marshmallow.jpg'),
  ('cookies', 'Mini Cookies', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cookie-mini.jpg'),
  ('cinnamon-rolls', 'Original', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-original.jpg'),
  ('cinnamon-rolls', 'Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-nutella.jpg'),
  ('cinnamon-rolls', 'Lotus', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-lotus.jpg'),
  ('cinnamon-rolls', 'Oreo', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-oreo.jpg'),
  ('cinnamon-rolls', 'Red Velvet', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-red-velvet.jpg'),
  ('cinnamon-rolls', 'Pistachio', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cinnamon-pistachio.jpg'),
  ('brownies', 'Nutella Brownie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/brownie-nutella.jpg'),
  ('brownies', 'Caramel Twix', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/brownie-caramel-twix.jpg'),
  ('brownies', 'Brookie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/brownie-brookie.jpg'),
  ('brownies', 'Lotus Blondie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/brownie-lotus-blondie.jpg'),
  ('cupcakes', 'Classic Cupcake', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-classic.jpg'),
  ('cupcakes', 'Cupcake with Sugar Piece', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-with-sugar-piece.jpg'),
  ('cupcakes', 'Cookie Dough Layered Chocolate', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-cookie-dough-choc.jpg'),
  ('cupcakes', 'Red Velvet Layered', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-red-velvet-layered.jpg'),
  ('cupcakes', 'Red Velvet Oreo', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-red-velvet-oreo.jpg'),
  ('cupcakes', 'Vanilla Layered', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-vanilla-layered.jpg'),
  ('cupcakes', 'Box of 4 Cupcakes', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cupcake-box-of-4.jpg'),
  ('cake-pops', 'Vanilla', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-vanilla.jpg'),
  ('cake-pops', 'Chocolate', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-chocolate.jpg'),
  ('cake-pops', 'Red Velvet', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-red-velvet.jpg'),
  ('cake-pops', 'Cookie Dough', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-cookie-dough.jpg'),
  ('cake-pops', 'Cookie Dough Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-cookie-dough-nutella.jpg'),
  ('cake-pops', 'Red Velvet Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-red-velvet-nutella.jpg'),
  ('cake-pops', 'Rainbow', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/cakepop-rainbow.jpg'),
  ('croissants', 'Chocolate', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-chocolate.jpg'),
  ('croissants', 'Four Cheeses', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-four-cheeses.jpg'),
  ('croissants', 'Turkey & Cheese', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-turkey-cheese.jpg'),
  ('croissants', 'Spicy Feta', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-spicy-feta.jpg'),
  ('croissants', 'Lotus Hershey''s', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-lotus-hersheys.jpg'),
  ('croissants', 'Crème Brûlée', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-creme-brulee.jpg'),
  ('croissants', 'Pistachio', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-pistachio.jpg'),
  ('croissants', 'Crookie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-crookie.jpg'),
  ('croissants', 'Lotus Crookie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/croissant-lotus-crookie.jpg'),
  ('giant-cookies', 'Giant Cookie 34 cm', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/giant-34cm.jpg'),
  ('giant-cookies', 'Giant Cookie 34 cm + Toppings', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/giant-34cm-toppings.jpg'),
  ('giant-cookies', 'Giant Cookie 20 cm', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/giant-20cm.jpg'),
  ('giant-cookies', 'Giant Cookie 20 cm + Toppings', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/giant-20cm-toppings.jpg'),
  ('giant-cookies', 'Giant Heart Cookie', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/giant-heart.jpg'),
  ('boxes', 'Box of 6', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/box-of-6.jpg'),
  ('boxes', 'Box of 12', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/box-of-12.jpg'),
  ('boxes', 'Box of 6 Cinnamons', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/box-of-6.jpg'),
  ('boxes', 'Dessert Box', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/box-dessert.jpg'),
  ('breakables', 'Small Heart', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/breakable-small-heart.jpg'),
  ('breakables', 'Large Heart', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/breakable-large-heart.jpg'),
  ('breakables', 'Cookie Dough Nutella Heart', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/breakable-cookie-dough-heart.jpg'),
  ('breakables', 'Donut', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/breakable-donut.jpg'),
  ('breakables', 'Giant Egg', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/breakable-giant-egg.jpg'),
  ('oreos', 'Oreo Dipped in Chocolate', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/oreo-dipped.jpg'),
  ('oreos', 'Cookie Dough Oreo Nutella', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/oreo-cookie-dough-nutella.jpg'),
  ('oreos', 'Oreo Box', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/oreo-box.jpg'),
  ('rice-krispies', 'Rice Krispies', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/rice-krispies.jpg'),
  ('rice-krispies', 'Fruity Pebble Rice Krispies', 'https://mxooldlaahembhlyuogx.supabase.co/storage/v1/object/public/product-images/products/rice-krispies-fruity.jpg')
) AS v(cat_slug, prod_name, url)
JOIN categories c ON c.slug = v.cat_slug
WHERE p.name = v.prod_name AND p.category_id = c.id;
