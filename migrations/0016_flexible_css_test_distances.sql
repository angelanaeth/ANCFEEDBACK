-- Migration: Flexible CSS Test Distances
-- Allow any distance for CSS testing (not just 200m/400m)
-- Date: 2026-04-14

-- Drop the old css_test_history table
DROP TABLE IF EXISTS css_test_history;

-- Create new flexible css_test_history table
CREATE TABLE IF NOT EXISTS css_test_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  test_date DATE NOT NULL,
  test_type TEXT NOT NULL DEFAULT '2-point', -- '2-point' or '3-point'
  
  -- Test data stored as JSON with flexible distances
  -- Example: {"distances": [200, 400], "times": [150, 320]}
  test_data TEXT NOT NULL,
  
  -- Calculated CSS result
  css_seconds INTEGER NOT NULL,
  css_pace_per_100m TEXT NOT NULL,
  
  source TEXT DEFAULT 'manual', -- 'manual' or 'calculator'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_css_test_user_date ON css_test_history(user_id, test_date DESC);
