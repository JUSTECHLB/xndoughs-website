-- XnDoughs seed data
-- Run this in Supabase SQL Editor AFTER running the migration (001_initial.sql)
-- Images are served from the Next.js public/menu-images/ directory

WITH cats AS (
  INSERT INTO categories (name, slug, image_url, display_order) VALUES
    ('Cookies',        'cookies',        '/menu-images/categories/cookies.png',        1),
    ('Cinnamon Rolls', 'cinnamon-rolls', '/menu-images/categories/cinnamon-rolls.png', 2),
    ('Brownies',       'brownies',       '/menu-images/categories/brownies.png',        3),
    ('Cupcakes',       'cupcakes',       '/menu-images/categories/cupcakes.png',        4),
    ('Cake Pops',      'cake-pops',      '/menu-images/categories/cake-pops.png',       5),
    ('Croissants',     'croissants',     '/menu-images/categories/croissants.jpg',      6),
    ('Giant Cookies',  'giant-cookies',  '/menu-images/categories/giant-cookies.png',  7),
    ('Boxes',          'boxes',          '/menu-images/categories/boxes.png',           8),
    ('Breakables',     'breakables',     '/menu-images/categories/breakables.png',      9),
    ('Oreos',          'oreos',          '/menu-images/categories/oreos.png',           10),
    ('Rice Krispies',  'rice-krispies',  '/menu-images/categories/rice-krispies.png',  11)
  RETURNING id, slug
)
INSERT INTO products (category_id, name, description, price, image_url, is_featured, is_available, display_order)
SELECT c.id, p.name, p.description, p.price::numeric, p.image_url, p.is_featured, true, p.display_order
FROM cats c
JOIN (VALUES
  -- Cookies
  ('cookies', 'Chocolate Chip',                    'Classic chocolate chip cookie',             '3.50', '/menu-images/products/cookie-chocolate-chip.jpg',         true,  1),
  ('cookies', 'Nutella',                           'Filled with creamy Nutella',                '3.50', '/menu-images/products/cookie-nutella.jpg',                false, 2),
  ('cookies', 'Snickers',                          'Loaded with Snickers pieces',               '3.50', '/menu-images/products/cookie-snickers.jpg',               false, 3),
  ('cookies', 'Mars',                              'Loaded with Mars pieces',                   '3.50', '/menu-images/products/cookie-mars.jpg',                   false, 4),
  ('cookies', 'Twix',                              'Loaded with Twix pieces',                   '3.50', '/menu-images/products/cookie-twix.jpg',                   false, 5),
  ('cookies', 'Oreo',                              'Loaded with Oreo pieces',                   '3.50', '/menu-images/products/cookie-oreo.jpg',                   false, 6),
  ('cookies', 'Red Velvet',                        'Classic red velvet cookie',                 '3.50', '/menu-images/products/cookie-red-velvet.jpg',             false, 7),
  ('cookies', 'Red Velvet Nutella',                'Red velvet with Nutella swirl',             '3.50', '/menu-images/products/cookie-red-velvet-nutella.jpg',     false, 8),
  ('cookies', 'Half Red Velvet Half Chocolate Chip','Half red velvet, half chocolate chip',     '3.50', '/menu-images/products/cookie-half-rv-half-choc.jpg',      false, 9),
  ('cookies', 'M&M',                               'Loaded with M&M pieces',                   '3.50', '/menu-images/products/cookie-mm.jpg',                     false, 10),
  ('cookies', 'Bueno',                             'Loaded with Bueno pieces',                  '3.50', '/menu-images/products/cookie-bueno.jpg',                  false, 11),
  ('cookies', 'Lotus',                             'Lotus Biscoff cookie',                      '3.50', '/menu-images/products/cookie-lotus.jpg',                  true,  12),
  ('cookies', 'Red Velvet Oreo',                   'Red velvet meets Oreo',                     '3.50', '/menu-images/products/cookie-red-velvet-oreo.jpg',        false, 13),
  ('cookies', 'New Yorker',                        'Extra-thick NYC-style cookie',              '4.50', '/menu-images/products/cookie-newyorker.jpg',              true,  14),
  ('cookies', 'White Chocolate New Yorker',        'Extra-thick with white chocolate',          '4.50', '/menu-images/products/cookie-white-choc-newyorker.jpg',   false, 15),
  ('cookies', 'Double Chocolate New Yorker',       'Extra-thick double chocolate',              '4.50', '/menu-images/products/cookie-double-choc-newyorker.jpg',  false, 16),
  ('cookies', 'Marshmallow',                       'Gooey marshmallow cookie',                  '4.50', '/menu-images/products/cookie-marshmallow.jpg',            false, 17),
  ('cookies', 'Mini Cookies',                      'Bite-sized cookies',                        '1.80', '/menu-images/products/cookie-mini.jpg',                   false, 18),

  -- Cinnamon Rolls
  ('cinnamon-rolls', 'Original',   'Classic cinnamon roll with cream cheese frosting', '5.00', '/menu-images/products/cinnamon-original.jpg',   true,  1),
  ('cinnamon-rolls', 'Nutella',    'Swirled with Nutella',                              '5.00', '/menu-images/products/cinnamon-nutella.jpg',    false, 2),
  ('cinnamon-rolls', 'Lotus',      'Filled with Lotus Biscoff spread',                 '5.00', '/menu-images/products/cinnamon-lotus.jpg',      true,  3),
  ('cinnamon-rolls', 'Oreo',       'Filled with Oreo cream',                           '5.00', '/menu-images/products/cinnamon-oreo.jpg',       false, 4),
  ('cinnamon-rolls', 'Red Velvet', 'Red velvet cinnamon roll',                         '5.00', '/menu-images/products/cinnamon-red-velvet.jpg', false, 5),
  ('cinnamon-rolls', 'Pistachio',  'Filled with pistachio cream',                      '6.00', '/menu-images/products/cinnamon-pistachio.jpg',  true,  6),

  -- Brownies
  ('brownies', 'Nutella Brownie', 'Rich fudgy brownie with Nutella',      '3.50', '/menu-images/products/brownie-nutella.jpg',       true,  1),
  ('brownies', 'Caramel Twix',   'Brownie topped with Twix and caramel', '3.50', '/menu-images/products/brownie-caramel-twix.jpg',  false, 2),
  ('brownies', 'Brookie',        'Half brownie, half cookie',             '4.50', '/menu-images/products/brownie-brookie.jpg',       true,  3),
  ('brownies', 'Lotus Blondie',  'White chocolate blondie with Lotus',   '3.50', '/menu-images/products/brownie-lotus-blondie.jpg', false, 4),

  -- Cupcakes
  ('cupcakes', 'Classic Cupcake',                'Freshly baked cupcake',                         '3.00',  '/menu-images/products/cupcake-classic.jpg',              false, 1),
  ('cupcakes', 'Cupcake with Sugar Piece',       'Cupcake with custom sugar decoration',          '3.50',  '/menu-images/products/cupcake-with-sugar-piece.jpg',     false, 2),
  ('cupcakes', 'Cookie Dough Layered Chocolate', 'Layered chocolate cupcake with cookie dough',  '3.00',  '/menu-images/products/cupcake-cookie-dough-choc.jpg',    true,  3),
  ('cupcakes', 'Red Velvet Layered',             'Layered red velvet cupcake',                    '3.00',  '/menu-images/products/cupcake-red-velvet-layered.jpg',   false, 4),
  ('cupcakes', 'Red Velvet Oreo',                'Red velvet cupcake with Oreo topping',          '3.00',  '/menu-images/products/cupcake-red-velvet-oreo.jpg',      false, 5),
  ('cupcakes', 'Vanilla Layered',                'Layered vanilla cupcake',                       '3.00',  '/menu-images/products/cupcake-vanilla-layered.jpg',      false, 6),
  ('cupcakes', 'Box of 4 Cupcakes',              'Your choice of 4 cupcakes',                     '18.00', '/menu-images/products/cupcake-box-of-4.jpg',             false, 7),

  -- Cake Pops
  ('cake-pops', 'Vanilla',              'Classic vanilla cake pop',          '2.50', '/menu-images/products/cakepop-vanilla.jpg',              false, 1),
  ('cake-pops', 'Chocolate',            'Rich chocolate cake pop',           '2.50', '/menu-images/products/cakepop-chocolate.jpg',            false, 2),
  ('cake-pops', 'Red Velvet',           'Classic red velvet cake pop',       '2.50', '/menu-images/products/cakepop-red-velvet.jpg',           false, 3),
  ('cake-pops', 'Cookie Dough',         'Cookie dough cake pop',             '2.50', '/menu-images/products/cakepop-cookie-dough.jpg',         false, 4),
  ('cake-pops', 'Cookie Dough Nutella', 'Cookie dough with Nutella filling', '2.85', '/menu-images/products/cakepop-cookie-dough-nutella.jpg', false, 5),
  ('cake-pops', 'Red Velvet Nutella',   'Red velvet with Nutella filling',   '2.85', '/menu-images/products/cakepop-red-velvet-nutella.jpg',   false, 6),
  ('cake-pops', 'Rainbow',              'Colorful rainbow cake pop',         '2.85', '/menu-images/products/cakepop-rainbow.jpg',              true,  7),

  -- Croissants
  ('croissants', 'Chocolate',        'Classic chocolate croissant',                  '3.00', '/menu-images/products/croissant-chocolate.jpg',      false, 1),
  ('croissants', 'Four Cheeses',     'Loaded with four melted cheeses',              '3.00', '/menu-images/products/croissant-four-cheeses.jpg',   false, 2),
  ('croissants', 'Turkey & Cheese',  'Turkey and melted cheese',                     '4.00', '/menu-images/products/croissant-turkey-cheese.jpg',  false, 3),
  ('croissants', 'Spicy Feta',       'Spicy feta cheese filling',                    '4.00', '/menu-images/products/croissant-spicy-feta.jpg',     false, 4),
  ('croissants', 'Lotus Hershey''s', 'Lotus spread with Hershey''s chocolate',      '4.00', '/menu-images/products/croissant-lotus-hersheys.jpg', false, 5),
  ('croissants', 'Crème Brûlée',    'Crème brûlée custard filling',                 '4.00', '/menu-images/products/croissant-creme-brulee.jpg',   false, 6),
  ('croissants', 'Pistachio',        'Filled with pistachio cream',                  '4.00', '/menu-images/products/croissant-pistachio.jpg',      true,  7),
  ('croissants', 'Crookie',          'Cookie dough-stuffed croissant',               '5.00', '/menu-images/products/croissant-crookie.jpg',        true,  8),
  ('croissants', 'Lotus Crookie',    'Lotus Biscoff cookie dough-stuffed croissant', '5.00', '/menu-images/products/croissant-lotus-crookie.jpg',  true,  9),

  -- Giant Cookies
  ('giant-cookies', 'Giant Cookie 34 cm',           '34 cm cookie with custom writing',         '35.00', '/menu-images/products/giant-34cm.jpg',          false, 1),
  ('giant-cookies', 'Giant Cookie 34 cm + Toppings','34 cm cookie with toppings + writing',     '40.00', '/menu-images/products/giant-34cm-toppings.jpg', false, 2),
  ('giant-cookies', 'Giant Cookie 20 cm',           '20 cm cookie with custom writing',         '25.00', '/menu-images/products/giant-20cm.jpg',          false, 3),
  ('giant-cookies', 'Giant Cookie 20 cm + Toppings','20 cm cookie with toppings + writing',     '30.00', '/menu-images/products/giant-20cm-toppings.jpg', false, 4),
  ('giant-cookies', 'Giant Heart Cookie',           'Heart-shaped giant cookie with writing',   '30.00', '/menu-images/products/giant-heart.jpg',         false, 5),
  ('giant-cookies', 'Giant Sugar Cookie Letter',    'Giant personalized letter sugar cookie',   '38.00', '/menu-images/products/giant-34cm.jpg',          false, 6),
  ('giant-cookies', 'Extra Filling',                'Additional filling of your choice',         '8.00', '',                                              false, 7),

  -- Boxes
  ('boxes', 'Box of 6',          'Choose from our cookie flavors — 6 pieces',  '17.50', '/menu-images/products/box-of-6.jpg',   true,  1),
  ('boxes', 'Box of 12',         'Choose from our cookie flavors — 12 pieces', '35.00', '/menu-images/products/box-of-12.jpg',  false, 2),
  ('boxes', 'Box of 6 Cinnamons','Choose from our cinnamon roll flavors',      '20.00', '/menu-images/products/box-of-6.jpg',   true,  3),
  ('boxes', 'Dessert Box',       'A curated mix of our bestsellers',           '40.00', '/menu-images/products/box-dessert.jpg', false, 4),

  -- Breakables
  ('breakables', 'Birthday Ball',             'Chocolate ball filled with treats',           '30.00', '',                                                        false, 1),
  ('breakables', 'Cookie Dough Ball',         'Cookie dough-filled breakable ball',          '40.00', '',                                                        false, 2),
  ('breakables', 'Small Heart',               'Small breakable chocolate heart',             '35.00', '/menu-images/products/breakable-small-heart.jpg',         true,  3),
  ('breakables', 'Large Heart',               'Large breakable chocolate heart',             '45.00', '/menu-images/products/breakable-large-heart.jpg',         false, 4),
  ('breakables', 'Cookie Dough Nutella Heart','Breakable heart with cookie dough & Nutella', '40.00', '/menu-images/products/breakable-cookie-dough-heart.jpg', false, 5),
  ('breakables', 'Champagne Bottle',          'Breakable champagne bottle',                  '30.00', '',                                                        false, 6),
  ('breakables', 'Diamond',                   'Breakable diamond shape',                     '40.00', '',                                                        false, 7),
  ('breakables', 'Donut',                     'Breakable donut shape',                       '40.00', '/menu-images/products/breakable-donut.jpg',               false, 8),
  ('breakables', 'Giant Egg',                 'Massive breakable chocolate egg',             '120.00', '/menu-images/products/breakable-giant-egg.jpg',          false, 9),
  ('breakables', 'Nutella Jar with Candy',    'Breakable Nutella jar filled with candy',     '80.00', '',                                                        false, 10),

  -- Oreos
  ('oreos', 'Oreo Dipped in Chocolate',  'Single Oreo hand-dipped in chocolate',  '1.00',  '/menu-images/products/oreo-dipped.jpg',              false, 1),
  ('oreos', 'Cookie Dough Oreo Nutella', 'Oreo with cookie dough and Nutella',    '1.20',  '/menu-images/products/oreo-cookie-dough-nutella.jpg', false, 2),
  ('oreos', 'Oreo Box',                  'Box of chocolate-dipped Oreos',         '10.00', '/menu-images/products/oreo-box.jpg',                 true,  3),

  -- Rice Krispies
  ('rice-krispies', 'Rice Krispies',              'Classic Rice Krispies treat',        '3.20', '/menu-images/products/rice-krispies.jpg',        false, 1),
  ('rice-krispies', 'Fruity Pebble Rice Krispies','Fruity Pebble Rice Krispies treat', '4.30', '/menu-images/products/rice-krispies-fruity.jpg', false, 2)

) AS p(slug, name, description, price, image_url, is_featured, display_order)
ON c.slug = p.slug;
