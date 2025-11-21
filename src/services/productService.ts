import { Tables } from '../types/database.types'

export type ProductRow = Tables<'products'> & { categories?: { name?: string } }

export async function fetchProductsByIds(
  ids: string[],
  client: any
): Promise<ProductRow[]> {
  if (!ids.length) return []
  const { data, error } = await client
    .from('products')
    .select('id, name, price, original_price, image_url, images, in_stock, rating, category_id, categories(name)')
    .in('id', ids)
  if (error) throw error
  return (data || []) as ProductRow[]
}
