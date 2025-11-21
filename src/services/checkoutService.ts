// checkoutService.ts
// Abstraction for preparing checkout data, creating orders, and initiating payment intents.
// NOTE: Stripe secret operations must occur on a secure backend or Supabase Edge Function.
// This service assumes an Edge Function named `create_payment_intent` that returns { clientSecret, paymentIntentId }.

import { Tables } from '../types/database.types'
import { CartItem } from '../store/cartStore'

export interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface PreparedCheckout {
  userId: string
  items: CheckoutItem[]
  currency: string
  subtotal: number
  discounts: number
  total: number
  warnings: string[]
}

export interface OrderDraft {
  orderId: string
  userId: string
  items: CheckoutItem[]
  total: number
  currency: string
  status: 'draft' | 'pending' | 'paid' | 'failed'
}

export interface PaymentIntentResult {
  clientSecret: string
  paymentIntentId: string
}

// Simple pricing integrity check against product rows
export async function verifyProducts(
  client: any,
  items: CheckoutItem[]
): Promise<{ verified: CheckoutItem[]; warnings: string[] }> {
  const ids = items.map(i => i.id)
  const { data: products, error } = await client
    .from('products')
    .select('id, price, in_stock')
    .in('id', ids)
  if (error) throw error

  const warnings: string[] = []
  const pmap = new Map<string, Tables<'products'>>()
  for (const p of products || []) pmap.set(p.id, p as Tables<'products'>)

  const verified = items.map(it => {
    const p = pmap.get(it.id)
    if (!p) {
      warnings.push(`Product ${it.id} missing; excluding.`)
      return { ...it, price: 0, quantity: 0 }
    }
    if (!p.in_stock) warnings.push(`Product ${it.id} out of stock.`)
    if (p.price !== it.price) warnings.push(`Price mismatch for ${it.id}; using authoritative price.`)
    return { ...it, price: p.price }
  }).filter(v => v.quantity > 0)

  return { verified, warnings }
}

export function computeTotals(
  items: CheckoutItem[],
  currency = 'EUR'
): { subtotal: number; discounts: number; total: number } {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  // Placeholder discount logic
  let discounts = 0
  if (subtotal >= 100) discounts = 10
  else if (subtotal >= 50) discounts = 5
  const total = Math.max(0, subtotal - discounts)
  return { subtotal, discounts, total }
}

export async function prepareCheckout(
  userId: string,
  selectedIds: string[] | null,
  cartItems: CartItem[],
  client: any
): Promise<PreparedCheckout> {
  const effective = (selectedIds && selectedIds.length > 0)
    ? cartItems.filter(ci => selectedIds.includes(ci.id))
    : cartItems

  const base: CheckoutItem[] = effective.map(ci => ({
    id: ci.id,
    name: ci.name,
    price: ci.price,
    quantity: ci.quantity,
  }))

  const { verified, warnings } = await verifyProducts(client, base)
  const { subtotal, discounts, total } = computeTotals(verified)

  return {
    userId,
    items: verified,
    currency: 'EUR',
    subtotal,
    discounts,
    total,
    warnings,
  }
}

// Creates a draft order (placeholder table schema assumptions)
export async function createOrderDraft(
  prepared: PreparedCheckout,
  client: any
): Promise<OrderDraft> {
  const { data, error } = await client
    .from('orders')
    .insert({
      user_id: prepared.userId,
      total_amount: prepared.total,
      subtotal: prepared.subtotal,
      discount_amount: prepared.discounts,
      currency: prepared.currency,
      status: 'draft',
    })
    .select('id, user_id, total_amount, currency, status')
    .single()
  if (error) throw error

  // Insert order_items
  const orderId = data.id
  if (prepared.items.length) {
    const rows = prepared.items.map(it => ({
      order_id: orderId,
      product_id: it.id,
      quantity: it.quantity,
      unit_price: it.price,
      total_price: it.price * it.quantity,
      product_name: it.name,
      discount_amount: 0,
    }))
    const { error: oiErr } = await client.from('order_items').insert(rows)
    if (oiErr) throw oiErr
  }

  return {
    orderId,
    userId: prepared.userId,
    items: prepared.items,
    total: prepared.total,
    currency: prepared.currency,
    status: 'draft',
  }
}

// Calls Edge Function to create Stripe payment intent (server secret side)
export async function createPaymentIntent(
  order: OrderDraft,
  client: any
): Promise<PaymentIntentResult> {
  // Supabase Edge Function call (adjust URL / function name if different)
  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL || ''}/create_payment_intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      orderId: order.orderId,
      amount: Math.round(order.total * 100), // convert to cents
      currency: order.currency,
    }),
  })
  if (!res.ok) throw new Error(`Payment intent failed: ${res.status}`)
  const json = await res.json()
  if (!json.clientSecret) throw new Error('Missing clientSecret in response')
  return { clientSecret: json.clientSecret, paymentIntentId: json.paymentIntentId }
}

// Finalize order after successful payment
export async function finalizeOrder(
  orderId: string,
  client: any,
  paymentIntentId: string
): Promise<void> {
  const { error } = await client
    .from('orders')
    .update({ status: 'confirmed', payment_status: 'paid', payment_intent_id: paymentIntentId })
    .eq('id', orderId)
  if (error) throw error
}

// Orchestrated high-level flow
export async function fullCheckoutFlow(
  userId: string,
  selectedIds: string[] | null,
  cartItems: CartItem[],
  client: any
): Promise<{ clientSecret: string; orderId: string }> {
  const prepared = await prepareCheckout(userId, selectedIds, cartItems, client)
  const draft = await createOrderDraft(prepared, client)
  const payment = await createPaymentIntent(draft, client)
  // Persist payment intent id immediately with pending payment_status
  await client
    .from('orders')
    .update({ payment_intent_id: payment.paymentIntentId, payment_status: 'pending' })
    .eq('id', draft.orderId)
  // Returning clientSecret so UI can confirm payment
  return { clientSecret: payment.clientSecret, orderId: draft.orderId }
}

// NOTE: After payment confirmation on client, call finalizeOrder(orderId, client, paymentIntentId)
