-- Add session management columns to admin_users
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS session_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS admin_session_token_idx ON admin_users(session_token) WHERE session_token IS NOT NULL;
