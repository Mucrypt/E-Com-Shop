// useFeaturedProductsFromJoin.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Tables } from '../../types/database.types'

type FeaturedWithProduct = {
  id: string
  sort_order: number
  product: Tables<'products'>
}

/**
 * Custom React Query hook to fetch featured products with their associated product data.
 *
 * This hook performs the following steps:
 * 1. Retrieves rows from the `featured_products` table, ordered by `sort_order` and limited by the provided `limit`.
 * 2. Fetches the corresponding product details from the `products` table in a single query, filtering by active products.
 * 3. Maps the featured products to their product data, preserving the original order and filtering out any missing products.
 *
 * @param {number} [limit=10] - The maximum number of featured products to fetch.
 * @returns {UseQueryResult<FeaturedWithProduct[]>} - A React Query result containing an array of featured products with their associated product data.
 *
 * @throws {Error} If there is an error fetching data from Supabase.
 */
export const useFeaturedProductsViaJoin = (limit = 10) => {
  return useQuery({
    queryKey: ['featured-products', { limit }],
    queryFn: async (): Promise<FeaturedWithProduct[]> => {
      // 1) Get featured rows ordered
      const { data: fp, error: fpErr } = await supabase
        .from('featured_products')
        .select('id, sort_order, product_id')
        .order('sort_order', { ascending: true })
        .limit(limit)

      if (fpErr) throw new Error(fpErr.message)
      if (!fp || fp.length === 0) return []

      const ids = fp
        .map((r) => r.product_id)
        .filter((id): id is string => typeof id === 'string')

      // 2) Pull products in one go
      const { data: prods, error: pErr } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)
        .eq('is_active', true)

      if (pErr) throw new Error(pErr.message)

      // 3) Map back to the fp order
      const byId = new Map(prods?.map((p) => [p.id, p]))
      return fp
        .map((r) => ({
          id: r.id as string,
          sort_order: r.sort_order as number,
          product: byId.get(
            typeof r.product_id === 'string' ? r.product_id : ''
          )!,
        }))
        .filter((x) => !!x.product)
    },
  })
}
