import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface OrderRow {
  id: string
  status: string | null
  payment_status: string | null
  payment_intent_id?: string | null
  total_amount?: number | null
}

interface UseOrderStatusOptions {
  intervalMs?: number
  stopOn?: string[] // payment_status values that end polling
  maxAttempts?: number
}

const DEFAULT_STOP = ['paid', 'failed', 'amount_mismatch']

export function useOrderStatus(orderId: string | null, opts: UseOrderStatusOptions = {}) {
  const { intervalMs = 2500, stopOn = DEFAULT_STOP, maxAttempts = 120 } = opts
  const [order, setOrder] = useState<OrderRow | null>(null)
  const [loading, setLoading] = useState<boolean>(!!orderId)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const timerRef = useRef<number | null>(null)

  const fetchOrder = async () => {
    if (!orderId) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('id,status,payment_status,total_amount')
        .eq('id', orderId)
        .single()
      if (error) {
        setError(error.message)
      } else {
        setOrder(data as OrderRow)
        setError(null)
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Manual refresh API
  const refresh = () => {
    setAttempts((a) => a + 1)
    fetchOrder()
  }

  useEffect(() => {
    if (!orderId) return
    // Initial fetch
    fetchOrder()
    // Polling loop
    timerRef.current = window.setInterval(() => {
      setAttempts((a) => a + 1)
      fetchOrder()
    }, intervalMs) as any
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [orderId, intervalMs])

  // Stop conditions
  useEffect(() => {
    if (!order) return
    if (order.payment_status && stopOn.includes(order.payment_status)) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    } else if (attempts >= maxAttempts) {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [order, attempts, stopOn, maxAttempts])

  return {
    order,
    loading,
    error,
    attempts,
    status: order?.status || null,
    paymentStatus: order?.payment_status || null,
    paymentIntentId: order?.payment_intent_id || null,
    refresh,
    done: !!(order?.payment_status && stopOn.includes(order.payment_status))
  }
}

export default useOrderStatus
