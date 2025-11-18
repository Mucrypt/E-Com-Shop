import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'


/**
 * Custom hook to add an item to the user's cart in the Supabase database.
 *
 * Uses React Query's `useMutation` to perform the insert operation and
 * invalidates the user's cart query on success to ensure fresh data.
 * @example
 * ```tsx
 * const addToCart = useAddToCart();
 * addToCart.mutate({ user_id: 'user123', product_id: 'prod456', quantity: 1, price: 9.99 });
 * ```
 * @returns A mutation object for adding a cart item.
 */
export const useAddToCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      user_id: string
      product_id: string
      quantity: number
      price: number
    }) => {
      const { data, error } = await supabase
        .from('cart_items')
        .insert(payload)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['user-cart', vars.user_id] })
    },
  })
}


/**
 * Custom hook to update the quantity of a cart item in the Supabase database.
 *
 * Uses React Query's `useMutation` to perform the update operation and
 * invalidates the user's cart query on success to ensure fresh data.
 * @example
 * ```tsx
 * const updateCartQty = useUpdateCartQty();
 * updateCartQty.mutate({ id: 'item123', user_id: 'user456', quantity: 2 });
 * @returns A mutation object for updating cart item quantity.
 * 
 */
export const useUpdateCartQty = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      user_id,
      quantity,
    }: {
      id: string
      user_id: string
      quantity: number
    }) => {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, vars) =>
      qc.invalidateQueries({ queryKey: ['user-cart', vars.user_id] }),
  })
}

/**
 * Custom hook to remove an item from the user's cart using Supabase and React Query.
 *
 * @returns A mutation object for removing a cart item.
 *
 * @remarks
 * - Uses `useMutation` from React Query to handle the deletion.
 * - On successful mutation, invalidates the user's cart query to refresh data.
 *
 * @example
 * ```tsx
 * const removeFromCart = useRemoveFromCart();
 * removeFromCart.mutate({ id: 'item123', user_id: 'user456' });
 * ```
 */
export const useRemoveFromCart = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      const { error } = await supabase.from('cart_items').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return true
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['user-cart', vars.user_id] }),
  })
}
