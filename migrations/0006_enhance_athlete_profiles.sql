-- Migration: Enhance athlete profiles with comprehensive training data
-- Date: 2025-03-27
-- Description: Add CP, W', CS, D', zones, and calculator outputs

-- Add bike-specific fields
ALTER TABLE athlete_profiles ADD COLUMN bike_cp INTEGER; -- Critical Power in watts
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime INTEGER; -- W' in joules
ALTER TABLE athlete_profiles ADD COLUMN bike_pvo2max INTEGER; -- pVO2max in watts

-- Add run-specific fields
ALTER TABLE athlete_profiles ADD COLUMN run_cs_seconds INTEGER; -- Critical Speed in seconds per mile
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime INTEGER; -- D' in yards
ALTER TABLE athlete_profiles ADD COLUMN run_vvo2max_seconds INTEGER; -- vVO2max in seconds per mile
ALTER TABLE athlete_profiles ADD COLUMN run_durability TEXT; -- Standard/Durable

-- Add swim-specific fields (CSS already exists as swim_pace_per_100m)
-- We'll rename it for clarity
-- Note: swim_pace_per_100m is already Critical Swim Speed

-- Add zone data (stored as JSON text)
ALTER TABLE athlete_profiles ADD COLUMN bike_power_zones TEXT; -- JSON: power zones
ALTER TABLE athlete_profiles ADD COLUMN run_pace_zones TEXT; -- JSON: pace zones
ALTER TABLE athlete_profiles ADD COLUMN swim_pace_zones TEXT; -- JSON: swim pace zones
ALTER TABLE athlete_profiles ADD COLUMN hr_zones TEXT; -- JSON: heart rate zones

-- Add calculator outputs (stored as JSON text)
ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_prescription TEXT; -- JSON: VO2 bike intervals
ALTER TABLE athlete_profiles ADD COLUMN vo2_run_prescription TEXT; -- JSON: VO2 run intervals
ALTER TABLE athlete_profiles ADD COLUMN power_intervals TEXT; -- JSON: power interval prescriptions
ALTER TABLE athlete_profiles ADD COLUMN pace_intervals TEXT; -- JSON: pace interval prescriptions
ALTER TABLE athlete_profiles ADD COLUMN swim_intervals TEXT; -- JSON: swim interval prescriptions

-- Add timestamps for data freshness
ALTER TABLE athlete_profiles ADD COLUMN zones_updated_at DATETIME;
ALTER TABLE athlete_profiles ADD COLUMN prescriptions_updated_at DATETIME;
