-- Sample Categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', '📱', '#3B82F6'),
('Clothing', 'clothing', 'Fashion and apparel', '👕', '#EF4444'),
('Books', 'books', 'Books and literature', '📚', '#10B981'),
('Home & Garden', 'home-garden', 'Home and garden essentials', '🏠', '#F59E0B'),
('Sports', 'sports', 'Sports and fitness equipment', '⚽', '#8B5CF6'),
('Beauty', 'beauty', 'Beauty and personal care', '💄', '#EC4899');

-- Sample Products
INSERT INTO products (name, slug, description, price, original_price, category_id, brand, sku, in_stock, stock_quantity, rating, review_count) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest Apple smartphone with advanced features', 999.99, 1099.99, 
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'IPH15-PRO-001', true, 50, 4.8, 324),

('MacBook Air M3', 'macbook-air-m3', 'Powerful laptop with M3 chip', 1299.99, 1399.99,
 (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'MBA-M3-001', true, 25, 4.9, 156),

('Cotton T-Shirt', 'cotton-tshirt', 'Comfortable 100% cotton t-shirt', 29.99, 39.99,
 (SELECT id FROM categories WHERE slug = 'clothing'), 'BasicWear', 'TSH-COT-001', true, 100, 4.5, 89),

('Denim Jeans', 'denim-jeans', 'Classic blue denim jeans', 79.99, 99.99,
 (SELECT id FROM categories WHERE slug = 'clothing'), 'DenimCo', 'JNS-DNM-001', true, 75, 4.6, 203),

('JavaScript Guide', 'javascript-guide', 'Complete guide to modern JavaScript', 49.99, 59.99,
 (SELECT id FROM categories WHERE slug = 'books'), 'TechBooks', 'BK-JS-001', true, 200, 4.7, 445),

('React Handbook', 'react-handbook', 'Learn React from basics to advanced', 39.99, 49.99,
 (SELECT id FROM categories WHERE slug = 'books'), 'TechBooks', 'BK-RCT-001', true, 150, 4.8, 287),

('Yoga Mat', 'yoga-mat', 'Premium non-slip yoga mat', 34.99, 44.99,
 (SELECT id FROM categories WHERE slug = 'sports'), 'FitGear', 'YG-MAT-001', true, 80, 4.4, 167),

('Running Shoes', 'running-shoes', 'Lightweight running shoes for athletes', 129.99, 149.99,
 (SELECT id FROM categories WHERE slug = 'sports'), 'SportMax', 'SH-RUN-001', true, 60, 4.6, 234);

-- Add product images (example URLs)
UPDATE products SET 
  image_url = 'https://example.com/iphone-15-pro.jpg',
  images = '["https://example.com/iphone-15-pro-1.jpg", "https://example.com/iphone-15-pro-2.jpg"]'
WHERE slug = 'iphone-15-pro';

UPDATE products SET 
  image_url = 'https://example.com/macbook-air-m3.jpg',
  images = '["https://example.com/macbook-air-m3-1.jpg", "https://example.com/macbook-air-m3-2.jpg"]'
WHERE slug = 'macbook-air-m3';
