-- Enable pgvector (requires Superuser or extension privileges)
create extension if not exists vector;

-- Table to store embeddings for products
create table if not exists public.product_embeddings (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  embedding vector(1536) not null,
  provider text not null,
  model text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Unique index to avoid duplicate embeddings per product+model
create unique index if not exists product_embeddings_product_model_idx
  on public.product_embeddings (product_id, model);

-- IVF / HNSW index for faster similarity (choose one). Using ivfflat requires ANALYZE & list size tuning.
-- Uncomment after enough rows exist (>1000).
-- create index if not exists product_embeddings_embedding_ivfflat_idx
--   on public.product_embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Basic RLS policies (adjust as needed)
alter table public.product_embeddings enable row level security;

-- Allow read to authenticated users
create policy "Read product embeddings" on public.product_embeddings
  for select using (auth.role() = 'authenticated');

-- Allow insert/update only to service role via edge functions (restrict by auth.uid() = uuid_nil()) placeholder or use custom claim.
create policy "Service role manage embeddings" on public.product_embeddings
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
