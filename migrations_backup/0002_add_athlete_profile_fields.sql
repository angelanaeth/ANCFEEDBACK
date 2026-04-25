-- Add profile fields to users table
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN goals TEXT;
ALTER TABLE users ADD COLUMN training_philosophy TEXT;
ALTER TABLE users ADD COLUMN ftp INTEGER;
ALTER TABLE users ADD COLUMN lactate_threshold_hr INTEGER;
ALTER TABLE users ADD COLUMN weight_kg REAL;
ALTER TABLE users ADD COLUMN height_cm INTEGER;
ALTER TABLE users ADD COLUMN age INTEGER;
ALTER TABLE users ADD COLUMN sport TEXT DEFAULT 'triathlon';

-- Create upcoming_races table
CREATE TABLE IF NOT EXISTS upcoming_races (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  race_name TEXT NOT NULL,
  race_date DATE NOT NULL,
  race_type TEXT, -- 'sprint', 'olympic', 'half-ironman', 'ironman', 'ultra'
  distance TEXT,
  location TEXT,
  goal_time TEXT,
  priority TEXT, -- 'A', 'B', 'C' race
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_upcoming_races_user_id ON upcoming_races(user_id);
CREATE INDEX IF NOT EXISTS idx_upcoming_races_date ON upcoming_races(race_date);
