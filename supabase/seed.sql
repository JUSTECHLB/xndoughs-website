-- XnDoughs seed data
-- Run this in Supabase SQL Editor AFTER running the migration (001_initial.sql)
-- Images can be uploaded later via the admin panel

WITH cats AS (
  INSERT INTO categories (name, slug, image_url, display_order) VALUES
    ('Cookies',        'cookies',        '', 1),
    ('Cinnamon Rolls', 'cinnamon-rolls', '', 2),
    ('Brownies',       'brownies',       '', 3),
    ('Cupcakes',       'cupcakes',       '', 4),
    ('Cake Pops',      'cake-pops',      '', 5),
    ('Croissants',     'croissants',     '', 6),
    ('Giant Cookies',  'giant-cookies',  '', 7),
    ('Boxes',          'boxes',          '', 8),
    ('Breakables',     'breakables',     '', 9),
    ('Oreos',          'oreos',          '', 10),
    ('Rice Krispies',  'rice-krispies',  '', 11)
  RETURNING id, slug
)
INSERT INTO products (category_id, name, description, price, image_url, is_featured, is_available, display_order)
SELECT c.id, p.name, p.description, p.price::numeric, '', p.is_featured, true, p.display_order
FROM cats c
JOIN (VALUES
  -- Cookies
  ('cookies', 'Chocolate Chip',                       'Classic chocolate chip cookie',                    '3.50', true,  1),
  ('cookies', 'Nutella',                              'Filled with creamy Nutella',                       '3.50', false, 2),
  ('cookies', 'Snickers',                             'Loaded with Snickers pieces',                      '3.50', false, 3),
  ('cookies', 'Mars',                                 'Loaded with Mars pieces',                          '3.50', false, 4),
  ('cookies', 'Twix',                                 'Loaded with Twix pieces',                          '3.50', false, 5),
  ('cookies', 'Oreo',                                 'Loaded with Oreo pieces',                          '3.50', false, 6),
  ('cookies', 'Red Velvet',                           'Classic red velvet cookie',                        '3.50', false, 7),
  ('cookies', 'Red Velvet Nutella',                   'Red velvet with Nutella swirl',                    '3.50', false, 8),
  ('cookies', 'M&M',                                  'Loaded with M&M pieces',                           '3.50', false, 9),
  ('cookies', 'Bueno',                                'Loaded with Bueno pieces',                         '3.50', false, 10),
  ('cookies', 'Lotus',                                'Lotus Biscoff cookie',                             '3.50', true,  11),
  ('cookies', 'Red Velvet Oreo',                      'Red velvet meets Oreo',                            '3.50', false, 12),
  ('cookies', 'New Yorker',                           'Extra-thick NYC-style cookie',                     '4.50', true,  13),
  ('cookies', 'White Chocolate New Yorker',           'Extra-thick with white chocolate',                 '4.50', false, 14),
  ('cookies', 'Double Chocolate New Yorker',          'Extra-thick double chocolate',                     '4.50', false, 15),
  ('cookies', 'Marshmallow',                          'Gooey marshmallow cookie',                         '4.50', false, 16),
  ('cookies', 'Mini Cookies',                         'Bite-sized cookies',                               '1.80', false, 17),

  -- Cinnamon Rolls
  ('cinnamon-rolls', 'Original',   'Classic cinnamon roll with cream cheese frosting', '5.00', true,  1),
  ('cinnamon-rolls', 'Nutella',    'Swirled with Nutella',                              '5.00', false, 2),
  ('cinnamon-rolls', 'Lotus',      'Filled with Lotus Biscoff spread',                 '5.00', true,  3),
  ('cinnamon-rolls', 'Oreo',       'Filled with Oreo cream',                           '5.00', false, 4),
  ('cinnamon-rolls', 'Red Velvet', 'Red velvet cinnamon roll',                         '5.00', false, 5),
  ('cinnamon-rolls', 'Pistachio',  'Filled with pistachio cream',                      '6.00', true,  6),

  -- Brownies
  ('brownies', 'Nutella Brownie', 'Rich fudgy brownie with Nutella',     '3.50', true,  1),
  ('brownies', 'Caramel Twix',    'Brownie topped with Twix and caramel','3.50', false, 2),
  ('brownies', 'Brookie',         'Half brownie, half cookie',           '4.50', true,  3),
  ('brownies', 'Lotus Blondie',   'White chocolate blondie with Lotus',  '3.50', false, 4),

  -- Cupcakes
  ('cupcakes', 'Classic Cupcake',                'Freshly baked cupcake',                          '3.00', false, 1),
  ('cupcakes', 'Cupcake with Sugar Piece',       'Cupcake with custom sugar decoration',           '3.50', false, 2),
  ('cupcakes', 'Cookie Dough Layered Chocolate', 'Layered chocolate cupcake with cookie dough',   '3.00', true,  3),
  ('cupcakes', 'Red Velvet Layered',             'Layered red velvet cupcake',                     '3.00', false, 4),
  ('cupcakes', 'Red Velvet Oreo',                'Red velvet cupcake with Oreo topping',           '3.00', false, 5),
  ('cupcakes', 'Vanilla Layered',                'Layered vanilla cupcake',                        '3.00', false, 6),
  ('cupcakes', 'Box of 4 Cupcakes',              'Your choice of 4 cupcakes',                      '18.00', false, 7),

  -- Cake Pops
  ('cake-pops', 'Vanilla',              'Classic vanilla cake pop',          '2.50', false, 1),
  ('cake-pops', 'Chocolate',            'Rich chocolate cake pop',           '2.50', false, 2),
  ('cake-pops', 'Red Velvet',           'Classic red velvet cake pop',       '2.50', false, 3),
  ('cake-pops', 'Cookie Dough',         'Cookie dough cake pop',             '2.50', false, 4),
  ('cake-pops', 'Cookie Dough Nutella', 'Cookie dough with Nutella filling', '2.85', false, 5),
  ('cake-pops', 'Red Velvet Nutella',   'Red velvet with Nutella filling',   '2.85', false, 6),
  ('cake-pops', 'Rainbow',              'Colorful rainbow cake pop',         '2.85', true,  7),

  -- Croissants
  ('croissants', 'Chocolate',           'Classic chocolate croissant',                '3.00', false, 1),
  ('croissants', 'Four Cheeses',        'Loaded with four melted cheeses',            '3.00', false, 2),
  ('croissants', 'Turkey & Cheese',     'Turkey and melted cheese',                   '4.00', false, 3),
  ('croissants', 'Spicy Feta',          'Spicy feta cheese filling',                  '4.00', false, 4),
  ('croissants', 'Lotus Hershey's',     'Lotus spread with Hershey''s chocolate',     '4.00', false, 5),
  ('croissants', 'Crème Brûlée',        'Crème brûlée custard filling',               '4.00', false, 6),
  ('croissants', 'Pistachio',           'Filled with pistachio cream',                '4.00', true,  7),
  ('croissants', 'Crookie',             'Cookie dough-stuffed croissant',             '5.00', true,  8),
  ('croissants', 'Lotus Crookie',       'Lotus Biscoff cookie dough-stuffed croissant','5.00', true, 9),

  -- Giant Cookies
  ('giant-cookies', 'Giant Cookie 34 cm',          '34 cm cookie with custom writing',         '35.00', false, 1),
  ('giant-cookies', 'Giant Cookie 34 cm + Toppings','34 cm cookie with toppings + writing',    '40.00', false, 2),
  ('giant-cookies', 'Giant Cookie 20 cm',          '20 cm cookie with custom writing',         '25.00', false, 3),
  ('giant-cookies', 'Giant Cookie 20 cm + Toppings','20 cm cookie with toppings + writing',   '30.00', false, 4),
  ('giant-cookies', 'Giant Heart Cookie',          'Heart-shaped giant cookie with writing',   '30.00', false, 5),
  ('giant-cookies', 'Giant Sugar Cookie Letter',   'Giant personalized letter sugar cookie',   '38.00', false, 6),
  ('giant-cookies', 'Extra Filling',               'Additional filling of your choice',         '8.00', false, 7),

  -- Boxes
  ('boxes', 'Box of 6',          'Choose from our cookie flavors — 6 pieces', '17.50', true,  1),
  ('boxes', 'Box of 12',         'Choose from our cookie flavors — 12 pieces','35.00', false, 2),
  ('boxes', 'Box of 6 Cinnamons','Choose from our cinnamon roll flavors',     '20.00', true,  3),
  ('boxes', 'Dessert Box',       'A curated mix of our bestsellers',          '40.00', false, 4),

  -- Breakables
  ('breakables', 'Birthday Ball',          'Chocolate ball filled with treats',          '30.00', false, 1),
  ('breakables', 'Cookie Dough Ball',      'Cookie dough-filled breakable ball',         '40.00', false, 2),
  ('breakables', 'Small Heart',            'Small breakable chocolate heart',            '35.00', true,  3),
  ('breakables', 'Large Heart',            'Large breakable chocolate heart',            '45.00', false, 4),
  ('breakables', 'Cookie Dough Nutella Heart','Breakable heart with cookie dough & Nutella','40.00', false, 5),
  ('breakables', 'Champagne Bottle',       'Breakable champagne bottle',                 '30.00', false, 6),
  ('breakables', 'Diamond',               'Breakable diamond shape',                    '40.00', false, 7),
  ('breakables', 'Donut',                 'Breakable donut shape',                      '40.00', false, 8),
  ('breakables', 'Giant Egg',             'Massive breakable chocolate egg',            '120.00', false, 9),
  ('breakables', 'Nutella Jar with Candy','Breakable Nutella jar filled with candy',    '80.00', false, 10),

  -- Oreos
  ('oreos', 'Oreo Dipped in Chocolate', 'Single Oreo hand-dipped in chocolate',     '1.00', false, 1),
  ('oreos', 'Cookie Dough Oreo Nutella', 'Oreo with cookie dough and Nutella',      '1.20', false, 2),
  ('oreos', 'Oreo Box',                 'Box of chocolate-dipped Oreos',            '10.00', true,  3),

  -- Rice Krispies
  ('rice-krispies', 'Rice Krispies',              'Classic Rice Krispies treat',           '3.20', false, 1),
  ('rice-krispies', 'Fruity Pebble Rice Krispies','Fruity Pebble Rice Krispies treat',    '4.30', false, 2)

) AS p(slug, name, description, price, is_featured, display_order)
ON c.slug = p.slug;
