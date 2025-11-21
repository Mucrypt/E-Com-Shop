// Stripe Webhook Edge Function (Hardened)
// - Manual HMAC signature verification (no Stripe SDK dependency)
// - Re-validates order total against payment_intent amount
// - Updates payment_status & status; flags mismatches
// Env Vars REQUIRED: STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Endpoint: https://<PROJECT>.functions.supabase.co/stripe_webhook
// Supported events: payment_intent.succeeded, payment_intent.payment_failed

/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
// Deno global stubbed via edge-types.d.ts for editor intellisense

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface StripeWebhookEvent<T = any> {
  id: string
  object: string
  type: string
  data: { object: T }
}

interface StripePaymentIntent {
  id: string
  object: 'payment_intent'
  amount: number
  currency: string
  metadata?: { [k: string]: string }
  status: string
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

async function hexDigest(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function parseStripeSignature(header: string | null) {
  if (!header) return null
  const parts = header.split(',').map((p) => p.split('='))
  const map: Record<string, string> = {}
  for (const [k, v] of parts) map[k] = v
  if (!map.t || !map.v1) return null
  return { timestamp: map.t, signature: map.v1 }
}

async function verifySignature(rawBody: string, header: string | null, secret: string) {
  const parsed = parseStripeSignature(header)
  if (!parsed) return false
  const payload = `${parsed.timestamp}.${rawBody}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  const expected = await hexDigest(sigBuf)
  // Constant-time compare
  if (expected.length !== parsed.signature.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ parsed.signature.charCodeAt(i)
  return mismatch === 0
}

async function fetchPaymentIntent(id: string, secretKey: string): Promise<StripePaymentIntent | null> {
  const resp = await fetch(`https://api.stripe.com/v1/payment_intents/${id}`, {
    headers: { Authorization: `Bearer ${secretKey}` }
  })
  if (!resp.ok) return null
  const json = await resp.json()
  return json as StripePaymentIntent
}

Deno.serve(async (req: Request) => {
  const rawBody = await req.text()
  const sigHeader = req.headers.get('stripe-signature')

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const secretKey = Deno.env.get('STRIPE_SECRET_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!webhookSecret || !secretKey || !supabaseUrl || !serviceKey) {
    return jsonResponse({ error: 'Missing env configuration' }, 500)
  }

  const signatureOk = await verifySignature(rawBody, sigHeader, webhookSecret)
  if (!signatureOk) {
    return jsonResponse({ error: 'Invalid signature' }, 400)
  }

  let event: StripeWebhookEvent
  try {
    event = JSON.parse(rawBody)
  } catch (e) {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as StripePaymentIntent
    const orderId = pi.metadata?.orderId
    if (orderId) {
      // Fetch order & validate amount
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('id,total_amount,payment_intent_id')
        .eq('payment_intent_id', pi.id)
        .single()

      if (orderErr || !order) {
        console.error('Order fetch error', orderErr)
      } else {
        const stored = typeof order.total_amount === 'number' ? Math.round(order.total_amount) : 0
        const intentAmount = pi.amount
        let nextStatus = 'confirmed'
        let nextPaymentStatus = 'paid'
        if (stored !== intentAmount) {
          nextPaymentStatus = 'amount_mismatch'
          nextStatus = 'pending'
        }
        const { error: updateErr } = await supabase
          .from('orders')
          .update({ payment_status: nextPaymentStatus, status: nextStatus })
          .eq('payment_intent_id', pi.id)
        if (updateErr) console.error('Order update error', updateErr)
      }
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as StripePaymentIntent
    const { error: updErr } = await supabase
      .from('orders')
      .update({ payment_status: 'failed', status: 'pending' })
      .eq('payment_intent_id', pi.id)
    if (updErr) console.error('Failed status update', updErr)
  }

  return jsonResponse({ received: true })
})
