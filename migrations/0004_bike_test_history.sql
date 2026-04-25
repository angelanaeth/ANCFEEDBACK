-- Add bike test history tables
-- Migration: 0004_bike_test_history.sql

-- Critical Power (CP) Test History
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

CREATE INDEX idx_cp_test_user_date ON cp_test_history(user_id, test_date DESC);

-- Bike Power Zones History
CREATE TABLE IF NOT EXISTS bike_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  zones_data TEXT NOT NULL, -- JSON: zone definitions
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_zones_user_date ON bike_zones_history(user_id, test_date DESC);

-- VO2 Max Intervals (Bike) History
CREATE TABLE IF NOT EXISTS bike_vo2_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  w_prime_joules INTEGER NOT NULL,
  pvo2max_watts INTEGER NOT NULL,
  workouts_data TEXT NOT NULL, -- JSON: generated workouts
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_vo2_user_date ON bike_vo2_history(user_id, test_date DESC);

-- Best Effort Wattage History
CREATE TABLE IF NOT EXISTS bike_best_effort_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  w_prime_joules INTEGER NOT NULL,
  intervals_data TEXT NOT NULL, -- JSON: interval targets
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_best_effort_user_date ON bike_best_effort_history(user_id, test_date DESC);

-- Low Cadence History
CREATE TABLE IF NOT EXISTS bike_low_cadence_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  cp_watts INTEGER NOT NULL,
  target_cadence_low INTEGER NOT NULL,
  target_cadence_high INTEGER NOT NULL,
  power_targets TEXT NOT NULL, -- JSON: power at different cadences
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_low_cadence_user_date ON bike_low_cadence_history(user_id, test_date DESC);

-- CHO Burn (Bike) History
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

CREATE INDEX idx_bike_cho_user_date ON bike_cho_history(user_id, test_date DESC);

-- Training Zones (LTHR) History
CREATE TABLE IF NOT EXISTS bike_training_zones_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  lthr_bpm INTEGER NOT NULL,
  hr_zones_data TEXT NOT NULL, -- JSON: HR zone definitions
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_training_zones_user_date ON bike_training_zones_history(user_id, test_date DESC);

-- LT1/OGC Analysis History (for future)
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
  test_data TEXT, -- JSON: full test data
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bike_lt1_ogc_user_date ON bike_lt1_ogc_history(user_id, test_date DESC);
