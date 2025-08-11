-- Create categories table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  image_url text,
  icon text, -- FontAwesome icon name
  color text default '#2E8C83', -- Category theme color
  is_active boolean default true,
  sort_order integer default 0,
  parent_id uuid references public.categories(id) on delete set null, -- For subcategories
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for categories
alter table categories enable row level security;

-- RLS Policies for categories
-- Everyone can read active categories
create policy "Anyone can view active categories." on categories
  for select using (is_active = true);

-- Only authenticated users can view all categories (for admin purposes)
create policy "Authenticated users can view all categories." on categories
  for select using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists idx_categories_active on categories(is_active);
create index if not exists idx_categories_sort_order on categories(sort_order);
create index if not exists idx_categories_parent_id on categories(parent_id);
create index if not exists idx_categories_name on categories(name);

-- Create trigger to automatically update updated_at
drop trigger if exists update_categories_updated_at on categories;
create trigger update_categories_updated_at
  before update on categories
  for each row execute procedure public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description, image_url, icon, color, sort_order) VALUES
('Electronics', 'Latest gadgets, smartphones, laptops, and electronic devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'mobile', '#FF6B35', 1),
('Fashion', 'Trendy clothing, shoes, accessories for men and women', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 'shopping-bag', '#E91E63', 2),
('Home & Garden', 'Furniture, decor, kitchen appliances, and garden tools', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'home', '#4CAF50', 3),
('Sports & Fitness', 'Sports equipment, fitness gear, and outdoor activities', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'futbol-o', '#FF9800', 4),
('Books & Media', 'Books, e-books, audiobooks, and educational materials', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 'book', '#9C27B0', 5),
('Health & Beauty', 'Skincare, makeup, health supplements, and wellness products', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 'heart', '#F44336', 6),
('Automotive', 'Car accessories, tools, and automotive equipment', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', 'car', '#607D8B', 7),
('Kids & Baby', 'Toys, baby products, children clothing, and educational items', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'child', '#FFEB3B', 8);
