-- Migration: parameterless get_hydrated_cart() using auth.uid()
-- Safely drop old function signature (if existed) taking uuid param
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'get_hydrated_cart' AND n.nspname = 'public' AND p.pronargs = 1
  ) THEN
    DROP FUNCTION public.get_hydrated_cart(uuid);
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.get_hydrated_cart()
RETURNS TABLE (
  product_id uuid,
  quantity int,
  price numeric,
  product_name text,
  original_price numeric,
  image text,
  image_url text,
  in_stock boolean,
  rating numeric,
  category text,
  category_name text,
  estimated_delivery text,
  color text,
  size text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    ci.product_id,
    ci.quantity,
    ci.price,
    p.name AS product_name,
    p.original_price,
    COALESCE((p.images->>0), p.image_url) AS image,
    p.image_url,
    p.in_stock,
    p.rating,
    c.name AS category,
    c.name AS category_name,
    '2-5 days'::text AS estimated_delivery,
    NULL::text AS color,
    NULL::text AS size
  FROM public.cart_items ci
  JOIN public.products p ON p.id = ci.product_id
  LEFT JOIN public.categories c ON c.id = p.category_id
  WHERE ci.user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_hydrated_cart() TO authenticated;

-- Down migration (manual):
-- DROP FUNCTION IF EXISTS public.get_hydrated_cart();
