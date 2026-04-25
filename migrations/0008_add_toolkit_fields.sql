-- Migration: Add Toolkit Integration Fields
-- Date: 2026-03-28
-- Description: Add css_source, css_updated_at, bike_ftp, run_ftp and related fields for toolkit integration

-- Swim fields (NEW aliases for frontend compatibility)
ALTER TABLE athlete_profiles ADD COLUMN css_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN css_updated_at TIMESTAMP;

-- Bike FTP fields (NEW)
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_updated_at TIMESTAMP;

-- Run FTP fields (NEW - pace in seconds per km)
ALTER TABLE athlete_profiles ADD COLUMN run_ftp INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_ftp_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_ftp_updated_at TIMESTAMP;

-- Run Power fields (NEW)
ALTER TABLE athlete_profiles ADD COLUMN run_power_cp INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN run_power_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_power_updated_at TIMESTAMP;

-- Heart Rate fields (NEW)
ALTER TABLE athlete_profiles ADD COLUMN hr_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN hr_updated_at TIMESTAMP;

-- W' Prime fields (NEW)
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated TIMESTAMP;

-- D' Prime fields (NEW)
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_source TEXT DEFAULT 'manual';
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_updated TIMESTAMP;
