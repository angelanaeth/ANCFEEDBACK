-- Training Zones Support
-- Add columns for run power CP and HR mid-Z1

-- Add run power CP
ALTER TABLE athlete_profiles ADD COLUMN run_cp_watts INTEGER;

-- Add HR mid-Z1 for threshold calculation
ALTER TABLE athlete_profiles ADD COLUMN hr_mid_z1 INTEGER;

-- Add last updated timestamp for zones
ALTER TABLE athlete_profiles ADD COLUMN zones_last_updated DATETIME;

-- Create index for faster zone lookups
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_zones ON athlete_profiles(user_id, zones_last_updated);
