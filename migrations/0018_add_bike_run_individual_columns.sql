-- Migration: Add individual bike and run metric columns
-- Date: 2026-04-16
-- Description: Add bike_cp, bike_w_prime, bike_lt1_power, bike_ogc_power and run equivalents

-- Bike individual columns
ALTER TABLE athlete_profiles ADD COLUMN bike_cp INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_source TEXT;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_updated TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_source TEXT;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_updated TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_pvo2max INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_peak_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_cp_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated_at TIMESTAMP;

-- Run individual columns  
ALTER TABLE athlete_profiles ADD COLUMN run_cs INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_cs_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_lt1_pace INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_lt1_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_ogc_pace INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_ogc_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_lthr_manual INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_lthr_manual_updated_at TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_3min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_3min_duration INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_3min_date TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_6min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_6min_duration INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_6min_date TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_12min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_12min_duration INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_12min_date TIMESTAMP;

-- Bike test columns (for 3/6/12 min power)
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min_duration INTEGER DEFAULT 180;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min_date TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min_duration INTEGER DEFAULT 360;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min_date TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min_duration INTEGER DEFAULT 720;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min_date TIMESTAMP;

-- Body weight (needed for W/kg calculations)
ALTER TABLE athlete_profiles ADD COLUMN body_weight_kg REAL;

-- Now migrate existing JSON data to individual columns
UPDATE athlete_profiles
SET 
  bike_cp = CAST(json_extract(bike_power_zones, '$.bike_cp') AS INTEGER),
  bike_w_prime = CAST(json_extract(bike_power_zones, '$.bike_w_prime') AS INTEGER),
  bike_pvo2max = CAST(json_extract(bike_power_zones, '$.bike_vo2_max_power') AS INTEGER),
  bike_cp_source = COALESCE(json_extract(bike_power_zones, '$.bike_cp_source'), bike_cp_source),
  bike_cp_updated_at = COALESCE(json_extract(bike_power_zones, '$.bike_cp_updated'), json_extract(bike_power_zones, '$.timestamp'))
WHERE bike_power_zones IS NOT NULL 
  AND bike_power_zones != ''
  AND bike_cp IS NULL;
