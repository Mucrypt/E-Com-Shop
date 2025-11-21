import { Tables } from '../types/database.types'
import { CartItem as LocalCartItem } from '../store/cartStore'

type CartRow = Pick<Tables<'cart_items'>, 'product_id' | 'quantity' | 'price'>
type ProductRow = Tables<'products'>

export async function fetchCartWithProducts(
  userId: string,
  client: any
): Promise<LocalCartItem[]> {
  const { data: cartRows, error: cartErr } = await client
    .from('cart_items')
    .select('product_id, quantity, price')
    .eq('user_id', userId)

  if (cartErr) throw cartErr
  if (!cartRows || cartRows.length === 0) return []

  const ids = cartRows.map((r: CartRow) => r.product_id!).filter(Boolean)
  const { data: products, error: prodErr } = await client
    .from('products')
    .select(
      'id, name, price, original_price, image_url, images, in_stock, rating, category_id, categories(name)'
    )
    .in('id', ids)

  if (prodErr) throw prodErr
  const pmap = new Map<string, ProductRow>()
  for (const p of products || []) pmap.set(p.id, p as ProductRow)

  // Merge
  const merged: LocalCartItem[] = cartRows
    .map((row: CartRow) => {
      const p = row.product_id ? pmap.get(row.product_id) : undefined
      if (!p) return null
      // Prefer first image from images array if available
      const images = (p as any)?.images as any[] | undefined
      const primaryImage = Array.isArray(images) && images.length > 0 ? String(images[0]) : p.image_url || 'placeholder'
      const categoryName = (p as any)?.categories?.name as string | undefined

      const item: LocalCartItem = {
        id: p.id,
        name: p.name,
        price: Number(row.price ?? p.price ?? 0),
        originalPrice: Number(p.original_price ?? row.price ?? p.price ?? 0),
        quantity: row.quantity ?? 1,
        color: (p as any)?.options?.color || '—',
        size: (p as any)?.options?.size || '—',
        image: primaryImage,
        inStock: p.in_stock ?? true,
        category: categoryName || 'general',
        rating: Number(p.rating ?? 0),
        estimatedDelivery: '2-5 days',
      }
      return item
    })
    .filter(Boolean) as LocalCartItem[]

  return merged
}

// Prefer RPC if available: get_hydrated_cart(user_id uuid)
export async function getHydratedCart(
  userId: string,
  client: any
): Promise<LocalCartItem[]> {
  try {
    // Parameterless RPC variant using auth.uid() server-side
    const { data, error } = await client.rpc('get_hydrated_cart')
    if (error) throw error
    if (!data) return []
    return (data as any[]).map((d) => ({
      id: d.product_id,
      name: d.product_name,
      price: Number(d.price),
      originalPrice: Number(d.original_price ?? d.price),
      quantity: Number(d.quantity ?? 1),
      color: d.color || '—',
      size: d.size || '—',
      image: d.image || d.image_url || 'placeholder',
      inStock: Boolean(d.in_stock ?? true),
      category: d.category || d.category_name || 'general',
      rating: Number(d.rating ?? 0),
      estimatedDelivery: d.estimated_delivery || '2-5 days',
    })) as LocalCartItem[]
  } catch {
    // Fallback to client-side join if RPC not available
    return fetchCartWithProducts(userId, client)
  }
}

export function buildUpsertRows(
  userId: string,
  items: Pick<LocalCartItem, 'id' | 'price' | 'quantity'>[],
  subsetIds?: string[]
): (CartRow & { user_id: string })[] {
  const set = subsetIds ? new Set(subsetIds) : undefined
  return items
    .filter((i) => (set ? set.has(i.id) : true))
    .map((i) => ({
      user_id: userId,
      product_id: i.id,
      quantity: i.quantity,
      price: i.price,
    }))
}

export async function upsertCartItems(
  userId: string,
  items: Pick<LocalCartItem, 'id' | 'price' | 'quantity'>[],
  client: any
): Promise<void> {
  if (!items.length) return
  const rows = buildUpsertRows(userId, items)
  const { error } = await client.from('cart_items').upsert(rows, {
    onConflict: 'user_id,product_id',
    ignoreDuplicates: false,
  })
  if (error) throw error
}

export async function upsertSelectedCartItems(
  userId: string,
  allItems: Pick<LocalCartItem, 'id' | 'price' | 'quantity'>[],
  selectedIds: string[],
  client: any
): Promise<void> {
  const rows = buildUpsertRows(userId, allItems, selectedIds)
  if (!rows.length) return
  const { error } = await client.from('cart_items').upsert(rows, {
    onConflict: 'user_id,product_id',
    ignoreDuplicates: false,
  })
  if (error) throw error
}
