-- Table: sort_options
-- Stores available sort options for category/product screens
CREATE TABLE IF NOT EXISTS sort_options (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default sort options
INSERT INTO sort_options (id, name, icon) VALUES
  ('featured', 'Featured', 'star'),
  ('newest', 'Newest First', 'clock-o'),
  ('price-low', 'Price: Low to High', 'sort-amount-asc'),
  ('price-high', 'Price: High to Low', 'sort-amount-desc'),
  ('rating', 'Customer Rating', 'star'),
  ('discount', 'Highest Discount', 'percent')
ON CONFLICT (id) DO NOTHING;
