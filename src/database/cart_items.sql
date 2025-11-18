-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1,
    price numeric NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Allow users to select their own cart items
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert cart items for their own cart
CREATE POLICY "Users can add items to their own cart"
  ON cart_items
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own cart items
CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own cart items
CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  USING (user_id = auth.uid());
