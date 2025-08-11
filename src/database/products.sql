-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  short_description text, -- For product cards/lists
  price decimal(10,2) not null check (price >= 0),
  original_price decimal(10,2) check (original_price >= price),
  cost_price decimal(10,2), -- For profit calculations
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  sku text unique, -- Stock Keeping Unit
  barcode text,
  weight decimal(8,2), -- in kg
  dimensions jsonb, -- {length, width, height}
  images jsonb default '[]'::jsonb, -- Array of image URLs
  image_url text, -- Primary image (for backward compatibility)
  in_stock boolean default true,
  stock_quantity integer default 0 check (stock_quantity >= 0),
  min_stock_level integer default 5, -- For low stock alerts
  is_digital boolean default false, -- Digital products (downloads, services)
  is_featured boolean default false,
  is_on_sale boolean default false,
  sale_starts_at timestamp with time zone,
  sale_ends_at timestamp with time zone,
  rating decimal(3,2) default 0 check (rating >= 0 and rating <= 5),
  review_count integer default 0 check (review_count >= 0),
  tags text[], -- Array of tags for search
  meta_title text, -- SEO title
  meta_description text, -- SEO description
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table products enable row level security;

-- RLS Policies for products
-- Everyone can view active products
create policy "Anyone can view active products." on products
  for select using (is_active = true);

-- Authenticated users can view all products
create policy "Authenticated users can view all products." on products
  for select using (auth.role() = 'authenticated');

-- Create indexes for better performance
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_rating on products(rating);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_sale on products(is_on_sale);
create index if not exists idx_products_stock on products(in_stock, stock_quantity);
create index if not exists idx_products_name_search on products using gin(to_tsvector('english', name));
create index if not exists idx_products_description_search on products using gin(to_tsvector('english', description));
create index if not exists idx_products_tags on products using gin(tags);
create index if not exists idx_products_created_at on products(created_at);

-- Create trigger to automatically update updated_at
drop trigger if exists update_products_updated_at on products;
create trigger update_products_updated_at
  before update on products
  for each row execute procedure public.update_updated_at_column();

-- Create function to update stock status
create or replace function public.update_product_stock_status()
returns trigger as $$
begin
  -- Automatically set in_stock based on stock_quantity
  if new.stock_quantity <= 0 and not new.is_digital then
    new.in_stock = false;
  elsif new.stock_quantity > 0 then
    new.in_stock = true;
  end if;
  
  -- Update sale status based on dates
  if new.sale_starts_at is not null and new.sale_ends_at is not null then
    if now() between new.sale_starts_at and new.sale_ends_at then
      new.is_on_sale = true;
    else
      new.is_on_sale = false;
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update stock status
drop trigger if exists update_product_stock_status on products;
create trigger update_product_stock_status
  before insert or update on products
  for each row execute procedure public.update_product_stock_status();

-- Insert sample products
INSERT INTO public.products (
  name, description, short_description, price, original_price, category_id, brand, sku, 
  stock_quantity, is_featured, rating, review_count, tags, images, image_url
) VALUES
(
  'Wireless Noise-Cancelling Headphones',
  'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for travel, work, and entertainment.',
  'Premium wireless headphones with noise cancellation',
  89.99, 149.99,
  (SELECT id FROM categories WHERE name = 'Electronics'),
  'AudioTech Pro',
  'WH-1000XM4',
  50,
  true,
  4.5, 128,
  ARRAY['wireless', 'headphones', 'noise-cancelling', 'bluetooth'],
  '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
),
(
  'Latest Smartphone 128GB',
  'Cutting-edge smartphone with advanced camera system, fast processor, and all-day battery life. Features include Face ID, wireless charging, and 5G connectivity.',
  'Latest smartphone with advanced features',
  599.99, 699.99,
  (SELECT id FROM categories WHERE name = 'Electronics'),
  'TechMobile',
  'SM-G998B',
  25,
  true,
  4.7, 256,
  ARRAY['smartphone', 'mobile', '5g', 'camera'],
  '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
),
(
  'Professional Running Shoes',
  'High-performance running shoes designed for comfort and durability. Features advanced cushioning technology and breathable materials for all-terrain running.',
  'Professional running shoes for all terrains',
  79.99, 99.99,
  (SELECT id FROM categories WHERE name = 'Sports & Fitness'),
  'RunFast',
  'RUN-ELITE-2024',
  75,
  false,
  4.3, 89,
  ARRAY['running', 'shoes', 'sports', 'fitness'],
  '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
),
(
  'Automatic Coffee Maker',
  'Premium automatic drip coffee maker with programmable timer, thermal carafe, and built-in grinder. Makes perfect coffee every morning.',
  'Automatic drip coffee maker with timer',
  49.99, null,
  (SELECT id FROM categories WHERE name = 'Home & Garden'),
  'BrewMaster',
  'CM-AUTO-12',
  30,
  false,
  4.2, 45,
  ARRAY['coffee', 'kitchen', 'appliance', 'automatic'],
  '["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'
),
(
  'Bestselling Fiction Novel',
  'Award-winning fiction novel that captivated millions of readers worldwide. A compelling story of love, adventure, and self-discovery.',
  'Award-winning fiction novel',
  12.99, 19.99,
  (SELECT id FROM categories WHERE name = 'Books & Media'),
  'Literary Press',
  'BOOK-FICTION-001',
  100,
  true,
  4.6, 234,
  ARRAY['book', 'fiction', 'novel', 'bestseller'],
  '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
),
(
  'Portable Bluetooth Speaker',
  'Compact wireless speaker with powerful sound, waterproof design, and 12-hour battery life. Perfect for outdoor adventures and parties.',
  'Portable wireless speaker with great sound',
  39.99, 59.99,
  (SELECT id FROM categories WHERE name = 'Electronics'),
  'SoundWave',
  'BT-SPEAKER-PRO',
  60,
  false,
  4.4, 167,
  ARRAY['speaker', 'bluetooth', 'portable', 'wireless'],
  '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'
),
(
  'Elegant Summer Dress',
  'Beautiful and comfortable summer dress perfect for any occasion. Made from high-quality materials with a flattering fit.',
  'Elegant summer dress for any occasion',
  34.99, 49.99,
  (SELECT id FROM categories WHERE name = 'Fashion'),
  'StyleCo',
  'DRESS-SUM-024',
  40,
  false,
  4.3, 73,
  ARRAY['dress', 'fashion', 'summer', 'elegant'],
  '["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400'
),
(
  'Premium Yoga Mat',
  'High-quality, non-slip yoga mat with excellent cushioning and durability. Perfect for yoga, pilates, and other floor exercises.',
  'High-quality yoga mat for workouts',
  24.99, null,
  (SELECT id FROM categories WHERE name = 'Sports & Fitness'),
  'YogaLife',
  'YOGA-MAT-PREM',
  80,
  false,
  4.5, 92,
  ARRAY['yoga', 'mat', 'fitness', 'exercise'],
  '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"]'::jsonb,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
);
