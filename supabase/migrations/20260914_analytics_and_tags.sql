-- First-party analytics + campaign tags.
-- Spec: docs/specs/tracking-analytics.md
--
-- All four tables have RLS enabled and NO policies on purpose: anon and
-- authenticated roles get nothing. Every read and write goes through the
-- service role in server route handlers, so bypassing /api/t with the anon
-- key against Supabase REST yields nothing.

-- ---------------------------------------------------------------------------
-- Raw events. Kept 90 days, then deleted by the nightly aggregate job.
-- Anonymous visitors are a one-day hash of (secret, date, ip, user-agent);
-- neither ip nor user-agent is ever stored. Logged-in users get user_id and
-- no hash. Account deletion nulls user_id (ON DELETE SET NULL), so the row
-- survives anonymously and past aggregates stay consistent.
-- ---------------------------------------------------------------------------
CREATE TABLE analytics_events (
  id           BIGSERIAL PRIMARY KEY,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type   TEXT NOT NULL CHECK (event_type IN ('post_view', 'post_read', 'login')),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_hash TEXT,
  locale       TEXT CHECK (locale IN ('en', 'pl')),
  target_id    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT analytics_events_identity CHECK (
    (user_id IS NOT NULL AND visitor_hash IS NULL)
    OR (user_id IS NULL AND visitor_hash IS NOT NULL)
    -- after account deletion both may be NULL
    OR (user_id IS NULL AND visitor_hash IS NULL)
  )
);

CREATE INDEX idx_analytics_events_type_time
  ON analytics_events (event_type, occurred_at);
CREATE INDEX idx_analytics_events_target
  ON analytics_events (target_id, occurred_at)
  WHERE target_id IS NOT NULL;
CREATE INDEX idx_analytics_events_user
  ON analytics_events (user_id)
  WHERE user_id IS NOT NULL;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Daily aggregates. No personal data, kept indefinitely.
-- metric values: post_view | post_read | login | new_accounts | active_7d
--   | active_30d | course_enroll | course_day_start | course_day_complete
--   | course_complete | course_feedback | post_like
-- dimension: post slug or course slug; extra: course day number or rating.
-- ---------------------------------------------------------------------------
CREATE TABLE analytics_daily_stats (
  day          DATE NOT NULL,
  metric       TEXT NOT NULL,
  dimension    TEXT NOT NULL DEFAULT '',
  locale       TEXT NOT NULL DEFAULT '',
  extra        TEXT NOT NULL DEFAULT '',
  count        INTEGER NOT NULL DEFAULT 0,
  unique_count INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (day, metric, dimension, locale, extra)
);

CREATE INDEX idx_analytics_daily_stats_metric_day
  ON analytics_daily_stats (metric, day);

ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Tag dictionary: the allowlist. A tag that is not defined here cannot be
-- attached to anyone. Automatic tags are registered by the server job that
-- creates them; manual tags are created in the admin panel first.
-- ---------------------------------------------------------------------------
CREATE TABLE tag_definitions (
  tag         TEXT PRIMARY KEY CHECK (tag ~ '^[a-z0-9-]{3,80}$'),
  description TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('auto', 'manual')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tag_definitions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Tags on people. Exist only to target a person, so they go with the account
-- (ON DELETE CASCADE). synced_at marks the last successful push of this tag
-- to the MailerLite group of the same name.
-- ---------------------------------------------------------------------------
CREATE TABLE user_tags (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL REFERENCES tag_definitions(tag) ON DELETE CASCADE,
  source     TEXT NOT NULL CHECK (source IN ('auto', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at  TIMESTAMPTZ,
  PRIMARY KEY (user_id, tag)
);

CREATE INDEX idx_user_tags_tag ON user_tags (tag);

ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
