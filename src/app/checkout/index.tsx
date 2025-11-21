import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useCartStore } from '../../store'
import { useAuth } from '../../providers/auth-provider'
import { upsertSelectedCartItems } from '../../services/cartService'
import { fullCheckoutFlow } from '../../services/checkoutService'
// Optional Stripe RN integration (fallback if lib missing)
let useStripe: any
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useStripe = require('@stripe/stripe-react-native').useStripe
} catch {
  useStripe = null
}
import { supabase } from '../../lib/supabase'
import useOrderStatus from '../../hooks/useOrderStatus'
import useOrderStatusRealtime from '../../hooks/useOrderStatusRealtime'

function StripeConfirmButton({ clientSecret, orderId, confirming, setConfirming, setErrorMsg, onConfirmed }: any) {
  const stripe = useStripe?.()
  if (!stripe) return null
  return (
    <TouchableOpacity
      style={[styles.payBtn, { marginTop: 12, backgroundColor: '#0a5' }]}
      disabled={confirming}
      onPress={async () => {
        if (!clientSecret || !orderId) return
        try {
          setConfirming(true)
          setErrorMsg(null)
          const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
            paymentMethodType: 'Card'
          })
          if (error) {
            setErrorMsg(error.message || 'Stripe confirmation failed')
            return
          }
          if (paymentIntent?.status === 'Succeeded' || paymentIntent?.status === 'succeeded') {
            // Webhook will finalize the order; just notify client
            if (onConfirmed) onConfirmed(paymentIntent.id)
          } else {
            setErrorMsg('Payment not successful')
          }
        } catch (e) {
          setErrorMsg((e as any)?.message || 'Confirmation error')
        } finally {
          setConfirming(false)
        }
      }}
    >
      {confirming ? <ActivityIndicator color="#fff" /> : <Text style={styles.payBtnText}>Confirm Payment</Text>}
    </TouchableOpacity>
  )
}

export default function CheckoutScreen() {
  const { items } = useLocalSearchParams<{ items?: string }>()
  const { isAuthenticated } = useAuth()
  const cartItems = useCartStore((s) => s.cartItems)
  const getSelectedItemsTotal = useCartStore((s) => s.getSelectedItemsTotal)

  const selectedIds = useMemo(() => (items ? items.split(',').filter(Boolean) : cartItems.map(i => i.id)), [items, cartItems])
  const total = getSelectedItemsTotal(selectedIds)

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [infoMsg, setInfoMsg] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)

  // Flush selected items to backend immediately
  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated) return
        const minimal = cartItems
          .filter((i) => selectedIds.includes(i.id))
          .map((i) => ({ id: i.id, price: i.price, quantity: i.quantity }))
        // @ts-ignore user is defined when isAuthenticated is true
        await upsertSelectedCartItems((user as any).id, minimal, selectedIds, supabase)
      } catch (e) {
        console.warn('Checkout flush failed', (e as any)?.message)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.title}>Sign in required</Text>
        <Text style={styles.subtitle}>Please sign in to complete checkout.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/auth')}>
          <Text style={styles.primaryBtnText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const polling = useOrderStatus(orderId)
  const realtime = useOrderStatusRealtime(orderId)

  const effectiveStatus = realtime.order || polling.order
  const paymentStatus = effectiveStatus?.payment_status
  const statusDone = realtime.done || polling.done

  // Toast-like reactions on status transitions
  useEffect(() => {
    if (!paymentStatus) return
    if (paymentStatus === 'paid') {
      setInfoMsg('Payment confirmed. Order ready for fulfillment.')
      // Navigate to a success screen
      router.replace('/orders/success')
    } else if (paymentStatus === 'failed') {
      setInfoMsg('Payment failed. You can retry the payment.')
    } else if (paymentStatus === 'amount_mismatch') {
      setInfoMsg('Amount mismatch detected. Please contact support.')
    }
  }, [paymentStatus])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Checkout</Text>
      <Text style={styles.line}>Total: ${total.toFixed(2)}</Text>
      {!clientSecret && !orderId && (
        <TouchableOpacity
          style={styles.payBtn}
          disabled={loading}
          onPress={async () => {
            try {
              setLoading(true)
              setErrorMsg(null)
              setInfoMsg(null)
              const minimal = cartItems
                .filter((i) => selectedIds.includes(i.id))
                .map((i) => ({ id: i.id, price: i.price, quantity: i.quantity }))
              // @ts-ignore user is defined when isAuthenticated is true
              await upsertSelectedCartItems((user as any).id, minimal, selectedIds, supabase)
              // @ts-ignore user is defined when isAuthenticated is true
              const flow = await fullCheckoutFlow((user as any).id, selectedIds, cartItems, supabase)
              setClientSecret(flow.clientSecret)
              setOrderId(flow.orderId)
              setInfoMsg('Payment intent created. You can now confirm payment.')
            } catch (e) {
              setErrorMsg((e as any)?.message || 'Checkout failed')
            } finally {
              setLoading(false)
            }
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payBtnText}>Proceed to Payment</Text>}
        </TouchableOpacity>
      )}
      {clientSecret && orderId && (
        <View style={styles.intentBox}>
          <Text style={styles.intentText}>Order ID: {orderId}</Text>
          <Text style={styles.intentSub}>Client Secret (use with Stripe SDK):</Text>
          <Text style={styles.intentSecret}>{clientSecret}</Text>
          {useStripe ? (
            <StripeConfirmButton
              clientSecret={clientSecret}
              orderId={orderId}
              confirming={confirming}
              setConfirming={setConfirming}
              setErrorMsg={setErrorMsg}
              onConfirmed={() => {
                setInfoMsg('Payment initiated. Waiting for confirmation...')
              }}
            />
          ) : (
            <Text style={styles.intentSub}>Stripe SDK not available. Payment confirmation disabled in this build.</Text>
          )}
        </View>
      )}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {infoMsg && <Text style={styles.infoText}>{infoMsg}</Text>}
      {orderId && (
        <View style={styles.statusBox}>
          <Text style={styles.statusHeading}>Payment Status</Text>
          <Text style={styles.statusLine}>Current: {paymentStatus || 'pending'}</Text>
          {!statusDone && <Text style={styles.statusSub}>Awaiting final confirmation...</Text>}
          {statusDone && paymentStatus === 'paid' && <Text style={styles.statusSuccess}>Payment successful</Text>}
          {statusDone && paymentStatus === 'failed' && (
            <>
              <Text style={styles.statusFail}>Payment failed - retry</Text>
              <TouchableOpacity
                style={[styles.payBtn, { marginTop: 12 }]}
                disabled={retrying || loading}
                onPress={async () => {
                  try {
                    setRetrying(true)
                    setErrorMsg(null)
                    setInfoMsg(null)
                    // Re-run full checkout flow to get a new intent
                    const minimal = cartItems
                      .filter((i) => selectedIds.includes(i.id))
                      .map((i) => ({ id: i.id, price: i.price, quantity: i.quantity }))
                    // @ts-ignore user is defined when isAuthenticated is true
                    await upsertSelectedCartItems((user as any).id, minimal, selectedIds, supabase)
                    // @ts-ignore user is defined when isAuthenticated is true
                    const flow = await fullCheckoutFlow((user as any).id, selectedIds, cartItems, supabase)
                    setClientSecret(flow.clientSecret)
                    setOrderId(flow.orderId)
                    setInfoMsg('New payment intent created. Please confirm again.')
                  } catch (e) {
                    setErrorMsg((e as any)?.message || 'Retry failed')
                  } finally {
                    setRetrying(false)
                  }
                }}
              >
                {retrying ? <ActivityIndicator color="#fff" /> : <Text style={styles.payBtnText}>Retry Payment</Text>}
              </TouchableOpacity>
            </>
          )}
          {statusDone && paymentStatus === 'amount_mismatch' && (
            <Text style={styles.statusWarn}>Amount mismatch detected - contact support</Text>
          )}
        </View>
      )}
      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  line: {
    fontSize: 14,
    marginBottom: 8,
  },
  payBtn: {
    marginTop: 24,
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  intentBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
  },
  intentText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  intentSub: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  intentSecret: {
    fontSize: 12,
    color: '#222',
  },
  statusBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#eef2f5',
    borderRadius: 8,
  },
  statusHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusLine: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusSub: {
    fontSize: 11,
    color: '#666',
  },
  statusSuccess: {
    fontSize: 12,
    color: '#0a5',
    fontWeight: '600',
  },
  statusFail: {
    fontSize: 12,
    color: '#d30',
    fontWeight: '600',
  },
  statusWarn: {
    fontSize: 12,
    color: '#b8860b',
    fontWeight: '600',
  },
  infoText: {
    marginTop: 8,
    color: '#333',
    fontSize: 12,
  },
  errorText: {
    marginTop: 12,
    color: '#e0004d',
    fontSize: 12,
    fontWeight: '600',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    color: '#666',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
})