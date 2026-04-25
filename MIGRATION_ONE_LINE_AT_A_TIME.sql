-- Run each statement ONE AT A TIME in Cloudflare D1 Console
-- Copy one line, paste, execute, then move to the next
-- If you get "column already exists" error, that's OK - skip to next line

ALTER TABLE athlete_profiles ADD COLUMN css_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN css_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN bike_ftp INTEGER;

ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN bike_ftp_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN run_ftp INTEGER;

ALTER TABLE athlete_profiles ADD COLUMN run_ftp_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN run_ftp_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN run_power_cp INTEGER;

ALTER TABLE athlete_profiles ADD COLUMN run_power_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN run_power_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN hr_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN hr_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_source TEXT DEFAULT 'manual';

ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_updated TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN bike_power_zones TEXT;

ALTER TABLE athlete_profiles ADD COLUMN run_pace_zones TEXT;

ALTER TABLE athlete_profiles ADD COLUMN swim_pace_zones TEXT;

ALTER TABLE athlete_profiles ADD COLUMN power_intervals TEXT;

ALTER TABLE athlete_profiles ADD COLUMN power_intervals_source TEXT DEFAULT 'toolkit';

ALTER TABLE athlete_profiles ADD COLUMN power_intervals_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN pace_intervals TEXT;

ALTER TABLE athlete_profiles ADD COLUMN pace_intervals_source TEXT DEFAULT 'toolkit';

ALTER TABLE athlete_profiles ADD COLUMN pace_intervals_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN swim_intervals TEXT;

ALTER TABLE athlete_profiles ADD COLUMN swim_intervals_source TEXT DEFAULT 'toolkit';

ALTER TABLE athlete_profiles ADD COLUMN swim_intervals_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_prescription TEXT;

ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_source TEXT DEFAULT 'toolkit';

ALTER TABLE athlete_profiles ADD COLUMN vo2_bike_updated_at TIMESTAMP;

ALTER TABLE athlete_profiles ADD COLUMN vo2_run_prescription TEXT;

ALTER TABLE athlete_profiles ADD COLUMN vo2_run_source TEXT DEFAULT 'toolkit';

ALTER TABLE athlete_profiles ADD COLUMN vo2_run_updated_at TIMESTAMP;
