import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface OrderRow {
  id: string
  status: string | null
  payment_status: string | null
  payment_intent_id?: string | null
  total_amount?: number | null
}

const TERMINAL = ['paid', 'failed', 'amount_mismatch']

export default function useOrderStatusRealtime(orderId: string | null) {
  const [order, setOrder] = useState<OrderRow | null>(null)
  const [loading, setLoading] = useState<boolean>(!!orderId)
  const [error, setError] = useState<string | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!orderId) return
    let channel: ReturnType<typeof supabase.channel> | null = null
    let active = true

    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id,status,payment_status,payment_intent_id,total_amount')
          .eq('id', orderId)
          .single()
        if (error) setError(error.message)
        else if (data) {
          const mapped: OrderRow = {
            id: (data as any).id,
            status: (data as any).status ?? null,
            payment_status: (data as any).payment_status ?? null,
            payment_intent_id: (data as any).payment_intent_id ?? null,
            total_amount: (data as any).total_amount ?? null,
          }
            setOrder(mapped)
        }
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchInitial()

    channel = supabase
      .channel('order-status-' + orderId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: 'id=eq.' + orderId },
        (payload) => {
          if (!active) return
          const newRow = payload.new as any
          const next: OrderRow = {
            id: newRow.id,
            status: newRow.status ?? null,
            payment_status: newRow.payment_status ?? null,
            payment_intent_id: newRow.payment_intent_id ?? null,
            total_amount: newRow.total_amount ?? null,
          }
          setOrder(next)
          if (next.payment_status && TERMINAL.includes(next.payment_status)) {
            doneRef.current = true
            channel?.unsubscribe()
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') setError('Realtime channel error')
      })

    return () => {
      active = false
      channel?.unsubscribe()
    }
  }, [orderId])

  return {
    order,
    loading,
    error,
    done: doneRef.current,
    paymentStatus: order?.payment_status || null,
    status: order?.status || null,
  }
}
