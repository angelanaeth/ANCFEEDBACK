-- Migration to add race plans support to athlete_notes table

-- Add race_name and content columns
ALTER TABLE athlete_notes ADD COLUMN race_name TEXT;
ALTER TABLE athlete_notes ADD COLUMN content TEXT;

-- Remove the unique constraint on (user_id, created_by) to allow multiple race plans
-- SQLite doesn't support DROP CONSTRAINT, so we need to recreate the table
-- But for now, we'll work around it by using note_type to differentiate

-- Create index for faster race note queries
CREATE INDEX IF NOT EXISTS idx_athlete_notes_race_type ON athlete_notes(user_id, note_type);
CREATE INDEX IF NOT EXISTS idx_athlete_notes_race_name ON athlete_notes(user_id, race_name);
