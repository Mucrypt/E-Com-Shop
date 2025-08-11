# 🚀 Quick Database Deployment Guide

## Prerequisites

1. **Set up your environment variables:**

   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your Supabase credentials
   ```

2. **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy the URL and keys to your `.env` file

## Deployment Commands

### 🔍 Check Database Status

```bash
npm run check-db
```

This shows which tables exist and their row counts.

### 🚀 Deploy Database Schema

```bash
npm run deploy-db
```

This deploys all your SQL files to Supabase in the correct order.

### 📱 Start Your App

```bash
npm start
```

After deploying, your app will connect to the database.

## Quick Setup Steps

1. **Deploy your database:**

   ```bash
   npm run deploy-db
   ```

2. **Verify deployment:**

   ```bash
   npm run check-db
   ```

3. **Start your app:**

   ```bash
   npm start
   ```

4. **Test in your app:**
   - Register a new account
   - Check if products/categories load
   - Verify the data in Supabase Dashboard

## Manual Deployment (Alternative)

If the automated deployment doesn't work:

1. Go to Supabase Dashboard > SQL Editor
2. Execute these files in order:
   - `src/database/users.sql`
   - `src/database/categories.sql`
   - `src/database/products.sql`
   - `src/database/orders.sql`
   - `src/database/order_items.sql`

## Troubleshooting

### Error: Missing environment variables

- Make sure you've created a `.env` file with your Supabase credentials

### Error: Connection failed

- Verify your SUPABASE_URL and SUPABASE_SERVICE_KEY are correct
- Check your internet connection

### Error: Table already exists

- This is normal if you've deployed before
- The script will skip existing tables

### Error: Permission denied

- Make sure you're using the SERVICE_KEY (not the anon key) for deployment
- Check that your Supabase project is active

## Next Steps

After successful deployment:

1. ✅ Tables are created in Supabase
2. ✅ Your app can now authenticate users
3. ✅ Products and categories will load
4. ✅ Shopping cart and orders will work

Add sample data using the examples in `DATABASE_DEPLOYMENT.md` or through your app! 🎉
