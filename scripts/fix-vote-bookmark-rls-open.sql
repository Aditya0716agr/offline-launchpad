-- Fix RLS policies for votes and bookmarks tables (Open version)
-- This script allows all authenticated users to vote and bookmark startups

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

DROP POLICY IF EXISTS "Users can view all bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;

-- Create open policies for votes table
CREATE POLICY "Anyone can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON votes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND
        user_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    );

-- Create open policies for bookmarks table
CREATE POLICY "Anyone can view bookmarks" ON bookmarks
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can bookmark" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

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
SELECT 'Open RLS policies updated successfully!' as status;
