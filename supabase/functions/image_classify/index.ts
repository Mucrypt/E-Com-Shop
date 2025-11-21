// Deno edge function: image classification stub
// Receives JSON: { imageUrl: string }
// Returns classification labels (mock) - replace with real provider integration.

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

interface RequestBody { imageUrl?: string }

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  try {
    const body: RequestBody = await req.json()
    if (!body.imageUrl) {
      return new Response(JSON.stringify({ error: 'imageUrl required' }), { status: 400 })
    }

    // Mock classification logic: parse filename tokens
    const urlParts = body.imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1].toLowerCase()
    const guesses: string[] = []
    if (filename.includes('shoe')) guesses.push('shoe')
    if (filename.includes('dress')) guesses.push('dress')
    if (filename.includes('bag')) guesses.push('bag')
    if (guesses.length === 0) guesses.push('product')

    const labels = guesses.map((g, i) => ({ label: g, confidence: 0.8 - i * 0.1 }))

    return new Response(JSON.stringify({ labels, topLabel: labels[0] }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON', details: String(e) }), { status: 400 })
  }
})
