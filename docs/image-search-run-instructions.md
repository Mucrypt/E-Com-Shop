# Image Search Deployment & Run Instructions

## 1. Prerequisites
- Supabase project with pgvector extension enabled:
```sql
create extension if not exists vector;
```
- Edge Functions CLI installed (`npm i -g supabase` or use npx).
- Environment variables locally: `SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Apply Schema
Ensure `product_embeddings.sql` is included in migrations or run manually:
```bash
supabase db push
```
Verify:
```sql
select extname from pg_extension where extname='vector';
select count(*) from product_embeddings;
```

## 3. Deploy Edge Functions
```bash
supabase functions deploy image_classify
supabase functions deploy image_embed
supabase functions deploy image_search
```
Test locally before deploy:
```bash
supabase functions serve image_classify
curl -X POST -H 'Content-Type: application/json' -d '{"imageUrl":"https://example.com/test-shoe.jpg"}' http://localhost:54321/functions/v1/image_classify
```

## 4. Configure Storage Bucket
Create bucket `visual-search` (public)
In Supabase dashboard: Storage -> New Bucket -> Name: `visual-search` (public read). Optionally add policy limiting uploads to authenticated users.

## 5. Run Backfill Script
Install any needed dev deps (ts-node already if using). Execute:
```bash
MODEL=mock-hash-v1 PROVIDER=mock SUPABASE_URL=YOUR_URL SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY \
  ts-node scripts/backfill-product-embeddings.ts
```
Progress logs every ~25 items. Re-run with different model names to layer multi-model embeddings.

## 6. Validate Search
Call embedding + search functions manually:
```bash
curl -X POST -H 'apikey: $SUPABASE_SERVICE_ROLE_KEY' -H 'Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"imageUrl":"https://picsum.photos/seed/validation/512/512"}' \
  $SUPABASE_URL/functions/v1/image_embed | jq '.embedding | length'

# Use first embedding array (truncated for demo)
curl -X POST -H 'Content-Type: application/json' \
  -d '{"embedding":[0.01,0.02,0.03]}' \
  $SUPABASE_URL/functions/v1/image_search
```

## 7. Client Integration
`FloatingSearchBar` camera icon triggers `visualSearchPipeline()`. Loading spinner shown during pipeline. Results appear under "Visual Matches".

## 8. Performance Tuning
- After large backfill: `ANALYZE product_embeddings;`
- Add ivfflat index (uncomment in SQL) when row count > 1k. Re-index after each big batch: `REINDEX INDEX product_embeddings_embedding_ivfflat_idx;`

## 9. Caching Strategy (High-Level)
- Short-term: CDN cache uploaded images; rely on deterministic embedding to skip recompute.
- Mid-term: Store recent query embeddings + top product IDs in Redis/Edge KV keyed by hash(image bytes).
- Long-term: Introduce LRU for low-frequency items, pre-warm popular embeddings at startup.

## 10. Rollback & Safety
To remove all embeddings for a model:
```sql
delete from product_embeddings where model='mock-hash-v1';
```
Always test in staging before production.

## 11. Next Upgrades
- Replace mock functions with provider calls (OpenCLIP, Replicate, custom inference).
- Add re-ranking RPC with hybrid scoring.
- Personalize by merging user affinity features.

## 12. Provider Integration Checklist (Future)

When you are ready to move to a production-grade model:

1. Pick providers
  - Classifier: OpenAI Vision / Replicate CLIP / Google Vision.
  - Embeddings: OpenCLIP (via Replicate or custom infra) / OpenAI image embeddings.

2. Add env vars
  - `VISION_API_BASE_URL`, `VISION_API_KEY`, `VISION_MODEL_ID`.
  - `EMBEDDING_API_BASE_URL`, `EMBEDDING_API_KEY`, `EMBEDDING_MODEL_ID`.

3. Update edge functions (no client changes)
  - `supabase/functions/image_classify/index.ts`: call the external API, map its response to `{ labels, topLabel }`.
  - `supabase/functions/image_embed/index.ts`: call embedding API, ensure embedding length matches your `vector(dim)`, return `{ embedding, provider, model }`.

4. Re‑deploy
  ```bash
  supabase functions deploy image_classify
  supabase functions deploy image_embed
  ```

## 13. Re‑Ranking & Personalization Checklist

1. Create a Postgres function (example name: `visual_re_rank`):
  - Input: `user_id uuid`, `matches jsonb` (array of `{ product_id, similarity }`).
  - Output: sorted matches with `final_score`.

2. Combine features in SQL
  - Similarity (from vector search).
  - Popularity (sales/clicks).
  - Margin, recency, user affinity (from events/favorites).

3. Update client pipeline
  - Step 1: call `image_search` to get initial matches.
  - Step 2: call `visual_re_rank` and show that order in the UI.

4. Log & tune
  - Log feature values and final_score for offline analysis.
  - Adjust coefficients and test via A/B or controlled rollouts.

## 14. Cache / KV Layer Checklist

1. Choose a backend
  - Upstash Redis, Cloudflare KV, Vercel KV, or any managed Redis.

2. Define cache keys
  - `vs:img:sha256:<hash>` → `{ embedding, topProductIds[], created_at }`.

3. Integrate in edge functions
  - In `image_embed`: compute hash of the image bytes/URL, check cache before calling provider.
  - On miss: call provider, store result with TTL (e.g. 24h).

4. Env vars
  - `CACHE_URL`, `CACHE_TOKEN`, `CACHE_TTL_SECONDS` (and provider-specific configs).

5. Observability
  - Track hit/miss ratio and impact on latency and cost.

---
This runbook ensures rapid deployment & iteration of the visual search stack.
