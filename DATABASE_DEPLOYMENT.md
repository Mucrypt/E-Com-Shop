# Database Deployment Guide

This guide will help you set up your Supabase PostgreSQL database with the new schema structure.

## 📋 Overview

Your database has been restructured to use individual SQL files for each table, with a modern e-commerce schema that includes:

- **Users Table**: Replaces the old `profiles` table with comprehensive user profile data
- **Categories Table**: Enhanced with icons, colors, and SEO fields
- **Products Table**: Full e-commerce product structure with variants, inventory, and marketing fields
- **Orders Table**: Complete order management with status tracking and payment info
- **Order Items Table**: Line items with pricing calculations and customizations

## 🗂️ File Structure

Your database files are located in `src/database/`:

```text
database/
├── supabase-schema.sql      # Master file (reference only)
├── users.sql               # User profiles and authentication
├── categories.sql          # Product categories
├── products.sql            # Product catalog
├── orders.sql              # Order management
└── order_items.sql         # Order line items
```

## 🚀 Deployment Steps

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute SQL Files in Order

**IMPORTANT**: Execute the files in this exact order to maintain foreign key relationships:

#### 1. Deploy Users Table

- Open `src/database/users.sql`
- Copy the entire content
- Paste into Supabase SQL Editor
- Click **Run** to execute

#### 2. Deploy Categories Table

- Open `src/database/categories.sql`
- Copy the entire content
- Paste into Supabase SQL Editor
- Click **Run** to execute

#### 3. Deploy Products Table

- Open `src/database/products.sql`
- Copy the entire content
- Paste into Supabase SQL Editor
- Click **Run** to execute

#### 4. Deploy Orders Table

- Open `src/database/orders.sql`
- Copy the entire content
- Paste into Supabase SQL Editor
- Click **Run** to execute

#### 5. Deploy Order Items Table

- Open `src/database/order_items.sql`
- Copy the entire content
- Paste into Supabase SQL Editor
- Click **Run** to execute

### Step 3: Verify Deployment

After executing all files, verify your database structure:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `users` (with user profiles)
   - `categories` (with product categories)
   - `products` (with product catalog)
   - `orders` (with order data)
   - `order_items` (with order line items)

### Step 4: Insert Sample Data (Optional)

You can add some sample data to test your setup:

```sql
-- Sample categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', '📱', '#3B82F6'),
('Clothing', 'clothing', 'Fashion and apparel', '👕', '#EF4444'),
('Books', 'books', 'Books and literature', '📚', '#10B981');

-- Sample products
INSERT INTO products (name, slug, description, price, category_id, brand, sku, in_stock) VALUES
('iPhone 15', 'iphone-15', 'Latest Apple smartphone', 999.00,
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'IPH15-001', true),
('Cotton T-Shirt', 'cotton-tshirt', 'Comfortable cotton t-shirt', 29.99,
 (SELECT id FROM categories WHERE slug = 'clothing'), 'BasicWear', 'TSH-001', true);
```

## 🔧 Configuration Updates

### Authentication Provider

Your `auth-provider.tsx` has been updated to:

- Use the new `users` table instead of `profiles`
- Include extended profile fields (phone, address, preferences)
- Handle proper session management

### Product Provider

Your `product-provider.tsx` has been updated to:

- Use `category_id` foreign key relationships
- Support new product fields (variants, inventory, SEO)
- Include enhanced filtering and search capabilities

## 🛡️ Security Features

Your database includes:

### Row Level Security (RLS)

- **Users**: Users can only view/update their own profile
- **Categories**: Public read access, admin write access
- **Products**: Public read access, admin write access
- **Orders**: Users can only view their own orders
- **Order Items**: Users can only view items from their orders

### Triggers and Functions

- **User Profile Creation**: Automatically creates user profile when account is created
- **Order Calculations**: Auto-calculates order totals and tax
- **Inventory Management**: Updates stock levels when orders are placed
- **Timestamp Management**: Auto-updates modified timestamps

## 🧪 Testing Your Setup

After deployment, test your authentication flow:

1. **Registration**: Create a new account through your app
2. **Profile Creation**: Verify user profile is created in `users` table
3. **Login**: Test login functionality
4. **Data Access**: Verify products and categories load correctly

## 🔍 Troubleshooting

### Common Issues

#### Error: relation "profiles" does not exist

- Solution: Make sure you've deployed the users.sql file
- The old `profiles` table has been replaced with `users`

#### Error: foreign key constraint fails

- Solution: Ensure you deployed files in the correct order
- Categories must exist before products
- Users must exist before orders

#### Error: RLS policy prevents access

- Solution: Check your authentication state
- Make sure user is properly logged in
- Verify RLS policies match your use case

### Getting Help

1. Check the Supabase logs in your dashboard
2. Use the SQL Editor to run diagnostic queries
3. Verify your environment variables in your app

## 📝 Next Steps

1. Deploy the database schema following the steps above
2. Test your authentication flow
3. Verify product and category data loads correctly
4. Add sample data for testing
5. Configure your app's environment variables if needed

Your e-commerce app is now ready with a comprehensive, scalable database structure! 🎉
