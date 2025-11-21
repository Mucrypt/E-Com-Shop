# E-Commerce Shop - Authentication Setup Guide

## Prerequisites

1. **Supabase Project Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key to the `.env` file
   - Make sure your `.env` file has the correct Supabase credentials

## Database Setup

1. **Run the Schema**

   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all necessary tables and policies

2. **Verify Tables Created**
   - Check that these tables exist in your Database > Tables:
     - `profiles`
     - `products`
     - `categories`
     - `orders`
     - `order_items`

## Authentication Configuration

1. **Email Settings** (in Supabase Dashboard)

   - Go to Authentication > Settings
   - Configure your email templates
   - For development, you can disable email confirmation:
     - Go to Authentication > Settings
     - Turn OFF "Enable email confirmations"
     - This allows immediate login without email verification

2. **URL Configuration**
   - Set your site URL and redirect URLs in Authentication > URL Configuration
   - For development: `http://localhost:8081` or your Expo dev URL

## App Configuration

1. **Environment Variables**

   - Ensure your `.env` file has:

     ```env
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

2. **Authentication Flow**
   - The app uses the AuthProvider for real Supabase authentication
   - Session management is handled by SessionProvider
   - App state is managed by AppStateProvider
   - Products are managed by ProductProvider

## Testing the Setup

1. **Register a New User**

   - Go to the auth screen
   - Switch to "Create Account"
   - Fill in the form and submit
   - Check Supabase Dashboard > Authentication > Users to see the new user

2. **Login**

   - Use the email and password you just created
   - You should be redirected to the shop area

3. **Verify Profile Creation**
   - Check Database > Tables > profiles
   - You should see a profile created for your user

## Common Issues

1. **"Invalid login credentials"**

   - Make sure the user exists in Authentication > Users
   - If email confirmation is enabled, verify the email first

2. **Profile not created**

   - Check if the trigger function is created in Database > Functions
   - Verify RLS policies are set up correctly

3. **Can't see products**
   - Make sure the products table has data
   - Check RLS policies allow public read access

## Features Included

- ✅ User registration and login with Supabase
- ✅ Automatic profile creation on signup
- ✅ Session management with auto-logout
- ✅ Product catalog with categories
- ✅ Order management (structure ready)
- ✅ Row Level Security (RLS) for data protection
- ✅ Real-time authentication state management

## Development Tips

1. **Reset Authentication**

   - Clear app data in Expo dev client
   - Or restart the dev server

2. **Debug Authentication**

   - Check the console logs for authentication events
   - Use Supabase Dashboard > Logs for server-side debugging

3. **Test Different Users**
   - Create multiple accounts to test the flow
   - Use different email addresses

## Production Checklist

- [ ] Enable email confirmations
- [ ] Set up proper email templates
- [ ] Configure production URLs
- [ ] Set up proper error handling
- [ ] Enable audit logging
- [ ] Review and test all RLS policies
