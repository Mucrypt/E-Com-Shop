-- Posts table for user-generated feed posts
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster feed queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Optionally, add RLS policies for security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own posts
CREATE POLICY "Allow insert for authenticated" ON posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to select posts
CREATE POLICY "Allow select for all" ON posts
    FOR SELECT USING (true);

-- Allow users to update/delete only their own posts
CREATE POLICY "Allow update for owner" ON posts
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for owner" ON posts
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);
