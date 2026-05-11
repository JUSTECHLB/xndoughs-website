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
