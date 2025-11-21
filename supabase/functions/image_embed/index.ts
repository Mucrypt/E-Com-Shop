// Deno edge function: image embedding stub
// POST { imageUrl: string }
// Calls external vision embedding provider (placeholder) and returns vector.
// Replace fetchEmbedding with real API (e.g. OpenAI, Replicate, custom model).

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

interface RequestBody { imageUrl?: string }

async function fetchEmbedding(imageUrl: string): Promise<number[]> {
  // Mock embedding: hash chars to deterministic pseudo vector
  const dims = 1536
  const vec = new Array(dims).fill(0)
  for (let i = 0; i < imageUrl.length; i++) {
    const idx = i % dims
    vec[idx] += (imageUrl.charCodeAt(i) % 23) / 100
  }
  return vec
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  try {
    const body: RequestBody = await req.json()
    if (!body.imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl required' }), { status: 400 })
    }
    const started = performance.now()
    const embedding = await fetchEmbedding(body.imageUrl)
    const tookMs = performance.now() - started
    return new Response(JSON.stringify({ embedding, provider: 'mock', model: 'mock-hash-v1', dims: embedding.length, tookMs }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON', details: String(e) }), { status: 400 })
  }
})
