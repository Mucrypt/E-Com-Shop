# Supabase Setup Guide

This guide will help you set up Supabase for your e-commerce app.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: e.g., "E-Commerce App"
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

### 2. Get Your Supabase Credentials

After your project is created:

1. Go to **Settings** → **API**
2. You'll find:
   - **Project URL**: This is your `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Replace the placeholder values in `.env` with your actual credentials:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ```

### 4. Database Setup

You'll need to create tables for your e-commerce app. Here are some example tables:

#### Users Table (extends Supabase auth.users)

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Products Table

```sql
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);
```

#### Orders Table

```sql
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Order Items Table

```sql
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
```

### 5. Authentication Setup

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure your authentication providers:
   - Email/Password (enabled by default)
   - Social providers (Google, Apple, etc.) if needed
3. Set up email templates for confirmation, password reset, etc.
4. Configure redirect URLs for your app

### 6. Storage Setup (Optional)

If you need file uploads (product images, user avatars):

1. Go to **Storage** in your Supabase dashboard
2. Create a bucket (e.g., "product-images", "avatars")
3. Set up RLS policies for the bucket
4. Configure file upload limits and allowed file types

### 7. Testing Your Setup

Create a simple test to verify your Supabase connection:

```typescript
import { supabase } from './src/lib/supabase'

async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connected successfully!')
    }
  } catch (err) {
    console.error('Connection test failed:', err)
  }
}
```

## Environment Variables Reference

| Variable                                 | Description                         | Required |
| ---------------------------------------- | ----------------------------------- | -------- |
| `EXPO_PUBLIC_SUPABASE_URL`               | Your Supabase project URL           | ✅       |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`          | Your Supabase anon/public key       | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY`              | Service role key (server-side only) | ❌       |
| `DATABASE_URL`                           | Direct database connection URL      | ❌       |
| `EXPO_PUBLIC_SUPABASE_AUTH_REDIRECT_URL` | Auth redirect URL                   | ❌       |

## Security Notes

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Keep your service role key secret** - never use it in client-side code
3. **Use Row Level Security (RLS)** on all your tables
4. **Validate user permissions** in your app logic
5. **Use prepared statements** to prevent SQL injection

## Troubleshooting

### Common Issues

1. **"Missing environment variable" error**

   - Check that your `.env` file exists and has the correct variable names
   - Restart your development server after adding environment variables

2. **"Invalid API key" error**

   - Verify your anon key is correct
   - Check that your project URL matches exactly

3. **RLS blocking queries**

   - Ensure you have proper RLS policies set up
   - Check that users are authenticated when required

4. **CORS issues**
   - Add your development URL to allowed origins in Supabase dashboard
   - Check your redirect URLs are properly configured

## Next Steps

1. Set up authentication flows in your app
2. Create your database schema
3. Implement CRUD operations for products, orders, etc.
4. Set up real-time subscriptions for live updates
5. Configure file uploads for product images

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
