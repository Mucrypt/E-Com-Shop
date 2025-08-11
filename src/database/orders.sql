-- Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  order_number text unique not null,
  status text default 'pending' check (status in (
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 
    'cancelled', 'refunded', 'returned'
  )),
  payment_status text default 'pending' check (payment_status in (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  )),
  payment_method text check (payment_method in (
    'credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 
    'bank_transfer', 'cash_on_delivery'
  )),
  subtotal decimal(10,2) not null check (subtotal >= 0),
  tax_amount decimal(10,2) default 0 check (tax_amount >= 0),
  shipping_amount decimal(10,2) default 0 check (shipping_amount >= 0),
  discount_amount decimal(10,2) default 0 check (discount_amount >= 0),
  total_amount decimal(10,2) not null check (total_amount >= 0),
  currency text default 'USD',
  
  -- Shipping information
  shipping_address jsonb,
  billing_address jsonb,
  shipping_method text,
  tracking_number text,
  estimated_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  
  -- Order metadata
  notes text, -- Customer notes
  admin_notes text, -- Internal notes
  source text default 'mobile_app', -- Order source
  
  -- Important dates
  confirmed_at timestamp with time zone,
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for orders
alter table orders enable row level security;

-- RLS Policies for orders
-- Users can only view their own orders
create policy "Users can view own orders." on orders
  for select using (auth.uid() = user_id);

-- Users can create their own orders
create policy "Users can create own orders." on orders
  for insert with check (auth.uid() = user_id);

-- Users can update their own pending orders
create policy "Users can update own pending orders." on orders
  for update using (auth.uid() = user_id and status = 'pending');

-- Create indexes for better performance
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_orders_user_status on orders(user_id, status);

-- Create trigger to automatically update updated_at
drop trigger if exists update_orders_updated_at on orders;
create trigger update_orders_updated_at
  before update on orders
  for each row execute procedure public.update_updated_at_column();

-- Create function to generate order number
create or replace function public.generate_order_number()
returns text as $$
declare
  order_num text;
  counter integer;
begin
  -- Generate order number with format: ORD-YYYYMMDD-NNNN
  select coalesce(max(cast(substring(order_number from 'ORD-\d{8}-(\d+)') as integer)), 0) + 1
  into counter
  from orders
  where order_number like 'ORD-' || to_char(now(), 'YYYYMMDD') || '-%';
  
  order_num := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(counter::text, 4, '0');
  return order_num;
end;
$$ language plpgsql;

-- Create function to auto-generate order number
create or replace function public.set_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := public.generate_order_number();
  end if;
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-generate order number
drop trigger if exists set_order_number_trigger on orders;
create trigger set_order_number_trigger
  before insert on orders
  for each row execute procedure public.set_order_number();

-- Create function to update order timestamps based on status
create or replace function public.update_order_timestamps()
returns trigger as $$
begin
  -- Update timestamps based on status changes
  if old.status != new.status then
    case new.status
      when 'confirmed' then
        new.confirmed_at := now();
      when 'shipped' then
        new.shipped_at := now();
      when 'delivered' then
        new.delivered_at := now();
        new.actual_delivery_date := now();
      when 'cancelled' then
        new.cancelled_at := now();
    end case;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to update order timestamps
drop trigger if exists update_order_timestamps on orders;
create trigger update_order_timestamps
  before update on orders
  for each row execute procedure public.update_order_timestamps();
