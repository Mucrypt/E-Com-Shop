-- Migration: additional hardened RLS policies for orders & order_items
-- Assumes tables already exist (see existing schema files).

-- Ensure RLS enabled (idempotent)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if refining (optional guarded drops)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='Users can update own pending orders.') THEN
    DROP POLICY "Users can update own pending orders." ON public.orders;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='orders'
      AND policyname='Users can update own modifiable orders.'
  ) THEN
    CREATE POLICY "Users can update own modifiable orders." ON public.orders
      FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending','confirmed'));
  END IF;
END$$;

-- Prevent deletion by regular users (no delete policy). Admin can be added separately.

-- Harden order_items update/delete policies (re-create if needed)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can update own pending order items.') THEN
    DROP POLICY "Users can update own pending order items." ON public.order_items;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can delete own pending order items.') THEN
    DROP POLICY "Users can delete own pending order items." ON public.order_items;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can update own modifiable order items.'
  ) THEN
    CREATE POLICY "Users can update own modifiable order items." ON public.order_items
      FOR UPDATE USING (
        order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid() AND status IN ('pending','confirmed'))
      );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can delete own modifiable order items.'
  ) THEN
    CREATE POLICY "Users can delete own modifiable order items." ON public.order_items
      FOR DELETE USING (
        order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid() AND status IN ('pending','confirmed'))
      );
  END IF;
END$$;

-- Optional: Restrict insert only when parent order belongs to user and still pending/confirmed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can create own order items.') THEN
    DROP POLICY "Users can create own order items." ON public.order_items;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Users can insert items into own modifiable orders.'
  ) THEN
    CREATE POLICY "Users can insert items into own modifiable orders." ON public.order_items
      FOR INSERT WITH CHECK (
        order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid() AND status IN ('pending','confirmed'))
      );
  END IF;
END$$;

-- NOTE: Add separate policies for service role (e.g. edge function) if needing broader access.
-- Example:
-- GRANT USAGE ON SCHEMA public TO service_role;
-- Service role bypasses RLS when using its key; for explicit policies remove reliance.
