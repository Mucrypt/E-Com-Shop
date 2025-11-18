// server/featured.ts (Edge Function pseudo-code)
import { createClient } from '@supabase/supabase-js'

/**
 * Initializes a Supabase client instance using the provided environment variables.
 *
 * @remarks
 * The client is configured with the Supabase project URL and the service role key,
 * which grants elevated permissions for server-side operations.
 *
 * @see {@link https://supabase.com/docs/reference/javascript/initializing}
 */
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Inserts or updates a featured product entry in the 'featured_products' table.
 * If a product with the given `productId` already exists, its `sort_order` will be updated.
 * Otherwise, a new entry will be created.
 *
 * @param productId - The unique identifier of the product to feature.
 * @param sortOrder - The order in which the product should appear in the featured list (default is 0).
 * @throws Will throw an error if the upsert operation fails.
 */
export async function upsertFeatured(productId: string, sortOrder = 0) {
  const { error } = await supabase
    .from('featured_products')
    .upsert(
      { product_id: productId, sort_order: sortOrder },
      { onConflict: 'product_id' }
    )
  if (error) throw error
}

/**
 * Removes a product from the 'featured_products' table in the database.
 *
 * @param productId - The unique identifier of the product to be removed from featured products.
 * @throws Will throw an error if the deletion operation fails.
 */
export async function removeFeatured(productId: string) {
  const { error } = await supabase
    .from('featured_products')
    .delete()
    .eq('product_id', productId)
  if (error) throw error
}
