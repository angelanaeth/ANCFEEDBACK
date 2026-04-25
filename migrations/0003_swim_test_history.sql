-- Add swim test history tables
-- Migration: 0003_swim_test_history.sql

-- CSS Test History
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

CREATE INDEX idx_css_test_user_date ON css_test_history(user_id, test_date DESC);

-- Swim Interval Pacing History
CREATE TABLE IF NOT EXISTS swim_interval_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  css_seconds INTEGER NOT NULL,
  intervals_data TEXT NOT NULL, -- JSON: zones and interval paces
  source TEXT DEFAULT 'calculator',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_swim_interval_user_date ON swim_interval_history(user_id, test_date DESC);

-- CHO Burn (Swim) History
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

CREATE INDEX idx_swim_cho_user_date ON swim_cho_history(user_id, test_date DESC);
