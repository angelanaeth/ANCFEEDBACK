-- Migration: Migrate JSON data to individual columns
-- Date: 2026-04-16
-- Description: Parse bike_power_zones, run_pace_zones, swim_pace_zones JSON strings
--              and extract values to individual columns for better querying

-- Migrate bike data from bike_power_zones JSON
UPDATE athlete_profiles
SET 
  bike_cp = CAST(json_extract(bike_power_zones, '$.bike_cp') AS INTEGER),
  bike_w_prime = CAST(json_extract(bike_power_zones, '$.bike_w_prime') AS INTEGER),
  bike_ftp = COALESCE(CAST(json_extract(bike_power_zones, '$.bike_ftp') AS INTEGER), bike_ftp),
  bike_pvo2max = CAST(json_extract(bike_power_zones, '$.bike_vo2_max_power') AS INTEGER),
  bike_cp_source = COALESCE(json_extract(bike_power_zones, '$.bike_cp_source'), bike_cp_source),
  bike_cp_updated = COALESCE(json_extract(bike_power_zones, '$.bike_cp_updated'), json_extract(bike_power_zones, '$.timestamp'))
WHERE bike_power_zones IS NOT NULL 
  AND bike_power_zones != ''
  AND bike_cp IS NULL;

-- Migrate run data from run_pace_zones JSON (if exists)
UPDATE athlete_profiles
SET 
  run_cs_seconds = CAST(json_extract(run_pace_zones, '$.run_cs_seconds') AS INTEGER),
  run_d_prime = CAST(json_extract(run_pace_zones, '$.run_d_prime') AS INTEGER),
  run_vvo2max_seconds = CAST(json_extract(run_pace_zones, '$.run_vvo2max_seconds') AS INTEGER),
  run_cs_source = COALESCE(json_extract(run_pace_zones, '$.run_cs_source'), run_cs_source),
  run_cs_updated = COALESCE(json_extract(run_pace_zones, '$.run_cs_updated'), json_extract(run_pace_zones, '$.timestamp'))
WHERE run_pace_zones IS NOT NULL 
  AND run_pace_zones != ''
  AND run_cs_seconds IS NULL;

-- Migrate swim data from swim_pace_zones JSON (if exists)
UPDATE athlete_profiles
SET 
  swim_pace_per_100m = CAST(json_extract(swim_pace_zones, '$.css_pace') AS INTEGER),
  css_source = COALESCE(json_extract(swim_pace_zones, '$.css_source'), swim_css_source),
  css_updated_at = COALESCE(json_extract(swim_pace_zones, '$.css_updated'), json_extract(swim_pace_zones, '$.timestamp'))
WHERE swim_pace_zones IS NOT NULL 
  AND swim_pace_zones != ''
  AND swim_pace_per_100m IS NULL;
