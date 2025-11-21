# create_payment_intent Edge Function

Creates a Stripe Payment Intent.

## Setup
1. Set environment variable in Supabase dashboard:
   - `STRIPE_SECRET_KEY=sk_live_...`
2. Deploy function (Supabase CLI):
```bash
supabase functions deploy create_payment_intent
```
3. Invoke from client via `fetch`:
```ts
const res = await fetch(`https://YOUR_REF.functions.supabase.co/create_payment_intent`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId, amount: Math.round(total * 100), currency: 'EUR' })
})
const { clientSecret } = await res.json()
```

## Response
```json
{ "clientSecret": "pi_secret_...", "paymentIntentId": "pi_..." }
```

## Notes
- `amount` must be in the smallest currency unit (e.g. cents).
- Validate order ownership server-side before intent creation if expanding logic.
- Consider adding signature verification or session validation for extra security.
