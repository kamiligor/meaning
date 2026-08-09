-- Mini course tables (Kurs niescrollowania and future courses).
-- Free course, requires an account; activity is tracked first-party for the
-- day 1 -> 5 funnel. Check-in free text is encrypted like exercise responses;
-- progress metadata (dates, choices) stays readable because it feeds the funnel.

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  baseline_screen_time_min INTEGER,
  baseline_pickups INTEGER,
  reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (user_id, course_slug)
);

ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own enrollments"
  ON course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments"
  ON course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own enrollments"
  ON course_enrollments FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE course_day_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 31),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  -- Check-in about how this day's challenge went (collected on the next day's page).
  checkin_choice TEXT,
  checkin_ciphertext TEXT,
  checkin_iv TEXT,
  checkin_salt TEXT,
  quiz_answers JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_slug, day)
);

ALTER TABLE course_day_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own course progress"
  ON course_day_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress"
  ON course_day_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress"
  ON course_day_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own course progress"
  ON course_day_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Feedback is addressed to the course author, so unlike check-ins it is
-- stored in plain text; the form says so explicitly.
CREATE TABLE course_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('worth_it', 'mixed', 'not_for_me')),
  hardest TEXT,
  suggestion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_slug)
);

ALTER TABLE course_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own course feedback"
  ON course_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course feedback"
  ON course_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course feedback"
  ON course_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own course feedback"
  ON course_feedback FOR DELETE
  USING (auth.uid() = user_id);
