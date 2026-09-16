-- Reminder bookkeeping for course e-mails. One reminder per newly unlocked
-- day; if the person goes quiet, one win-back mail after a few days and then
-- silence (no nagging — platform rule).
ALTER TABLE course_enrollments
  ADD COLUMN last_reminded_day INTEGER,
  ADD COLUMN last_reminded_at TIMESTAMPTZ,
  ADD COLUMN winback_sent_at TIMESTAMPTZ;
