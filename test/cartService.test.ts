import { fetchCartWithProducts, buildUpsertRows, upsertSelectedCartItems } from '../src/services/cartService'

// Minimal mock types
type Row = any

// Mock Supabase client
function createMockClient({ cart, products }: { cart: Row[]; products: Row[] }) {
  return {
    from(table: string) {
      return {
        select() {
          return {
            eq(col: string, val: string) {
              if (table === 'cart_items' && col === 'user_id') {
                return Promise.resolve({ data: cart.filter((r) => r.user_id === val), error: null })
              }
              return Promise.resolve({ data: [], error: null })
            },
            in(col: string, ids: string[]) {
              if (table === 'products' && col === 'id') {
                return Promise.resolve({ data: products.filter((p) => ids.includes(p.id)), error: null })
              }
              return Promise.resolve({ data: [], error: null })
            },
          }
        },
        upsert(rows: Row[]) {
          ;(createMockClient as any).lastUpsert = { table, rows }
          return Promise.resolve({ data: rows, error: null })
        },
      }
    },
  } as any
}

async function run() {
  const userId = 'user-1'
  const cart = [
    { user_id: userId, product_id: 'p1', quantity: 2, price: 10 },
    { user_id: userId, product_id: 'p2', quantity: 1, price: 20 },
  ]
  const products = [
    { id: 'p1', name: 'Prod 1', price: 11, original_price: 15, image_url: 'img1', in_stock: true, rating: 4.5 },
    { id: 'p2', name: 'Prod 2', price: 22, original_price: 30, image_url: 'img2', in_stock: true, rating: 4.2 },
  ]

  const client = createMockClient({ cart, products })

  // Test hydration
  const hydrated = await fetchCartWithProducts(userId, client)
  console.assert(hydrated.length === 2, 'Hydrated length should be 2')
  console.assert(hydrated[0].name === 'Prod 1', 'Hydrated name mismatch')
  console.assert(hydrated[0].image === 'img1', 'Hydrated image mismatch')

  // Test buildUpsertRows
  const rows = buildUpsertRows(userId, hydrated, ['p2'])
  console.assert(rows.length === 1 && rows[0].product_id === 'p2', 'Subset upsert rows should include only p2')

  // Test upsertSelectedCartItems
  await upsertSelectedCartItems(userId, hydrated, ['p1'], client)
  const last = (createMockClient as any).lastUpsert
  console.assert(last && last.table === 'cart_items', 'Upsert should target cart_items')
  console.assert(last.rows.length === 1 && last.rows[0].product_id === 'p1', 'Upsert rows should include only p1')

  console.log('cartService tests passed')
}

run().catch((e) => {
  console.error('cartService tests failed', e)
  process.exit(1)
})
