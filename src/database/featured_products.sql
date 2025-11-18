-- Featured Products Table
CREATE TABLE IF NOT EXISTS featured_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_featured_products_product_id ON featured_products(product_id);

-- Enable RLS
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view featured products"
  ON featured_products
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Admins can insert featured products"
  ON featured_products
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update featured products"
  ON featured_products
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can delete featured products"
  ON featured_products
  FOR DELETE
  USING (auth.role() = 'service_role');