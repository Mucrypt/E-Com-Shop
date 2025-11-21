# Cart System Documentation

This document explains the cart feature end‑to‑end: UI, state, persistence, hydration, security, and testing. It’s meant to help you continue building confidently.

## Overview
- Purpose: Robust cart with local UX, backend persistence, and server-side hydration.
- Stack: Expo Router, React Native, Zustand, Supabase (Auth + DB + RPC), small service layer.
- Key Paths:
  - Screen: `src/app/cart/index.tsx`
  - Checkout: `src/app/checkout/index.tsx`
  - Store: `src/store/cartStore.ts`
  - Sync Hook: `src/hooks/useCartSync.ts`
  - Providers: `src/providers/cart-sync-provider.tsx`, `src/providers/app-providers.tsx`
  - Services: `src/services/cartService.ts`
  - SQL (RPC): `src/database/hydrated-cart.sql`
  - Supabase Client: `src/lib/supabase.ts`
  - Test: `test/cartService.test.ts` (run with `npm run test:cart`)

## Data Model
- Client cart item (`CartItem` in `cartStore.ts`):
  - `id`, `name`, `price`, `originalPrice`, `quantity`, `color`, `size`, `image`, `inStock`, `category`, `rating`, `estimatedDelivery`.
- Backend rows:
  - Table `cart_items`: `user_id`, `product_id`, `quantity`, `price`.
  - Table `products`: `id`, `name`, `price`, `original_price`, `image_url`, `images` (jsonb), `in_stock`, `rating`, `category_id`.
  - Table `categories`: `id`, `name`.

## UI + Navigation
- Cart route: `/cart` (stack screen, gesture-enabled rows via `Swipeable`).
- Checkout route: `/checkout` (accepts `?items=comma,separated,ids`).
- Guest View: If `!isAuthenticated`, cart shows a sign-in/register CTA and safe promotional sections.
- Authenticated Empty State: Friendly message + “Start Shopping” button.
- Item List: Select/deselect, per-item quantity controls, swipe-to-delete, discounts display, etc.
- Bottom Bar: Select-all, totals, “Checkout (n)” button; opens `/checkout` carrying selected IDs.

## State Management (Zustand)
- Store file: `src/store/cartStore.ts`.
- Important methods:
  - `addToCart(item, qty?)`, `removeFromCart(id)`, `updateQuantity(id, qty)`, `clearCart()`.
  - Computed helpers: `getCartTotal()`, `getCartSubtotal()`, `getCartSavings()`, `getCartCount()`.
  - Selection helpers: `isItemInCart(id)`, `getItemQuantity(id)`, `getSelectedItemsTotal(ids)`.
  - Backend helpers: `setCartItems(items)` (hydrate full client items), `replaceFromBackend(rows)` (raw rows → placeholder items; prefer full hydration when possible).
- Devtools: Wrapped with `devtools` middleware and `subscribeWithSelector`.

## Sync Lifecycle
- Provider: `CartSyncProvider` mounts `useCartSync` globally (see `app-providers.tsx`).
- Hook: `useCartSync` does two things:
  1) On auth, loads hydrated items via RPC-first `get_hydrated_cart` with fallback to client-side join.
  2) Debounced persistence: pushes cart changes after ~900ms if authenticated (skips immediate push within 500ms of load).
- Checkout flush: `/checkout` immediately upserts selected items on mount, and again before “Proceed to Payment” for double-safety.

### Debounce Details
- Load → sets items → `lastPushRef` prevents an immediate re-push (500ms window).
- Subsequent changes → queued with a 900ms debounce to reduce write pressure.

## Service Layer
- File: `src/services/cartService.ts`.
- Methods:
  - `getHydratedCart(userId, client)`: RPC-first `get_hydrated_cart(user_id uuid)`, maps to `CartItem[]`. Fallback to `fetchCartWithProducts`.
  - `fetchCartWithProducts(userId, client)`: Fetches `cart_items`, then joins products/categories on the client.
  - `buildUpsertRows(userId, items, subsetIds?)`: Build rows for `cart_items` upsert.
  - `upsertCartItems(userId, items, client)`: Upserts all items.
  - `upsertSelectedCartItems(userId, allItems, selectedIds, client)`: Upserts a subset by product IDs.
- Design Notes:
  - The functions accept a `client` param to keep Node tests decoupled from RN client imports.

## RPC: Server Hydration
- File: `src/database/hydrated-cart.sql`.
- Signature (current): `get_hydrated_cart(user_id uuid)`
- Returns cart items joined with product/category, picking first image from `products.images` (jsonb) or fallback `image_url`.
- Granted to `authenticated` role, with `security definer` + `stable` and `search_path = public, pg_temp`.

### More Secure Variant (Optional)
If you want to avoid passing `user_id` from the client, consider a no-parameter RPC using `auth.uid()`:

```sql
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
  select ...
  where ci.user_id = auth.uid();
$$;
```
Client call becomes `client.rpc('get_hydrated_cart')`.

## Security + RLS
- RLS must be enabled on `cart_items`, `products`, `categories`.
- Policies should ensure:
  - `cart_items`: user can `select/insert/update` only rows where `user_id = auth.uid()`.
  - `products`/`categories`: readable to authenticated users (or as per your business rules).
- SECURITY DEFINER function runs with owner privileges, but RLS on underlying tables still applies. Verify owner/privileges are appropriate.

## Error Handling
- Load errors logged as warnings: `Cart load error`.
- Sync errors logged as warnings: `Cart sync error`.
- Checkout flush errors logged as warnings: `Checkout flush failed` / `Final checkout flush failed`.
- Consider wiring toast notifications or Sentry for production.

## Testing
- Command: `npm run test:cart`.
- Scope: Service-level tests for hydration and upsert behavior using a mock client (Node-friendly).
- Tip: Because services receive `client` as a parameter, they’re easy to unit test without RN bundling issues.

## Developer Recipes
- Navigate to cart: `router.push('/cart')`.
- Add to cart:
```ts
useCartStore.getState().addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.original_price ?? product.price,
  color: 'Black',
  size: 'M',
  image: product.image_url,
  inStock: product.in_stock,
  category: 'Clothes',
  rating: product.rating ?? 0,
  estimatedDelivery: '2-5 days',
}, 1)
```
- Manual persist (if needed):
```ts
await upsertCartItems(user.id, useCartStore.getState().cartItems, supabase)
```
- Checkout navigation with selection:
```ts
const param = selectedIds.join(',')
router.push(`/checkout?items=${encodeURIComponent(param)}`)
```

## Troubleshooting
- Cart not hydrating:
  - Verify RPC exists: run `select * from public.get_hydrated_cart('USER_UUID');`.
  - Check RLS policies and role grants.
  - If RPC missing, service falls back to client-side join.
- TypeScript errors in services:
  - Ensure param types are explicit (no implicit any).
- Node test bundling errors:
  - Keep services decoupled from RN-specific imports by passing the Supabase client as a param.

## Roadmap Ideas
- Replace sample `initialCartItems` with empty default for production.
- React Query integration for cached hydration and stale-while-revalidate.
- Move checkout into a multi-step flow (shipping, payment, review).
- Add server-side stock checks and price verification during checkout.
- Edge function for bulk upserts with rate limiting.
- Observability: Sentry logging for cart sync/checkout flows.
- Introduce `checkoutService` (see `docs/checkout-flow.md`) for orchestrated order + payment intent lifecycle.

## Quick Links
- Cart screen: `src/app/cart/index.tsx`
- Checkout: `src/app/checkout/index.tsx`
- Checkout Flow Doc: `docs/checkout-flow.md`
- Store: `src/store/cartStore.ts`
- Sync: `src/hooks/useCartSync.ts`
- Providers: `src/providers/app-providers.tsx` / `src/providers/cart-sync-provider.tsx`
- Services: `src/services/cartService.ts`
- SQL: `src/database/hydrated-cart.sql`
