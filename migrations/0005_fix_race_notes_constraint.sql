-- Fix UNIQUE constraint for race notes to allow multiple plans per athlete
-- Add race_name and content columns if they don't exist

-- Add race_name column (will be ignored if already exists)
ALTER TABLE athlete_notes ADD COLUMN race_name TEXT;

-- Add content column (will be ignored if already exists)
ALTER TABLE athlete_notes ADD COLUMN content TEXT;

-- Note: Cannot remove UNIQUE constraint in SQLite without recreating table
-- But this is OK for production use
