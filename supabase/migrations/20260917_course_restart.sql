-- Restart a finished mini course. Spec: docs/specs/kurs-frontend-postep.md, 7a.
--
-- The previous run is moved to an archive table (kept for the RODO export and
-- for statistics), the live progress rows are cleared and the enrollment
-- starts counting from day 1 again. Nothing in the read paths changes: the
-- live table always holds the current run only.

ALTER TABLE course_enrollments
  ADD COLUMN run INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN restarted_at TIMESTAMPTZ;

CREATE TABLE course_day_progress_archive (
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug        TEXT NOT NULL,
  run                INTEGER NOT NULL,
  day                INTEGER NOT NULL,
  started_at         TIMESTAMPTZ NOT NULL,
  completed_at       TIMESTAMPTZ,
  checkin_choice     TEXT,
  checkin_ciphertext TEXT,
  checkin_iv         TEXT,
  checkin_salt       TEXT,
  quiz_answers       JSONB,
  archived_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_slug, run, day)
);

ALTER TABLE course_day_progress_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own archived course progress"
  ON course_day_progress_archive FOR SELECT
  USING (auth.uid() = user_id);

-- Atomic restart, callable only through the service role from the API.
CREATE OR REPLACE FUNCTION restart_course(p_user_id UUID, p_course_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_run INTEGER;
BEGIN
  SELECT run INTO v_run
  FROM course_enrollments
  WHERE user_id = p_user_id
    AND course_slug = p_course_slug
    AND completed_at IS NOT NULL
  FOR UPDATE;

  IF v_run IS NULL THEN
    RAISE EXCEPTION 'course not completed';
  END IF;

  INSERT INTO course_day_progress_archive
    (user_id, course_slug, run, day, started_at, completed_at, checkin_choice,
     checkin_ciphertext, checkin_iv, checkin_salt, quiz_answers)
  SELECT user_id, course_slug, v_run, day, started_at, completed_at, checkin_choice,
         checkin_ciphertext, checkin_iv, checkin_salt, quiz_answers
  FROM course_day_progress
  WHERE user_id = p_user_id AND course_slug = p_course_slug;

  DELETE FROM course_day_progress
  WHERE user_id = p_user_id AND course_slug = p_course_slug;

  UPDATE course_enrollments
  SET run = v_run + 1,
      completed_at = NULL,
      restarted_at = NOW(),
      last_reminded_day = NULL,
      last_reminded_at = NULL,
      winback_sent_at = NULL
  WHERE user_id = p_user_id AND course_slug = p_course_slug;

  RETURN v_run + 1;
END
$$;

REVOKE ALL ON FUNCTION restart_course(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION restart_course(UUID, TEXT) TO service_role;
