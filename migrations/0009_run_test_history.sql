-- Migration: Run Test History Tables
-- Date: 2026-04-13
-- Description: Create 6 test history tables for run calculators

-- 1. Critical Speed History
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_cs_history_user_date ON run_cs_history(user_id, test_date DESC);

-- 2. Run Best Effort Pace History
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_best_effort_history_user_date ON run_best_effort_history(user_id, test_date DESC);

-- 3. Run Pace Zones History
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_pace_zones_history_user_date ON run_pace_zones_history(user_id, test_date DESC);

-- 4. Run VO2 Max Intervals History
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_vo2_history_user_date ON run_vo2_history(user_id, test_date DESC);

-- 5. Run CHO Burn History
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_cho_history_user_date ON run_cho_history(user_id, test_date DESC);

-- 6. Run Training Zones History (combined with bike)
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
  FOREIGN KEY (user_id) REFERENCES athletes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_run_training_zones_history_user_date ON run_training_zones_history(user_id, test_date DESC);
