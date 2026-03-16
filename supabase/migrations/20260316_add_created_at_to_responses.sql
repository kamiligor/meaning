-- Add created_at column to exercise_responses for GDPR export and audit trail
ALTER TABLE exercise_responses
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
