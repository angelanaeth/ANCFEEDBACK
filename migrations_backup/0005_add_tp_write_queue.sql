-- Migration: Add tp_write_queue table for fuel writeback
-- Purpose: Queue system for writing fueling data to TrainingPeaks

CREATE TABLE IF NOT EXISTS tp_write_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  athlete_id TEXT NOT NULL,
  workout_id TEXT NOT NULL,
  workout_date TEXT NOT NULL,
  workout_title TEXT,
  workout_type TEXT,
  fuel_carb REAL NOT NULL,
  fuel_fluid INTEGER NOT NULL,
  fuel_sodium INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt DATETIME,
  error_msg TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tp_write_queue_athlete ON tp_write_queue(athlete_id);
CREATE INDEX IF NOT EXISTS idx_tp_write_queue_status ON tp_write_queue(status);
CREATE INDEX IF NOT EXISTS idx_tp_write_queue_workout_date ON tp_write_queue(workout_date);
