// useBanners.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Tables } from '../../types/database.types'

/**
 * Custom hook to fetch active banners from the Supabase database.
 *
 * Utilizes React Query's `useQuery` to retrieve banners where `is_active` is `true`,
 * ordered by `sort_order` in ascending order.
 *
 * @returns {UseQueryResult<Tables<'banners'>[], Error>} The query result containing an array of active banners.
 *
 * @throws {Error} If there is an error fetching banners from Supabase.
 */
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async (): Promise<Tables<'banners'>[]> => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw new Error(error.message)
      return data ?? []
    },
  })
}
