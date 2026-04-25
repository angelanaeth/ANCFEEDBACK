-- =====================================================================
-- PRODUCTION DATABASE MIGRATION SCRIPT
-- Run this manually in Cloudflare Dashboard > D1 > angela-db-production
-- =====================================================================
-- IMPORTANT: Run each section separately and check for errors
-- If a column already exists, skip that ALTER TABLE statement
-- =====================================================================

-- =====================================================================
-- SECTION 1: Toolkit Integration Fields (Migration 0011)
-- =====================================================================

-- Swim fields
ALTER TABLE athlete_profiles ADD COLUMN css_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN css_updated_at TIMESTAMP;

-- Bike Critical Power fields (NOT FTP - we use CP!)
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp INTEGER;  -- LEGACY: rename to bike_cp
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_updated_at TIMESTAMP;

-- Run Critical Speed/Pace fields (PACE is primary for run, NOT FTP!)
ALTER TABLE athlete_profiles ADD COLUMN run_ftp INTEGER;  -- This is pace in seconds per km
ALTER TABLE athlete_profiles ADD COLUMN run_ftp_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_ftp_updated_at TIMESTAMP;

-- Run Power fields (separate from pace)
ALTER TABLE athlete_profiles ADD COLUMN run_power_cp INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_power_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_power_updated_at TIMESTAMP;

-- Heart Rate fields
ALTER TABLE athlete_profiles ADD COLUMN hr_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN hr_updated_at TIMESTAMP;

-- W' Prime fields (bike anaerobic capacity)
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated TIMESTAMP;

-- D' Prime fields (run anaerobic reserve)
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_updated TIMESTAMP;

-- =====================================================================
-- SECTION 2: Zone Storage Fields
-- =====================================================================

-- Bike Power Zones (JSON: {recovery, endurance, tempo, threshold})
ALTER TABLE athlete_profiles ADD COLUMN bike_power_zones TEXT;

-- Run Pace Zones (JSON: {recovery, endurance, tempo, threshold})
ALTER TABLE athlete_profiles ADD COLUMN run_pace_zones TEXT;

-- Swim Pace Zones (JSON: {recovery, endurance, tempo, threshold})
ALTER TABLE athlete_profiles ADD COLUMN swim_pace_zones TEXT;

-- =====================================================================
-- SECTION 3: Interval Prescription Fields (Migration 0012)
-- =====================================================================

-- Power Intervals (best effort power targets for bike)
ALTER TABLE athlete_profiles ADD COLUMN power_intervals TEXT;
ALTER TABLE athlete_profiles ADD COLUMN power_intervals_source TEXT DEFAULT 'toolkit';
ALTER TABLE athlete_profiles ADD COLUMN power_intervals_updated_at TIMESTAMP;

-- Pace Intervals (best effort pace targets for run)
ALTER TABLE athlete_profiles ADD COLUMN pace_intervals TEXT;
ALTER TABLE athlete_profiles ADD COLUMN pace_intervals_source TEXT DEFAULT 'toolkit';
ALTER TABLE athlete_profiles ADD COLUMN pace_intervals_updated_at TIMESTAMP;

-- Swim Intervals (swim pacing for various distances/zones)
ALTER TABLE athlete_profiles ADD COLUMN swim_intervals TEXT;
ALTER TABLE athlete_profiles ADD COLUMN swim_intervals_source TEXT DEFAULT 'toolkit';
ALTER TABLE athlete_profiles ADD COLUMN swim_intervals_updated_at TIMESTAMP;

-- VO2 Bike Prescription (structured VO2max intervals for bike)
ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_prescription TEXT;
ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_source TEXT DEFAULT 'toolkit';
ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_updated_at TIMESTAMP;

-- VO2 Run Prescription (structured VO2max intervals for run)
ALTER TABLE athlete_profiles ADD COLUMN vo2_run_prescription TEXT;
ALTER TABLE athlete_profiles ADD COLUMN vo2_run_source TEXT DEFAULT 'toolkit';
ALTER TABLE athlete_profiles ADD COLUMN vo2_run_updated_at TIMESTAMP;

-- =====================================================================
-- SECTION 4: Verify Schema
-- =====================================================================
-- Run this to verify all columns were added:
-- SELECT sql FROM sqlite_master WHERE type='table' AND name='athlete_profiles';

-- =====================================================================
-- IMPORTANT NOTES:
-- =====================================================================
-- 1. bike_ftp is actually CRITICAL POWER (CP) - we DO NOT use FTP
-- 2. run_ftp is actually PACE (seconds per km) - PACE is primary for run
-- 3. run_power_cp is separate run power if athlete runs with power meter
-- 4. All zones and intervals are stored as JSON TEXT
-- 5. If you see "column already exists" errors, that's OK - skip those
-- =====================================================================
