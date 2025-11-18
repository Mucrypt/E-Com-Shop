-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-- Allow users to select their own cart
CREATE POLICY "Users can view their own cart"
  ON cart
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert their own cart
CREATE POLICY "Users can create their own cart"
  ON cart
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own cart
CREATE POLICY "Users can update their own cart"
  ON cart
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own cart
CREATE POLICY "Users can delete their own cart"
  ON cart
  FOR DELETE
  USING (user_id = auth.uid());
