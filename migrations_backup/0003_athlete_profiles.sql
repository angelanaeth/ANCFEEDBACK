-- Migration: Add athlete profile fields for fueling calculations
-- These fields are used to calculate precise CHO requirements per workout

-- Add profile columns to users table
ALTER TABLE users ADD COLUMN cp_watts REAL;          -- Critical Power for bike (watts)
ALTER TABLE users ADD COLUMN cs_run_seconds INTEGER; -- Critical Speed for run (seconds per mile)
ALTER TABLE users ADD COLUMN swim_pace_per_100 INTEGER; -- Swim pace (seconds per 100m/y)
-- weight_kg already exists in users table
ALTER TABLE users ADD COLUMN profile_updated_at DATETIME; -- Last profile update

-- Create index for faster profile queries
CREATE INDEX IF NOT EXISTS idx_users_profile ON users(tp_athlete_id, weight_kg);

-- Note: Default values will be set in application code based on athlete data
-- CP: ~200-300 watts for trained athletes
-- CS Run: ~400-450 seconds per mile (6:40-7:30 pace)
-- Swim pace: ~95-120 seconds per 100
-- Weight: 70 kg default
