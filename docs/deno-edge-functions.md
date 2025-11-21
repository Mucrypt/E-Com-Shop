## Deno Edge Functions & Payment Flow

This document explains:
- What Deno is and why Supabase Edge Functions use it.
- How your `create_payment_intent` function works securely.
- How the hardened `stripe_webhook` function validates Stripe events and updates orders.
- End‑to‑end checkout + confirmation sequence.
- Best practices, troubleshooting, and next enhancements.

---
## 1. What Is Deno?
Deno is a modern JavaScript/TypeScript runtime (like Node.js) but with:
- Secure by default: no filesystem/network/env access unless explicitly allowed (Supabase grants needed permissions internally).
- Built‑in TypeScript support (no separate build step required).
- Standard Web APIs: `fetch`, `URL`, `crypto.subtle`, `Request`, `Response` just like the browser.
- No `package.json` or `node_modules` on the server; modules are imported by URL (e.g. `https://esm.sh/@supabase/supabase-js@2`).

### Why Supabase Chooses Deno
1. Fast cold starts for edge geographic routing.
2. Simpler isolation/security model.
3. Native TS + Web API alignment reduces friction.
4. Deterministic deployments (URL imports pin versions explicitly).

### Differences From Node You Should Remember
| Concern | Node | Deno (Edge Functions) |
|---------|------|-----------------------|
| Module system | CommonJS + ESM | ESM only (URL imports) |
| TypeScript | Needs build | First‑class, auto transpile |
| Access to FS/Env/Net | Unrestricted (unless sandboxed) | Explicit permission granted by platform |
| Global APIs | Node APIs (`Buffer`, etc.) | Web APIs (`fetch`, `crypto`, `TextEncoder`) |
| Package management | npm registry | URL based (esm.sh, deno.land) |

In this project you added an `edge-types.d.ts` file to give your local VS Code TypeScript server minimal type hints for `Deno` and remote module imports. This solves editor errors without changing runtime behavior.

---
## 2. Environment Variables
Edge Functions read secrets via `Deno.env.get('NAME')`. You must configure these in the Supabase dashboard (NOT ship them to the client):
- `SUPABASE_URL` – Project REST URL.
- `SUPABASE_SERVICE_ROLE_KEY` – High‑privilege key (use ONLY server side).
- `STRIPE_SECRET_KEY` – Stripe API secret.
- `STRIPE_WEBHOOK_SECRET` – Secret for verifying webhook signatures.

Never expose these in the mobile app. The app only needs a publishable Stripe key and the Supabase anon/public key.

---
## 3. create_payment_intent Function (Secure Intent Creation)
Path: `supabase/functions/create_payment_intent/index.ts`

### Goal
Create a Stripe Payment Intent for an order while preventing tampering (client cannot override amount).

### Security Steps
1. Parse client JSON: `{ orderId, currency? }`. Ignore any amount from client.
2. Fetch the order row from Postgres using service role key.
3. Validate order exists and has no existing `payment_intent_id` (idempotency check).
4. Use `order.total_amount` (already computed server-side) as authoritative amount.
5. Call Stripe REST API `POST /v1/payment_intents` with:
   - `amount` (in smallest currency unit, e.g. cents)
   - `currency`
   - `automatic_payment_methods[enabled]=true`
   - `metadata[orderId]=<orderId>`
6. Persist `payment_intent_id`, set `payment_status='pending'`, `payment_gateway='stripe'`.
7. Return `{ clientSecret, paymentIntentId, orderId }` to client for confirmation.

### Why REST Instead of Stripe SDK?
Removing the Stripe SDK avoids remote module type errors and reduces bundle overhead. The REST call is straightforward and fully supported.

### Simplified Flow Diagram
```
Client ----(orderId)----> create_payment_intent
create_payment_intent --(SELECT order)--> Postgres
create_payment_intent --(POST intent)--> Stripe
Stripe --(intent JSON)--> create_payment_intent
create_payment_intent --(UPDATE order)--> Postgres
create_payment_intent --(clientSecret)--> Client
```

---
## 4. stripe_webhook Function (Hardened Event Processing)
Path: `supabase/functions/stripe_webhook/index.ts`

### Responsibilities
1. Verify the incoming Stripe signature without the Stripe SDK (manual HMAC SHA‑256).
2. Parse the JSON event.
3. For `payment_intent.succeeded`:
   - Fetch matching order by `payment_intent_id`.
   - Re‑validate amount (`order.total_amount` vs `pi.amount`).
   - Update `payment_status`:
     - `paid` if amounts match.
     - `amount_mismatch` + set `status='pending'` if not.
4. For `payment_intent.payment_failed`:
   - Set `payment_status='failed'`, `status='pending'`.
5. Return `{ received: true }` always (Stripe treats non‑2xx as a failure and retries).

### Manual Signature Verification Steps
1. Stripe header: `t=<timestamp>,v1=<signature>`.
2. Compose payload string: `<timestamp>.<rawBody>`.
3. HMAC SHA‑256 with your `STRIPE_WEBHOOK_SECRET`.
4. Hex encode digest and constant‑time compare with header `v1`.

### Why Manual HMAC?
Reduces dependency surface, matches Stripe’s documented algorithm, avoids large SDK import for a single feature.

### Mismatch Handling
Flagging `amount_mismatch` allows later fraud review or reconciliation. The order stays `pending` so fulfillment systems won’t ship.

### Flow Diagram
```
Stripe ---> stripe_webhook (raw body + signature)
stripe_webhook --(verify HMAC)--> OK?
   | no -> 400 Invalid signature
   | yes -> parse event
event.type == payment_intent.succeeded?
   | yes -> fetch order -> compare amounts -> update row
event.type == payment_intent.payment_failed?
   | yes -> mark failed
Return { received: true }
```

---
## 5. End‑to‑End Checkout Sequence
1. User selects cart items.
2. App calls your internal `fullCheckoutFlow` which creates order draft (inserts order + order_items with totals).
3. Client calls `create_payment_intent` (server validates order + creates intent).
4. Client uses Stripe React Native `confirmPayment(clientSecret)` to authorize card.
5. Stripe sends webhook event to `stripe_webhook`.
6. Webhook updates order status → UI polls or listens (future: realtime channel) to reflect success or mismatch/failure.

Optional future improvements: remove direct client call to `finalizeOrder` and rely solely on webhook.

---
## 6. Polling & UI Strategy
After `confirmPayment`:
- Poll `/orders` row (every 2–3s up to timeout) until `payment_status` is one of `paid | failed | amount_mismatch`.
- On `amount_mismatch`: show escalation message and skip fulfillment.
- On `failed`: allow retry (possibly create new intent).

Later you can replace polling with Supabase Realtime (listen to changes on `orders` filtered by user ID).

---
## 7. Testing Locally
Use Supabase CLI:
```
supabase functions serve create_payment_intent
supabase functions serve stripe_webhook
```
For webhook dev you can use Stripe CLI to forward events:
```
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe_webhook
```
Trigger a test payment intent event by creating a payment intent manually or completing a test card payment in your dev app.

---
## 8. Security Best Practices
- Never log full secrets or client secrets; redact partially.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` periodically (see `SECURITY_KEYS.md`).
- Restrict Stripe secret key (use a restricted key with only required permissions where possible).
- Rate limit intent creation (future: track per user requests). 
- Consider verifying user ownership of the order (order.user_id matches authenticated user) before creating intent.

---
## 9. Common Pitfalls & Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 400 Invalid signature | Wrong `STRIPE_WEBHOOK_SECRET` or body mutated | Re-check secret & ensure raw body (no JSON parse before verify) |
| Missing env configuration | Not set in Supabase dashboard | Add env vars & redeploy function |
| Mismatch status | Order total changed after intent creation | Lock totals once draft created or recalc & update intent (Stripe supports update while status requires_action) |
| Client secret undefined | Intent creation failed | Inspect Stripe logs & server error details returned |
| payment_intent already exists | User double-click or retry | Return existing client secret and prevent duplicate creation |

---
## 10. Future Enhancements
- Ephemeral keys + PaymentSheet (simplifies UI input collection).
- Realtime order status subscription (Supabase Realtime).
- Refund / cancellation edge function and webhook processing for `charge.refunded`.
- Automatic mismatch alerts (email/slack). 
- Observability: structured logs to a log aggregation service.

---
## 11. Quick Reference Snippets
Fetch order securely (service role usage only):
```ts
const { data: order } = await supabase
  .from('orders')
  .select('id,total_amount,payment_intent_id')
  .eq('id', orderId)
  .single()
```

Manual HMAC verification core:
```ts
const payload = `${timestamp}.${rawBody}`
const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
const digest = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
```

Stripe REST intent creation params:
```ts
amount: orderAmount,
currency: currency,
'automatic_payment_methods[enabled]': 'true',
'metadata[orderId]': orderId,
```

---
## 12. Summary
Deno Edge Functions give you a secure, fast execution layer close to users. By validating amounts server-side and using manual signature verification, your payment flow resists tampering. The `create_payment_intent` function ensures only authoritative totals are charged; the `stripe_webhook` finalizes payment, checks integrity, and updates order status. This separation of concerns produces a robust, enterprise‑ready checkout pipeline.

Refer back here when expanding payment methods or adding refund flows.
