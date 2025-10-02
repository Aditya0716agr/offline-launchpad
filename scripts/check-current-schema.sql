-- Check current database schema
-- Run this to see what columns exist in your tables

-- Check profiles table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check startups table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'startups' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing data
SELECT 'Current profiles:' as info;
SELECT * FROM profiles LIMIT 3;

SELECT 'Current startups:' as info;
SELECT id, name, status FROM startups LIMIT 3;
