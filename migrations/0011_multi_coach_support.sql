-- Multi-Coach Support Migration
-- Add columns to identify and separate coaches

-- Add coach identification columns to users table
ALTER TABLE users ADD COLUMN coach_email TEXT;
ALTER TABLE users ADD COLUMN coach_name TEXT;

-- Create index for faster coach lookups
CREATE INDEX IF NOT EXISTS idx_users_coach_email ON users(coach_email);

-- Update existing coach account with placeholder
UPDATE users 
SET coach_email = 'coach@account.com', 
    coach_name = 'Coach Account'
WHERE account_type = 'coach' AND coach_email IS NULL;
