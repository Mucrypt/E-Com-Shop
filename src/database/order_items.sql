-- Create order_items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  unit_price decimal(10,2) not null check (unit_price >= 0),
  total_price decimal(10,2) not null check (total_price >= 0),
  
  -- Product snapshot (in case product details change)
  product_name text not null,
  product_sku text,
  product_image_url text,
  
  -- Pricing breakdown
  original_unit_price decimal(10,2), -- Original price before discounts
  discount_amount decimal(10,2) default 0 check (discount_amount >= 0),
  
  -- Item metadata
  product_options jsonb, -- Size, color, etc.
  notes text, -- Special instructions
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for order_items
alter table order_items enable row level security;

-- RLS Policies for order_items
-- Users can view items for their own orders
create policy "Users can view own order items." on order_items
  for select using (
    order_id in (
      select id from orders where user_id = auth.uid()
    )
  );

-- Users can create items for their own orders
create policy "Users can create own order items." on order_items
  for insert with check (
    order_id in (
      select id from orders where user_id = auth.uid()
    )
  );

-- Users can update items for their own pending orders
create policy "Users can update own pending order items." on order_items
  for update using (
    order_id in (
      select id from orders where user_id = auth.uid() and status = 'pending'
    )
  );

-- Users can delete items from their own pending orders
create policy "Users can delete own pending order items." on order_items
  for delete using (
    order_id in (
      select id from orders where user_id = auth.uid() and status = 'pending'
    )
  );

-- Create indexes for better performance
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);
create index if not exists idx_order_items_created_at on order_items(created_at);

-- Create trigger to automatically update updated_at
drop trigger if exists update_order_items_updated_at on order_items;
create trigger update_order_items_updated_at
  before update on order_items
  for each row execute procedure public.update_updated_at_column();

-- Create function to calculate total price and update product snapshot
create or replace function public.calculate_order_item_total()
returns trigger as $$
declare
  product_data record;
begin
  -- Get current product data for snapshot
  select name, sku, image_url, price
  into product_data
  from products
  where id = new.product_id;
  
  -- Update product snapshot
  new.product_name := product_data.name;
  new.product_sku := product_data.sku;
  new.product_image_url := product_data.image_url;
  
  -- Calculate total price
  new.total_price := new.quantity * new.unit_price;
  
  -- If no original price set, use current product price
  if new.original_unit_price is null then
    new.original_unit_price := product_data.price;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to calculate totals and update product snapshot
drop trigger if exists calculate_order_item_total on order_items;
create trigger calculate_order_item_total
  before insert or update on order_items
  for each row execute procedure public.calculate_order_item_total();

-- Create function to update order totals when items change
create or replace function public.update_order_totals()
returns trigger as $$
declare
  order_subtotal decimal(10,2);
  order_total decimal(10,2);
  target_order_id uuid;
begin
  -- Determine which order to update
  if TG_OP = 'DELETE' then
    target_order_id := old.order_id;
  else
    target_order_id := new.order_id;
  end if;
  
  -- Calculate new subtotal
  select coalesce(sum(total_price), 0)
  into order_subtotal
  from order_items
  where order_id = target_order_id;
  
  -- Update order totals (including tax and shipping)
  update orders
  set 
    subtotal = order_subtotal,
    total_amount = order_subtotal + tax_amount + shipping_amount - discount_amount,
    updated_at = now()
  where id = target_order_id;
  
  if TG_OP = 'DELETE' then
    return old;
  else
    return new;
  end if;
end;
$$ language plpgsql;

-- Create trigger to update order totals when items change
drop trigger if exists update_order_totals_trigger on order_items;
create trigger update_order_totals_trigger
  after insert or update or delete on order_items
  for each row execute procedure public.update_order_totals();
