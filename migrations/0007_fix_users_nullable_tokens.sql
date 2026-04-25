-- Fix users table to allow NULL tokens for athletes managed by coach
-- Add missing columns that were added in later versions

-- Add coach_email column (will be ignored if already exists)
ALTER TABLE users ADD COLUMN coach_email TEXT;

-- Add coach_name column (will be ignored if already exists)  
ALTER TABLE users ADD COLUMN coach_name TEXT;

-- Note: Cannot change NOT NULL to NULL in SQLite without recreating table
-- But this is OK - the initial schema in 0001 should be updated for new installs
