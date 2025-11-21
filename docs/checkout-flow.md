# Checkout Flow Documentation

This guide explains how checkout currently works and how to extend it.

## Overview
The checkout process operates on a selected subset of cart items passed via the query param `items` to the route `/checkout`. If the param is absent, all cart items are assumed selected.

## Selection Mechanics
- Cart screen builds a comma-separated list of selected product IDs: `selectedIds.join(',')`.
- Navigation: `router.push(`/checkout?items=${encodeURIComponent(param)}`)`.
- In checkout, `useLocalSearchParams()` parses `items` and splits on commas.
- Fallback: If no param, all cart item IDs are used.

## Immediate Flush
On mount, checkout upserts all selected items to `cart_items` to ensure backend consistency (quantity/price). This reduces risk of losing recent local changes if the user navigates quickly.

## Final Flush
Pressing "Proceed to Payment" triggers a second upsert of the selected items (double-safety) before handing off to payment logic.

## Service Integration
Uses `upsertSelectedCartItems(userId, minimalSubset, selectedIds, client)` from `cartService.ts`.

## Auth Guard
If `!isAuthenticated`, screen shows a sign-in prompt. No upserts occur.

## Data Integrity Assumptions
- Client-provided price is accepted; future enhancement: verify against authoritative product price at payment time.
- Quantities assumed valid (>=1); upstream store ensures no zero/negative.

## Extensibility Ideas
1. Multi-step UI: Shipping -> Payment -> Review -> Confirmation.
2. Stock & price revalidation: Fetch fresh product data and reconcile differences before payment.
3. Promotions engine: Apply dynamic coupons/discount rules server-side.
4. Order creation: Insert `orders` + `order_items` on finalization; return order ID.
5. Payment integration: Add secure edge function to create payment intent (Stripe, etc.).
6. Error reporting: Wrap flush calls with logging/monitoring (Sentry).
7. Optimistic order preview: Pre-calculate delivery estimates and total savings.
8. Split shipments: Group items by vendor/warehouse.

## checkoutService Overview
File: `src/services/checkoutService.ts`

Exports:
- `prepareCheckout(userId, selectedIds, cartItems, client)` → Hydrates + verifies items, computes subtotal/discounts/total.
- `createOrderDraft(prepared, client)` → Inserts draft order + order_items rows.
- `createPaymentIntent(order, client)` → Calls Edge Function `create_payment_intent` (Stripe secret stays server-side).
- `finalizeOrder(orderId, client, paymentIntentId)` → Marks order as paid.
- `fullCheckoutFlow(userId, selectedIds, cartItems, client)` → Orchestrates prepare + draft + payment intent; returns clientSecret & orderId.

Edge Function expectation (`create_payment_intent`): In the hardened implementation we do **not** trust client `amount`. The server re-fetches the order and uses `order.total_amount`. See `docs/deno-edge-functions.md#3-create_payment_intent-function-secure-intent-creation`.

### Suggested Edge Function (Example Skeleton)
```ts
// supabase/functions/create_payment_intent/index.ts
import Stripe from 'stripe'
export default async (req: Request): Promise<Response> => {
	const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })
	const { orderId, amount, currency } = await req.json()
	const intent = await stripe.paymentIntents.create({ amount, currency, metadata: { orderId } })
	return new Response(JSON.stringify({ clientSecret: intent.client_secret, paymentIntentId: intent.id }), { headers: { 'Content-Type': 'application/json' } })
}
```
Actual stub created at: `supabase/functions/create_payment_intent/index.ts`.
Deploy with:
```bash
supabase functions deploy create_payment_intent
```

## Webhook Flow
Stripe sends asynchronous events to finalize order state:
- Edge Function: `supabase/functions/stripe_webhook/index.ts` (created)
- Required env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`
- Handles:
	- `payment_intent.succeeded` → `orders.payment_status='paid', status='confirmed'`
	- `payment_intent.payment_failed` → `orders.payment_status='failed', status='pending'`

Deploy webhook:
```bash
supabase functions deploy stripe_webhook
```
Set Stripe endpoint to: `https://<PROJECT-REF>.functions.supabase.co/stripe_webhook`

Hardened webhook performs manual HMAC verification + amount revalidation (flags `amount_mismatch`). See `docs/deno-edge-functions.md#4-stripe_webhook-function-hardened-event-processing`.

## Schema Additions
Recent migration added:
- `orders.payment_intent_id`, `orders.payment_gateway`
- `cart_items.original_price`, `cart_items.discount_amount`, `cart_items.options`

Checkout flow now (cross-linked with Edge docs):
1. Flush cart selection
2. `fullCheckoutFlow` → prepare, create order draft, create payment intent, update order with `payment_intent_id`, `payment_status='pending'`
3. Client confirms payment (Stripe SDK) using `clientSecret`
4. Webhook updates order status to confirmed / paid
5. App may poll or subscribe to order changes for UI updates (polling hook example below)

### Client Flow Summary
1. User selects items → navigate to `/checkout`.
2. (Optional) Display summary using existing cart store.
3. Invoke `fullCheckoutFlow(...)` to get `clientSecret`.
4. Confirm payment using Stripe React Native SDK with clientSecret.
5. On success, optionally rely **only** on webhook to finalize (recommended) or call `finalizeOrder(orderId, client, paymentIntentId)` if still using legacy flow.
6. Clear purchased items from cart or mark status.

### Polling Hook Example (`useOrderStatus`)
To avoid race conditions and keep UI reactive without immediate finalize calls, use a polling hook that checks the order row until `payment_status` changes:
```ts
// src/hooks/useOrderStatus.ts (created in repository)
const { order, status, paymentStatus } = useOrderStatus(orderId)
```
This hook encapsulates interval polling, exposes `refresh()`, and stops automatically on a terminal state (`paid`, `failed`, `amount_mismatch`). Implementation details in file.

### Security Notes
- Never embed Stripe secret keys in client bundle.
- Edge Function must validate `amount` matches authoritative recomputed total server-side (implemented; see `deno-edge-functions.md`).
- Consider locking order rows while payment is in progress (`status = 'pending'`).

## Linking Back
See `docs/cart.md` for cart state, hydration, and sync details; service flow integrates with `useCartSync` for consistent quantities.

## Security Considerations
- RLS on `cart_items` ensures users can only modify their own rows.
- Price tampering mitigation should verify product price on the server before charging.
- Avoid trusting client-side coupon application; recompute server-side.

## Future Checkout Service
Introduce `checkoutService` to consolidate:
- `prepareCheckout(userId, selectedIds)` → hydrate + validate
- `finalizeCheckout(userId, selectedIds)` → transactional creation of order & items
- `createPaymentIntent(userId, orderId)` → edge function call

## Linking Back
See:
- `docs/cart.md` for cart state, hydration, and sync details.
- `docs/deno-edge-functions.md` for secure intent creation, manual HMAC webhook verification, and mismatch handling.
