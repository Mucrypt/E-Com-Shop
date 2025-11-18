-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);

-- Allow users to select their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert their own favorites
CREATE POLICY "Users can add to their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own favorites
CREATE POLICY "Users can update their own favorites"
  ON favorites
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  USING (user_id = auth.uid());
