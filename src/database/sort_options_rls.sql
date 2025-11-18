ALTER TABLE public.sort_options ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access to sort_options" ON public.sort_options
  FOR SELECT
  USING (true);

-- Only admin can insert
CREATE POLICY "Admin insert sort_options" ON public.sort_options
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Only admin can update
CREATE POLICY "Admin update sort_options" ON public.sort_options
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Only admin can delete
CREATE POLICY "Admin delete sort_options" ON public.sort_options
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- If you want only superadmins to modify, replace is_admin with is_superadmin.
