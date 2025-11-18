-- World-class media schema for social feed, likes, shares, and notifications
-- This will support scalable, interactive, and secure social features

-- Table: social_feed
CREATE TABLE public.social_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('video', 'image', 'tutorial')),
  caption text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: feed_comments
CREATE TABLE public.feed_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES public.social_feed(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: feed_likes
CREATE TABLE public.feed_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES public.social_feed(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(feed_id, user_id)
);

-- Table: feed_shares
CREATE TABLE public.feed_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES public.social_feed(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_to text NOT NULL, -- e.g. 'story', 'external', 'user:<id>'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: feed_notifications
CREATE TABLE public.feed_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'share', 'mention')),
  feed_id uuid REFERENCES public.social_feed(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_social_feed_creator_id ON public.social_feed(creator_id);
CREATE INDEX idx_social_feed_product_id ON public.social_feed(product_id);
CREATE INDEX idx_feed_comments_feed_id ON public.feed_comments(feed_id);
CREATE INDEX idx_feed_comments_user_id ON public.feed_comments(user_id);
CREATE INDEX idx_feed_likes_feed_id ON public.feed_likes(feed_id);
CREATE INDEX idx_feed_likes_user_id ON public.feed_likes(user_id);
CREATE INDEX idx_feed_shares_feed_id ON public.feed_shares(feed_id);
CREATE INDEX idx_feed_shares_user_id ON public.feed_shares(user_id);
CREATE INDEX idx_feed_notifications_user_id ON public.feed_notifications(user_id);
CREATE INDEX idx_feed_notifications_feed_id ON public.feed_notifications(feed_id);

-- Enable RLS
ALTER TABLE public.social_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (examples)
-- Only allow users to insert/update/delete/select their own feed items, comments, likes, shares, notifications
CREATE POLICY insert_own_feed ON public.social_feed FOR INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY update_own_feed ON public.social_feed FOR UPDATE USING (creator_id = auth.uid());
CREATE POLICY delete_own_feed ON public.social_feed FOR DELETE USING (creator_id = auth.uid());
CREATE POLICY select_feed ON public.social_feed FOR SELECT USING (true);

CREATE POLICY insert_own_comment ON public.feed_comments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY update_own_comment ON public.feed_comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY delete_own_comment ON public.feed_comments FOR DELETE USING (user_id = auth.uid());
CREATE POLICY select_comment ON public.feed_comments FOR SELECT USING (true);

CREATE POLICY insert_own_like ON public.feed_likes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY delete_own_like ON public.feed_likes FOR DELETE USING (user_id = auth.uid());
CREATE POLICY select_like ON public.feed_likes FOR SELECT USING (true);

CREATE POLICY insert_own_share ON public.feed_shares FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY delete_own_share ON public.feed_shares FOR DELETE USING (user_id = auth.uid());
CREATE POLICY select_share ON public.feed_shares FOR SELECT USING (true);

CREATE POLICY insert_own_notification ON public.feed_notifications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY update_own_notification ON public.feed_notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY delete_own_notification ON public.feed_notifications FOR DELETE USING (user_id = auth.uid());
CREATE POLICY select_notification ON public.feed_notifications FOR SELECT USING (user_id = auth.uid());
