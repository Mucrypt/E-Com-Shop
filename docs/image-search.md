# Visual Image Search Pipeline

This document describes the scaffolded advanced visual search pipeline intended to exceed baseline e‑commerce implementations ("more powerful than Amazon" target). It is modular so individual stages can be upgraded independently (classification, embedding, vector similarity, re‑ranking, personalization).

## High-Level Flow
1. Pick image (Expo ImagePicker) -> optional compression (Manipulator) -> upload to Supabase Storage bucket `visual-search`.
2. Edge Function `image_classify` generates coarse labels (replace mock with real model; e.g. AWS Rekognition, Google Vision, OpenAI, custom fine-tuned CLIP/ImageNet model).
3. Edge Function `image_embed` produces high dimensional embedding (1536 dims scaffold). Replace with:
   - OpenAI CLIP / Multimodal
   - Replicate (e.g. `clip-vit-large-patch14`) / private inference endpoint
   - Self-hosted OpenClip with product-specific finetuning
4. Persist embeddings for catalog in `product_embeddings` (pgvector) with IVF/HNSW indexes for scalable similarity.
5. Edge Function `image_search` performs vector similarity (cosine) returning candidate products.
6. Optional fallback keyword search if embedding stage fails or low confidence.
7. Client merges results and displays preview; later can do re‑ranking.

## Future Enhancements
- Multi-vector ensemble: color histogram + deep embedding + text embedding from description combined via weighted scoring.
- Hierarchical classification: refine coarse to fine-grained (e.g. shoe -> running shoe -> breathable mesh) for better narrowing.
- Personalization: blend similarity score with user affinity (past purchases, clicks, categories).
- Price or availability filters integrated server-side to avoid post-filter mismatch.
- Re-ranking via learning-to-rank model (LambdaMART / XGBoost) using features: similarity, popularity, CTR, margin, inventory.
- Incremental indexing: trigger embedding generation on product insert/update via Postgres function + queue.
- Vector caching: store frequently queried embeddings (and resultant product IDs) in edge KV or Redis to reduce cost.
- Batch inference: group embedding calls to external provider to amortize latency.
- Metadata filtering: add WHERE conditions pre-similarity (e.g. gender='women', season='winter').
- Hard negative mining + fine-tuning with click logs to optimize discriminative power.

## Security & Cost Considerations
- Keep service role secrets only in Edge Function environment (never shipped to client).
- Enforce RLS on `product_embeddings`; only allow SELECT for authenticated users.
- Signed URLs for original images + on-the-fly resized thumbnails to reduce bandwidth.
- Rate limit visual searches per user/IP to mitigate abuse.
- Consider local hashing fallback if external embedding provider outage occurs.

## Data Structures
### `product_embeddings`
- `product_id` FK -> `products`
- `embedding vector(1536)` (adjust dimensionality based on model)
- Unique index on `(product_id, model)` to allow multiple models.
- IVF/HNSW index for approximate nearest neighbor at scale.

## Edge Functions (Scaffold)
- `image_classify`: returns mock labels; replace logic with real classifier.
- `image_embed`: returns deterministic pseudo embedding; replace with provider call.
- `image_search`: raw SQL hitting pgvector; consider RPC wrapper and controlled similarity function with guardrails.

## Client Service (`imageSearchService.ts`)
- Provides `visualSearchPipeline()` orchestrating pick -> upload -> classify -> embed -> search.
- Implements fallback text search against products.
- Extend with parallelization (classify & embed concurrently) and confidence threshold checks.

## Performance Optimization Ideas
- Pre-generate multiple resolution variants; pass smaller version to embedding model.
- Use streaming classification; show preliminary matches while deep embedding computes.
- Warm vector indices by running an ANALYZE after large batch inserts.
- Maintain secondary table for popularity metrics to compute hybrid score inside SQL.

## Re-Ranking Strategy (Example Formula)
```
final_score = (0.55 * similarity) + (0.15 * normalized_popularity) + (0.10 * margin_score) + (0.10 * user_affinity) + (0.10 * recency_boost)
```
Adjust coefficients via offline experimentation (A/B tests).

## Backfilling Embeddings (Next Step)
Create a script to:
1. Fetch all products lacking embedding.
2. Batch call embedding function (or direct provider API).
3. Insert rows with provider + model tags.
4. Refresh vector index + ANALYZE.

## Testing Strategy
- Unit test classification parsing (topLabel selection).
- Snapshot similarity results for known query images.
- Latency benchmarks for end-to-end pipeline (<1500ms target initial, <700ms optimized).
- Load test search edge function with synthetic embedding payloads.

## Observability
- Add structured logs in edge functions (request_id, timing, provider status).
- Emit metrics to dashboard (Prometheus / Supabase logs) for: classification latency, embedding latency, search latency, result count.

## Fallback Hierarchy
1. Vector similarity success -> display matches.
2. Embedding failure -> keyword search from classification.
3. Classification failure -> generic popular products.

## Roadmap Summary
Short term: Replace mock with real classifier + embedding, add indexing script.
Mid term: Personalization & multi-source re-ranking.
Long term: Active learning & on-device prefiltering.

---
Scaffold complete. Upgrade each stage independently without changing client API.

## Caching & CDN Strategy (Added)
Level 1 (Now): Public bucket + deterministic compressed JPEG -> avoids duplicate uploads for identical selections when hashed client-side.
Level 2 (Soon): Maintain an edge key-value store mapping SHA256(image_bytes) -> { embedding, topProductIds[], created_at }. Reuse within TTL (e.g. 24h).
Level 3 (Advanced): Multi-tier cache; hot embeddings in memory (Redis), warm in vector DB, cold recompute. Incorporate invalidation on product updates (price, availability) via trigger sending invalidation event.

## Run Instructions Quick Start (Summary)
1. Ensure pgvector extension & `product_embeddings` table (`supabase db push`).
2. Deploy edge functions: `supabase functions deploy image_classify image_embed image_search`.
3. Create public storage bucket `visual-search`.
4. Backfill embeddings: `MODEL=mock-hash-v1 PROVIDER=mock ts-node scripts/backfill-product-embeddings.ts`.
5. Use camera icon in shop screen to test pipeline.
Full detailed runbook: see `docs/image-search-run-instructions.md`.

## Upgrading to Real Vision & Embedding Providers (Future)

The current implementation uses mock classifiers/embeddings so the client API and database schema are stable. To upgrade:

1. **Choose Providers**
   - Classifier: OpenAI Vision, Replicate CLIP, or Google Vision.
   - Embedding: OpenCLIP/Replicate, OpenAI image embeddings (when available), or a custom model.

2. **Configure Environment Variables** (examples)
   - `VISION_API_BASE_URL`
   - `VISION_API_KEY`
   - `VISION_MODEL_ID` (e.g. `clip-vit-large-patch14`)
   - `EMBEDDING_API_BASE_URL`
   - `EMBEDDING_API_KEY`
   - `EMBEDDING_MODEL_ID`

3. **Swap Edge Function Internals**
   - `image_classify`: call the vision API with the uploaded image URL; map the provider’s response to `ImageClassificationResult` (labels, confidences, optional boxes).
   - `image_embed`: call the embedding API; validate the embedding length; persist `provider` + `model` in `product_embeddings` with the correct `vector(dim)`.

Client code (`visualSearchPipeline`) and the `product_embeddings` schema do not need to change—only the edge functions and env vars.

## Re‑Ranking & Personalization (Design)

To go beyond plain similarity, introduce a Postgres function, for example `visual_re_rank(user_id uuid, matches jsonb)`, where `matches` is an array of `{ product_id, similarity }` from the vector search.

Inside the function:

- Join against `products`, `orders`, favorites, and optional analytics views.
- Compute features:
  - `similarity`: input from vector search.
  - `normalized_popularity`: derived from sales/clicks.
  - `margin_score`: from `price - cost_price` (higher margin gets a small boost).
  - `recency_boost`: newer or recently updated products.
  - `user_affinity`: based on past user events (views, favorites, purchases) for related categories/brands.

Example scoring formula:

```sql
final_score =
  0.55 * similarity +
  0.15 * normalized_popularity +
  0.10 * margin_score +
  0.10 * user_affinity +
  0.10 * recency_boost;
```

The RPC would return the same products sorted by `final_score`. The client pipeline becomes:

1. Vector search (`image_search`) → top N candidate products + similarity.
2. Call `visual_re_rank(user_id, candidates)`.
3. Display the re‑ranked list in the "Visual Matches" section.

### Personalization Signals

Maintain light‑weight tables/views such as:

- `user_product_events(user_id, product_id, event_type, weight, created_at)`.
- Aggregated `user_category_affinity` and `user_brand_affinity` views.

Use these in `visual_re_rank` to compute `user_affinity`. Ensure you:

- Allow users to opt out via a flag in `users.preferences`.
- Keep PII out of analytics where possible.
