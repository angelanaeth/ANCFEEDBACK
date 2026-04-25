-- Migration: Add Missing Profile Fields
-- Date: 2024-03-27
-- Description: Add remaining fields for comprehensive athlete profile

-- Bike metadata
ALTER TABLE athlete_profiles ADD COLUMN bike_cp_source TEXT DEFAULT 'trainingpeaks';
ALTER TABLE athlete_profiles ADD COLUMN bike_cp_updated TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN bike_vo2_prescription TEXT;
ALTER TABLE athlete_profiles ADD COLUMN bike_calculator_output TEXT;

-- Run metadata
ALTER TABLE athlete_profiles ADD COLUMN run_cs_source TEXT DEFAULT 'trainingpeaks';
ALTER TABLE athlete_profiles ADD COLUMN run_cs_updated TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN run_vo2_prescription TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_calculator_output TEXT;

-- Swim metadata
ALTER TABLE athlete_profiles ADD COLUMN swim_css_source TEXT DEFAULT 'trainingpeaks';
ALTER TABLE athlete_profiles ADD COLUMN swim_css_updated TIMESTAMP;
ALTER TABLE athlete_profiles ADD COLUMN swim_prescription TEXT;
ALTER TABLE athlete_profiles ADD COLUMN swim_calculator_output TEXT;

-- Training data
ALTER TABLE athlete_profiles ADD COLUMN current_phase TEXT DEFAULT 'base';
ALTER TABLE athlete_profiles ADD COLUMN target_race_id INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN weekly_hours_available REAL;
ALTER TABLE athlete_profiles ADD COLUMN primary_goal TEXT;
ALTER TABLE athlete_profiles ADD COLUMN coach_notes TEXT;
ALTER TABLE athlete_profiles ADD COLUMN medical_history TEXT;

-- Sync metadata
ALTER TABLE athlete_profiles ADD COLUMN last_synced_tp TIMESTAMP;

-- CTL tracking table for daily values
CREATE TABLE athlete_ctl (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  ctl_bike REAL,
  ctl_run REAL,
  ctl_swim REAL,
  last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, date)
);

CREATE INDEX idx_athlete_ctl_user_date ON athlete_ctl(user_id, date);
