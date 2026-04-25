-- Add missing columns to tp_write_queue for better error tracking
-- These columns are used by processFuelQueue for retry logic and error tracking

ALTER TABLE tp_write_queue ADD COLUMN attempts INTEGER DEFAULT 0;
ALTER TABLE tp_write_queue ADD COLUMN last_attempt DATETIME;
ALTER TABLE tp_write_queue ADD COLUMN error_msg TEXT;

-- Create index for faster queries on status and attempts
CREATE INDEX IF NOT EXISTS idx_tp_queue_status_attempts ON tp_write_queue(status, attempts);
