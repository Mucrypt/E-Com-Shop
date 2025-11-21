// Supabase Edge Function: create_payment_intent
// Creates a Stripe Payment Intent for an order AFTER re-validating total on the server.
// SECURITY NOTES:
//  - Amount sent by client is ignored. We re-fetch order from DB.
//  - Requires env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Request Body: { orderId: string, currency?: string }
// Response: { clientSecret: string, paymentIntentId: string, orderId: string }
// Idempotency: If order already has payment_intent_id we return 409.

/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
// Deno global stubbed via edge-types.d.ts for editor intellisense

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestPayload {
  orderId?: string
  currency?: string // optional override if order row lacks currency
}

interface StripeIntentResponse {
  id: string
  client_secret: string
  status: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

function getEnv(name: string, required = false): string | undefined {
  const v = Deno.env.get(name)
  if (required && !v) throw new Error(`Missing required env var: ${name}`)
  return v
}

async function createStripePaymentIntent(orderId: string, amount: number, currency: string, stripeSecret: string) {
  const body = new URLSearchParams({
    amount: amount.toString(),
    currency,
    'automatic_payment_methods[enabled]': 'true',
    'metadata[orderId]': orderId,
  })
  const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Stripe error (${resp.status}): ${text}`)
  }
  const json = (await resp.json()) as StripeIntentResponse
  if (!json.client_secret) throw new Error('Stripe did not return client_secret')
  return json
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') return jsonResponse({ error: 'Method Not Allowed' }, 405)

    const payload: RequestPayload = await req.json().catch(() => ({}))
    const { orderId, currency: currencyOverride } = payload
    if (!orderId || typeof orderId !== 'string') return jsonResponse({ error: 'Invalid or missing orderId' }, 400)

    const stripeSecret = getEnv('STRIPE_SECRET_KEY', true) as string
    const supabaseUrl = getEnv('SUPABASE_URL', true) as string
    const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', true) as string

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // Fetch order to recompute amount securely
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id,total_amount,currency,payment_intent_id')
      .eq('id', orderId)
      .single()

    if (orderError) return jsonResponse({ error: 'Order not found', details: orderError.message }, 404)
    if (!order) return jsonResponse({ error: 'Order not found' }, 404)
    if (order.payment_intent_id) return jsonResponse({ error: 'Payment intent already exists for order' }, 409)

    const amount = typeof order.total_amount === 'number' && order.total_amount > 0 ? Math.round(order.total_amount) : 0
    if (!amount) return jsonResponse({ error: 'Order has invalid total_amount' }, 400)

    const currency = (order.currency || currencyOverride || 'usd').toLowerCase()
    if (!/^[a-z]{3}$/.test(currency)) return jsonResponse({ error: 'Invalid currency' }, 400)

    const intent = await createStripePaymentIntent(orderId, amount, currency, stripeSecret)

    // Persist payment_intent_id & payment_status pending
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_intent_id: intent.id, payment_status: 'pending', payment_gateway: 'stripe' })
      .eq('id', orderId)
    if (updateError) return jsonResponse({ error: 'Failed to update order with intent', details: updateError.message }, 500)

    return jsonResponse({ clientSecret: intent.client_secret, paymentIntentId: intent.id, orderId })
  } catch (e) {
    console.error('create_payment_intent error', e)
    return jsonResponse({ error: 'Internal Server Error', details: (e as Error).message }, 500)
  }
})
