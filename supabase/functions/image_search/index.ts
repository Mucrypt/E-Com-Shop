// Deno edge function: image_search
// POST { embedding: number[], topK?: number }
// Performs cosine similarity search over product_embeddings -> joins products.

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

interface RequestBody { embedding?: number[]; topK?: number }

// Minimal Supabase client (service key expected in env - DO NOT expose publicly)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY')

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  try {
    const body: RequestBody = await req.json()
    if (!body.embedding) {
      return new Response(JSON.stringify({ error: 'embedding required' }), { status: 400 })
    }
    const topK = body.topK ?? 12

    // Build RPC or SQL query via /rest/v1/rpc if you add a function.
    // For scaffold, we do a raw SQL via PostgREST single request (not ideal for production).

    const sql = `
      with query as (
        select id as product_id, name, image_url, price,
          (embedding <#> (vector[${body.embedding.slice(0,1536).join(',')}])) * -1 as cosine_similarity
        from product_embeddings pe
        join products p on p.id = pe.product_id
        order by cosine_similarity desc
        limit ${topK}
      ) select * from query;
    `

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql })
    })

    if (!resp.ok) {
      const text = await resp.text()
      return new Response(JSON.stringify({ error: 'search failed', details: text }), { status: resp.status })
    }

    const matches = await resp.json()

    return new Response(JSON.stringify({ matches }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON', details: String(e) }), { status: 400 })
  }
})
