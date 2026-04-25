-- Angela Coach Complete Database Schema - CORRECTED VERSION
-- All foreign keys reference users(id) not athletes(id)

-- Users/Athletes table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tp_athlete_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at INTEGER NOT NULL,
  account_type TEXT DEFAULT 'athlete',
  bio TEXT,
  location TEXT,
  coach_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_tp_athlete ON users(tp_athlete_id);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);

-- Athlete profiles
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  weight_kg REAL,
  height_cm REAL,
  ftp_watts INTEGER,
  cp_watts INTEGER,
  cs_run_seconds INTEGER,
  swim_pace_per_100m INTEGER,
  lactate_threshold_hr INTEGER,
  max_hr INTEGER,
  resting_hr INTEGER,
  vo2_max REAL,
  bike_interval_targets TEXT,
  run_interval_targets TEXT,
  swim_interval_pacing TEXT,
  low_cadence_targets TEXT,
  cho_burn_data TEXT,
  training_zones TEXT,
  bike_power_zones_detailed TEXT,
  lt1_ogc_analysis TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Training metrics history
CREATE TABLE IF NOT EXISTS training_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  tss REAL DEFAULT 0,
  ctl REAL DEFAULT 0,
  atl REAL DEFAULT 0,
  tsb REAL DEFAULT 0,
  stress_state TEXT,
  block_type TEXT,
  sport_metrics TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON training_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON training_metrics(date DESC);

-- Wellness data
CREATE TABLE IF NOT EXISTS wellness (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  hrv_rmssd REAL,
  resting_hr INTEGER,
  sleep_hours REAL,
  sleep_quality INTEGER,
  weight_kg REAL,
  body_fat REAL,
  fatigue INTEGER,
  mood INTEGER,
  energy INTEGER,
  soreness INTEGER,
  stress_score INTEGER,
  motivation INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_wellness_user_date ON wellness(user_id, date);

-- Fueling plans
CREATE TABLE IF NOT EXISTS fueling_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workout_date DATE NOT NULL,
  workout_title TEXT,
  workout_type TEXT,
  duration_minutes INTEGER,
  intensity_factor REAL,
  fuel_carb_grams REAL,
  fuel_sodium_mg REAL,
  fuel_hydration_ml REAL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_fueling_user_date ON fueling_plans(user_id, workout_date);

-- Athlete notes
CREATE TABLE IF NOT EXISTS athlete_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  note_text TEXT NOT NULL,
  note_type TEXT DEFAULT 'general',
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE(user_id, created_by)
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON athlete_notes(user_id);

-- Posted workouts
CREATE TABLE IF NOT EXISTS posted_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tp_workout_id TEXT,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tss REAL NOT NULL,
  duration INTEGER,
  sport TEXT NOT NULL,
  block_type TEXT,
  posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON posted_workouts(user_id, date);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  stress_state TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  intensity_mod REAL DEFAULT 1.0,
  reasoning TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON recommendations(user_id, date);

-- TrainingPeaks write queue
CREATE TABLE IF NOT EXISTS tp_write_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  operation TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_tp_queue_status ON tp_write_queue(status);

-- SWIM TEST HISTORY TABLES

CREATE TABLE IF NOT EXISTS css_test_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  t200_seconds INTEGER NOT NULL,
  t400_seconds INTEGER NOT NULL,
  css_seconds INTEGER NOT NULL,
  css_pace_per_100m TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_css_test_user_date ON css_test_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS swim_interval_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  css_seconds INTEGER NOT NULL,
  intervals_data TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_swim_interval_user_date ON swim_interval_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS swim_cho_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  weight_kg REAL NOT NULL,
  intensity TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  carb_burn_per_hour REAL NOT NULL,
  total_carbs REAL NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_swim_cho_user_date ON swim_cho_history(user_id, test_date DESC);

-- BIKE TEST HISTORY TABLES

CREATE TABLE IF NOT EXISTS cp_test_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  p1_watts INTEGER,
  p5_watts INTEGER,
  p20_watts INTEGER,
  p60_watts INTEGER,
  cp_watts INTEGER NOT NULL,
  w_prime_joules INTEGER NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cp_test_user_date ON cp_test_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  zones_data TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_zones_user_date ON bike_zones_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_vo2_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  w_prime_joules INTEGER NOT NULL,
  pvo2max_watts INTEGER NOT NULL,
  workouts_data TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_vo2_user_date ON bike_vo2_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_best_effort_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  w_prime_joules INTEGER NOT NULL,
  intervals_data TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_best_effort_user_date ON bike_best_effort_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_low_cadence_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  target_cadence_low INTEGER NOT NULL,
  target_cadence_high INTEGER NOT NULL,
  power_targets TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_low_cadence_user_date ON bike_low_cadence_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_cho_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  weight_kg REAL NOT NULL,
  power_watts INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  total_kj REAL NOT NULL,
  cho_burned_g REAL NOT NULL,
  fat_burned_g REAL NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_cho_user_date ON bike_cho_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_training_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  lthr_bpm INTEGER NOT NULL,
  hr_zones_data TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_training_zones_user_date ON bike_training_zones_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS bike_lt1_ogc_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  lt1_watts INTEGER,
  lt1_hr INTEGER,
  ogc_watts INTEGER,
  ogc_hr INTEGER,
  cp_watts INTEGER,
  lt1_percent_cp REAL,
  ogc_percent_cp REAL,
  test_data TEXT,
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bike_lt1_ogc_user_date ON bike_lt1_ogc_history(user_id, test_date DESC);

-- RUN TEST HISTORY TABLES

CREATE TABLE IF NOT EXISTS run_cs_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  cs_pace_seconds REAL,
  cs_pace_formatted TEXT,
  d_prime REAL,
  test_type TEXT,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_cs_history_user_date ON run_cs_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS run_best_effort_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  cs_pace_seconds REAL,
  d_prime REAL,
  intervals TEXT,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_best_effort_history_user_date ON run_best_effort_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS run_pace_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  cs_pace_seconds REAL,
  zones TEXT,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_pace_zones_history_user_date ON run_pace_zones_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS run_vo2_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  cs_pace_seconds REAL,
  d_prime REAL,
  vvo2max_pace_seconds REAL,
  vvo2max_pace_formatted TEXT,
  intervals TEXT,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_vo2_history_user_date ON run_vo2_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS run_cho_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  weight_kg REAL,
  intensity TEXT,
  duration_min INTEGER,
  carb_burn_per_hour REAL,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_cho_history_user_date ON run_cho_history(user_id, test_date DESC);

CREATE TABLE IF NOT EXISTS run_training_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date TEXT NOT NULL,
  cs_pace_seconds REAL,
  zones TEXT,
  test_data TEXT,
  source TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_training_zones_history_user_date ON run_training_zones_history(user_id, test_date DESC);
