-- Angela Coach Database Schema v2
-- FIXED: Added account_type to support separate Coach and Athlete modes

-- Users/Athletes table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tp_athlete_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at INTEGER NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'athlete', -- 'coach' or 'athlete'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_tp_athlete ON users(tp_athlete_id);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON training_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON posted_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_date ON recommendations(user_id, date);
