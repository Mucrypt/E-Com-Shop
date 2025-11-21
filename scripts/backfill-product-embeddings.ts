#!/usr/bin/env ts-node
/**
 * Backfill product embeddings.
 * Usage:
 *  MODEL=mock-hash-v1 PROVIDER=mock ts-node scripts/backfill-product-embeddings.ts
 * Or:
 *  MODEL=clip-vit-large PROVIDER=openclip BATCH=10 ts-node scripts/backfill-product-embeddings.ts
 *
 * Required env:
 *  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const MODEL = process.env.MODEL || 'mock-hash-v1'
const PROVIDER = process.env.PROVIDER || 'mock'
const BATCH = parseInt(process.env.BATCH || '6', 10)
const LIMIT = parseInt(process.env.LIMIT || '5000', 10)

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.')
  process.exit(1)
}

interface Product { id: string; name: string; image_url: string | null }

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text.slice(0,300)}`)
  }
  return res.json()
}

async function fetchProducts(): Promise<Product[]> {
  // Simple fetch; for large catalogs paginate.
  const params = new URLSearchParams({ select: 'id,name,image_url', limit: String(LIMIT) })
  return fetchJson(`${SUPABASE_URL}/rest/v1/products?${params.toString()}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
}

async function fetchExistingEmbeddings(): Promise<Set<string>> {
  const params = new URLSearchParams({ select: 'product_id', model: `eq.${MODEL}`, limit: String(LIMIT) })
  const rows = await fetchJson(`${SUPABASE_URL}/rest/v1/product_embeddings?${params.toString()}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  })
  return new Set(rows.map((r: any) => r.product_id))
}

async function embedImage(imageUrl: string, productId: string): Promise<number[]> {
  // Call edge function (replace with real embedding later)
  const res = await fetch(`${SUPABASE_URL}/functions/v1/image_embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({ imageUrl }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Embedding failed for ${productId}: ${text}`)
  }
  const data = await res.json()
  return data.embedding
}

async function insertEmbedding(productId: string, embedding: number[]): Promise<void> {
  const body = { product_id: productId, embedding, provider: PROVIDER, model: MODEL }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Insert failed for ${productId}: ${text}`)
  }
}

async function worker(products: Product[]) {
  let completed = 0
  for (const chunk of chunkArray(products, BATCH)) {
    await Promise.all(chunk.map(async (p) => {
      const img = p.image_url || `https://picsum.photos/seed/${p.id}/512/512`
      try {
        const embedding = await embedImage(img, p.id)
        await insertEmbedding(p.id, embedding)
        completed++
        if (completed % 25 === 0) {
          console.log(`Progress: ${completed}/${products.length}`)
        }
      } catch (e: any) {
        console.warn(`Skipped ${p.id}: ${e.message}`)
      }
    }))
  }
  return completed
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function main() {
  console.log(`Starting backfill MODEL=${MODEL} PROVIDER=${PROVIDER}`)
  const products = await fetchProducts()
  const existing = await fetchExistingEmbeddings()
  const toProcess = products.filter(p => !existing.has(p.id))
  console.log(`Total products: ${products.length}. Missing embeddings: ${toProcess.length}. Batch size: ${BATCH}`)
  if (toProcess.length === 0) {
    console.log('No missing embeddings. Done.')
    return
  }
  const start = Date.now()
  const done = await worker(toProcess)
  const ms = Date.now() - start
  console.log(`Inserted embeddings for ${done} products in ${(ms/1000).toFixed(1)}s`)   
}

main().catch(e => { console.error(e); process.exit(1) })
