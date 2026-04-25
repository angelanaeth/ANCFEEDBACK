-- Fix tp_write_queue to support fuel data
-- Drop the old generic queue table
DROP TABLE IF EXISTS tp_write_queue;

-- Create tp_write_queue with fuel-specific columns
CREATE TABLE IF NOT EXISTS tp_write_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workout_id TEXT NOT NULL,
  workout_date DATE NOT NULL,
  workout_title TEXT,
  workout_type TEXT,
  fuel_carb REAL,
  fuel_fluid REAL,
  fuel_sodium REAL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, workout_id)
);

CREATE INDEX IF NOT EXISTS idx_tp_queue_status_user ON tp_write_queue(status, user_id);
CREATE INDEX IF NOT EXISTS idx_tp_queue_workout_date ON tp_write_queue(workout_date);
