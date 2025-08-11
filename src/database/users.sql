-- Create users table (extends auth.users with additional profile data)
create table if not exists public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  phone text,
  address jsonb,
  preferences jsonb default '{
    "notifications": true,
    "dark_mode": false,
    "language": "en",
    "currency": "USD"
  }'::jsonb,
  membership_tier text default 'basic' check (membership_tier in ('basic', 'premium', 'vip')),
  role text default 'USER' check (role in ('USER', 'ADMIN', 'SUPERADMIN')),
  loyalty_points integer default 0,
  email_verified boolean default false,
  phone_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table users enable row level security;

-- RLS Policies for users table
-- Users can view their own data
create policy "Users can view own data." on users
  for select using (auth.uid() = id);

-- Users can update their own data
create policy "Users can update own data." on users
  for update using (auth.uid() = id);

-- Users can insert their own data
create policy "Users can insert own data." on users
  for insert with check (auth.uid() = id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id, 
    full_name, 
    avatar_url,
    email_verified
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email_confirmed_at is not null
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create user profile on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update user data when auth.users changes
create or replace function public.handle_user_update()
returns trigger as $$
begin
  update public.users
  set 
    email_verified = new.email_confirmed_at is not null,
    updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to update user data when email is confirmed
drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();

-- Create indexes for better performance
create index if not exists idx_users_email_verified on users(email_verified);
create index if not exists idx_users_membership_tier on users(membership_tier);
create index if not exists idx_users_role on users(role);
create index if not exists idx_users_created_at on users(created_at);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
drop trigger if exists update_users_updated_at on users;
create trigger update_users_updated_at
  before update on users
  for each row execute procedure public.update_updated_at_column();

-- Helper function to check if user has admin privileges
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
declare
  user_role text;
begin
  -- Use a direct query to avoid RLS recursion
  select role into user_role from public.users where id = user_id;
  return user_role in ('ADMIN', 'SUPERADMIN');
end;
$$ language plpgsql security definer;

-- Helper function to check if user is superadmin
create or replace function public.is_superadmin(user_id uuid)
returns boolean as $$
declare
  user_role text;
begin
  -- Use a direct query to avoid RLS recursion
  select role into user_role from public.users where id = user_id;
  return user_role = 'SUPERADMIN';
end;
$$ language plpgsql security definer;

-- Function to get user role safely
create or replace function public.get_user_role(user_id uuid)
returns text as $$
declare
  user_role text;
begin
  select role into user_role from public.users where id = user_id;
  return coalesce(user_role, 'USER');
end;
$$ language plpgsql security definer;

-- Function to promote first user to SUPERADMIN (run once after first signup)
create or replace function public.promote_first_user_to_superadmin()
returns void as $$
declare
  first_user_id uuid;
begin
  -- Get the first user (oldest created_at)
  select id into first_user_id
  from users
  order by created_at asc
  limit 1;
  
  -- Update their role to SUPERADMIN if they exist
  if first_user_id is not null then
    update users 
    set role = 'SUPERADMIN'
    where id = first_user_id and role = 'USER';
  end if;
end;
$$ language plpgsql security definer;