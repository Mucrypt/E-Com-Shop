-- Migration: add payment_intent_id to orders; pricing fields to cart_items
BEGIN;

-- Add columns to orders (if not exists)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_intent_id text,
  ADD COLUMN IF NOT EXISTS payment_gateway text;

-- Add pricing enrichment columns to cart_items
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS original_price numeric,
  ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0),
  ADD COLUMN IF NOT EXISTS options jsonb;

-- Backfill original_price where null (use price as baseline)
UPDATE public.cart_items SET original_price = price WHERE original_price IS NULL;

COMMIT;

-- Down migration (manual):
-- ALTER TABLE public.orders DROP COLUMN payment_intent_id; ALTER TABLE public.orders DROP COLUMN payment_gateway;
-- ALTER TABLE public.cart_items DROP COLUMN original_price, DROP COLUMN discount_amount, DROP COLUMN options;