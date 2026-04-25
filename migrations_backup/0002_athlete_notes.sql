-- Add athlete notes table for coach-to-athlete notes
-- Each note is saved per athlete and can be updated

CREATE TABLE IF NOT EXISTS athlete_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  athlete_id TEXT NOT NULL,
  coach_id INTEGER,
  notes TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(athlete_id, coach_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_notes_athlete ON athlete_notes(athlete_id);
CREATE INDEX IF NOT EXISTS idx_notes_coach ON athlete_notes(coach_id);
