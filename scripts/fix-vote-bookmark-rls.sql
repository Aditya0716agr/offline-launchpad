-- Fix RLS policies for votes and bookmarks tables
-- This script ensures that authenticated users can vote and bookmark startups

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

DROP POLICY IF EXISTS "Users can view all bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;

-- Create new policies for votes table
CREATE POLICY "Users can view all votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes" ON votes
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Create new policies for bookmarks table
CREATE POLICY "Users can view all bookmarks" ON bookmarks
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Ensure RLS is enabled
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Test the policies
SELECT 'RLS policies updated successfully!' as status;
