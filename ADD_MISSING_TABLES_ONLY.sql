-- MISSING TEST HISTORY TABLES ONLY
-- This script creates ONLY the 17 test history tables that are missing
-- Safe to run - uses CREATE TABLE IF NOT EXISTS

-- SWIM TEST HISTORY (3 tables)

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

-- BIKE TEST HISTORY (8 tables)

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

-- RUN TEST HISTORY (6 tables)

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
