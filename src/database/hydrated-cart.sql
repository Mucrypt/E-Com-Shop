-- RPC: get_hydrated_cart(user_id uuid)
-- Returns cart items joined with product and category info

-- Updated: parameterless version using auth.uid()
create or replace function public.get_hydrated_cart()
returns table (
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
language sql
stable
security definer
set search_path = public, pg_temp
as $$
	select
		ci.product_id,
		ci.quantity,
		ci.price,
		p.name as product_name,
		p.original_price,
		coalesce((p.images->>0), p.image_url) as image,
		p.image_url,
		p.in_stock,
		p.rating,
		c.name as category,
		c.name as category_name,
		'2-5 days'::text as estimated_delivery,
		null::text as color,
		null::text as size
	from public.cart_items ci
	join public.products p on p.id = ci.product_id
	left join public.categories c on c.id = p.category_id
	where ci.user_id = auth.uid();
$$;

-- Grant execute to authenticated users (adjust if you use other roles)
-- Update grant to new signature
grant execute on function public.get_hydrated_cart() to authenticated;

-- Notes:
-- - RLS remains enforced even with SECURITY DEFINER unless owned by table owner with row security disabled.
-- - Ensure your cart_items/products/categories policies allow the intended access pattern.
