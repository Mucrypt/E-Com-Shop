-- E-Commerce Shop - Complete Database Schema
-- Run this file in Supabase SQL Editor to set up all tables and functions
-- 
-- Order of execution:
-- 1. Core functions and utilities
-- 2. Users table (extends auth.users)
-- 3. Categories table
-- 4. Products table
-- 5. Orders table
-- 6. Order items table

-- =============================================================================
-- CORE FUNCTIONS AND UTILITIES
-- =============================================================================

-- Create function to update updated_at timestamp (used by all tables)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- USERS TABLE - Run users.sql content
-- =============================================================================

\i users.sql

-- =============================================================================
-- CATEGORIES TABLE - Run categories.sql content
-- =============================================================================

\i categories.sql

-- =============================================================================
-- PRODUCTS TABLE - Run products.sql content
-- =============================================================================

\i products.sql

-- =============================================================================
-- ORDERS TABLE - Run orders.sql content
-- =============================================================================

\i orders.sql

-- =============================================================================
-- ORDER ITEMS TABLE - Run order_items.sql content
-- =============================================================================

\i order_items.sql

-- =============================================================================
-- ADDITIONAL FEATURES AND VIEWS
-- =============================================================================

-- Create view for product search with category information
create or replace view public.products_with_category as
select 
  p.*,
  c.name as category_name,
  c.icon as category_icon,
  c.color as category_color
from products p
left join categories c on p.category_id = c.id
where p.is_active = true;

-- Create view for order summary
create or replace view public.order_summary as
select 
  o.*,
  u.full_name as customer_name,
  u.email as customer_email,
  count(oi.id) as item_count,
  array_agg(
    json_build_object(
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'total_price', oi.total_price
    )
  ) as items
from orders o
join auth.users au on o.user_id = au.id
join users u on o.user_id = u.id
left join order_items oi on o.id = oi.order_id
group by o.id, u.full_name, u.email;

-- Create function for product search
create or replace function public.search_products(
  search_query text default '',
  category_filter uuid default null,
  min_price decimal default null,
  max_price decimal default null,
  in_stock_only boolean default false,
  limit_count integer default 20,
  offset_count integer default 0
)
returns setof products_with_category as $$
begin
  return query
  select *
  from products_with_category p
  where 
    (search_query = '' or 
     p.name ilike '%' || search_query || '%' or 
     p.description ilike '%' || search_query || '%' or
     search_query = any(p.tags))
    and (category_filter is null or p.category_id = category_filter)
    and (min_price is null or p.price >= min_price)
    and (max_price is null or p.price <= max_price)
    and (not in_stock_only or (p.in_stock = true and p.stock_quantity > 0))
  order by 
    case when p.is_featured then 0 else 1 end,
    p.rating desc,
    p.created_at desc
  limit limit_count
  offset offset_count;
end;
$$ language plpgsql security definer;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;

-- Enable realtime for orders (optional - for real-time order updates)
-- alter publication supabase_realtime add table orders;
-- alter publication supabase_realtime add table order_items;
