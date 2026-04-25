-- Add sport-specific metrics column to training_metrics table
-- Stores JSON with swim/bike/run CTL/ATL/TSB breakdown

ALTER TABLE training_metrics ADD COLUMN sport_metrics TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_metrics_date ON training_metrics(date DESC);
