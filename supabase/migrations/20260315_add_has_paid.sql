-- Add payment tracking to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN has_paid BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN paid_at TIMESTAMPTZ;
