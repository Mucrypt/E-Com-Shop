-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    subtitle text,
    description text,
    image_url text,
    background_color text,
    text_color text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active banners"
  ON banners
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admin/superadmin can insert banners"
  ON banners
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admin/superadmin can update banners"
  ON banners
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admin/superadmin can delete banners"
  ON banners
  FOR DELETE
  USING (public.is_admin(auth.uid()));