import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../providers/auth-provider'
import { useCartStore } from '../store'
import { getHydratedCart, upsertCartItems } from '../services/cartService'

// Simple UUID test (v4 style) – adjust if product ids differ
const isUUID = (id: string) => /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(id)

export function useCartSync() {
  const { user, isAuthenticated } = useAuth()
  const cartItems = useCartStore((s) => s.cartItems)
  const setCartItems = useCartStore((s) => s.setCartItems)
  const lastPushRef = useRef<number>(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load cart from backend when user authenticates
  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || !user) return
      try {
        const items = await getHydratedCart(user.id, supabase)
        setCartItems(items)
      } catch (e: any) {
        console.warn('Cart load error', e?.message || String(e))
      }
    }
    load()
  }, [isAuthenticated, user, setCartItems])

  // Debounced push of cart changes
  useEffect(() => {
    if (!isAuthenticated || !user) return
    const now = Date.now()
    // Skip immediate push if loaded just now (<1s)
    if (now - lastPushRef.current < 500) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const rows = cartItems.filter((i) => isUUID(i.id))
      if (!rows.length) return
      try {
        await upsertCartItems(user.id, rows, supabase)
        lastPushRef.current = Date.now()
      } catch (e: any) {
        console.warn('Cart sync error', e?.message || String(e))
      }
    }, 900)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [cartItems, isAuthenticated, user])
}

export default useCartSync