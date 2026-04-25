-- Echodevo Coach Database Schema v3
-- Added wellness monitoring, fueling calculations, and performance analytics

-- Wellness data table (HRV, sleep, subjectives)
CREATE TABLE IF NOT EXISTS wellness_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  
  -- HRV metrics
  hrv_rmssd INTEGER,           -- HRV in milliseconds (Root Mean Square of Successive Differences)
  hrv_baseline INTEGER,        -- Athlete's baseline HRV
  hrv_ratio REAL,              -- Current HRV / Baseline HRV
  hrv_status TEXT,             -- 'optimal', 'normal', 'low', 'critical'
  
  -- Sleep metrics
  sleep_hours REAL,            -- Total sleep duration in hours
  sleep_quality INTEGER,       -- 1-10 scale
  sleep_score INTEGER,         -- 0-100 calculated score
  
  -- Subjective wellness (1-10 scales)
  mood INTEGER,                -- Overall mood
  energy INTEGER,              -- Energy level
  fatigue INTEGER,             -- Perceived fatigue
  muscle_soreness INTEGER,     -- Muscle soreness
  stress_level INTEGER,        -- Life stress
  motivation INTEGER,          -- Training motivation
  
  -- Overall wellness score (calculated)
  wellness_score INTEGER,      -- 0-100 composite score
  readiness_status TEXT,       -- 'ready', 'caution', 'rest'
  
  -- Notes
  notes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

-- Fueling plans table
CREATE TABLE IF NOT EXISTS fueling_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workout_id INTEGER,
  
  -- Workout details
  duration_hours REAL NOT NULL,
  intensity_factor REAL,      -- 0.5-1.0 (Easy to Race)
  workout_type TEXT,           -- 'endurance', 'threshold', 'vo2', 'race'
  
  -- Athlete metrics
  body_weight_kg REAL,
  sweat_rate_l_per_hour REAL,
  
  -- Calculated fueling needs
  carbs_per_hour INTEGER,      -- Grams of carbs per hour
  total_carbs INTEGER,         -- Total carbs for workout
  fluid_per_hour INTEGER,      -- ml per hour
  sodium_per_hour INTEGER,     -- mg per hour
  caffeine_mg INTEGER,         -- Optional caffeine dose
  
  -- Fueling strategy
  fueling_products TEXT,       -- JSON array of products
  fueling_schedule TEXT,       -- JSON array of timing
  
  -- Notes and recommendations
  notes TEXT,
  recommendations TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (workout_id) REFERENCES posted_workouts(id)
);

-- Performance analytics snapshots
CREATE TABLE IF NOT EXISTS performance_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Training load (90-day window)
  ctl_90d REAL,
  atl_90d REAL,
  tsb_90d REAL,
  
  -- Load progression
  ctl_change_30d REAL,         -- CTL change over 30 days
  load_ramp_rate REAL,         -- CTL points per week
  
  -- Volume metrics
  total_hours_30d REAL,
  total_tss_30d REAL,
  avg_weekly_tss REAL,
  
  -- Intensity distribution
  zone1_percent REAL,
  zone2_percent REAL,
  zone3_percent REAL,
  zone4_percent REAL,
  zone5_percent REAL,
  
  -- Wellness trends
  avg_hrv_30d REAL,
  avg_sleep_30d REAL,
  avg_wellness_30d REAL,
  
  -- Block progression
  current_block TEXT,
  weeks_in_block INTEGER,
  block_target_ctl REAL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, snapshot_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wellness_user_date ON wellness_data(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fueling_user ON fueling_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_user_date ON performance_snapshots(user_id, snapshot_date DESC);

-- Add wellness tracking to training_metrics (extend existing table)
ALTER TABLE training_metrics ADD COLUMN hrv_ratio REAL;
ALTER TABLE training_metrics ADD COLUMN sleep_hours REAL;
ALTER TABLE training_metrics ADD COLUMN wellness_score INTEGER;
ALTER TABLE training_metrics ADD COLUMN readiness_status TEXT;
