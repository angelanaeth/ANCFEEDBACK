-- Angela Coach Complete Database Schema
-- Consolidated from all previous migrations

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

-- Athlete profiles (extended profile data)
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

-- Workouts posted by Angela
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

-- Coaching recommendations log
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_tp_athlete ON users(tp_athlete_id);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON training_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON training_metrics(date DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_user_date ON wellness(user_id, date);
CREATE INDEX IF NOT EXISTS idx_fueling_user_date ON fueling_plans(user_id, workout_date);
CREATE INDEX IF NOT EXISTS idx_notes_user ON athlete_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON posted_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON recommendations(user_id, date);
CREATE INDEX IF NOT EXISTS idx_tp_queue_status ON tp_write_queue(status);
