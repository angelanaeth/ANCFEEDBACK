-- Add missing calculator output columns
-- These are needed to store calculator results from the toolkit

ALTER TABLE athlete_profiles ADD COLUMN bike_interval_targets TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_interval_targets TEXT;
ALTER TABLE athlete_profiles ADD COLUMN swim_interval_pacing TEXT;
ALTER TABLE athlete_profiles ADD COLUMN low_cadence_targets TEXT;
ALTER TABLE athlete_profiles ADD COLUMN cho_burn_data TEXT;
ALTER TABLE athlete_profiles ADD COLUMN training_zones TEXT;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_zones_detailed TEXT;
ALTER TABLE athlete_profiles ADD COLUMN lt1_ogc_analysis TEXT;
