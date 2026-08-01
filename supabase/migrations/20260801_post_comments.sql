-- Comments under feed posts, with reporting and post-hoc moderation.
--
-- Posts live as Markdown files, not database rows, so the link is the slug
-- rather than a foreign key. Threads are per language: a Polish reader never
-- sees English replies inside a thread, so the slug alone identifies a thread.
--
-- Comments appear immediately. Readers report what needs attention and the
-- admin hides, deletes or bans afterwards.

-- A name to sign comments with. Without it the only identifier we hold is the
-- email address, which must never be shown.
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT
    CHECK (display_name IS NULL OR char_length(btrim(display_name)) BETWEEN 2 AND 40);

-- Users barred from commenting. Kept separate from the comments themselves so
-- a ban survives deleting every comment its holder wrote.
CREATE TABLE comment_bans (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comment_bans ENABLE ROW LEVEL SECURITY;

-- Readers may check whether they themselves are banned, so the form can say so
-- instead of failing silently. Nobody can read anyone else's ban.
CREATE POLICY "Users can read own ban"
  ON comment_bans FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE post_comments (
  id         BIGSERIAL PRIMARY KEY,
  post_slug  TEXT NOT NULL,
  locale     TEXT NOT NULL CHECK (locale IN ('en', 'pl')),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id  BIGINT REFERENCES post_comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 2000),
  status     TEXT NOT NULL DEFAULT 'visible'
             CHECK (status IN ('visible', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at  TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_post_comments_thread ON post_comments (post_slug, status, created_at);
CREATE INDEX idx_post_comments_parent ON post_comments (parent_id);
CREATE INDEX idx_post_comments_user ON post_comments (user_id);

-- Replies go one level deep, like Facebook: you reply to a top-level comment,
-- never to a reply. A CHECK cannot read another row, so this needs a trigger.
CREATE OR REPLACE FUNCTION enforce_single_level_replies()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM post_comments
      WHERE id = NEW.parent_id AND parent_id IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Replies can only be attached to a top-level comment';
    END IF;

    -- Without this, a crafted parent_id could attach a reply to a thread on a
    -- different post entirely.
    IF NOT EXISTS (
      SELECT 1 FROM post_comments
      WHERE id = NEW.parent_id AND post_slug = NEW.post_slug
    ) THEN
      RAISE EXCEPTION 'Reply must belong to the same post as its parent';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comments_single_level
  BEFORE INSERT OR UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION enforce_single_level_replies();

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Hidden comments disappear for everyone, their author included. Only the
-- service role, which bypasses RLS, still sees them in the moderation view.
CREATE POLICY "Anyone can read visible comments"
  ON post_comments FOR SELECT
  USING (status = 'visible');

-- New comments are visible at once, and a banned user cannot write at all.
-- The route checks the ban too, to return a usable message.
CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'visible'
    AND NOT EXISTS (SELECT 1 FROM comment_bans WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Deliberately no UPDATE policy for clients: it would let an author lift the
-- hidden status the admin just applied. Soft deletes, hiding and unhiding all
-- run server-side through the service role.

-- Reports from readers. One report per person per comment, so a single user
-- cannot inflate the count.
CREATE TABLE comment_reports (
  id          BIGSERIAL PRIMARY KEY,
  comment_id  BIGINT NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT NOT NULL
              CHECK (reason IN ('spam', 'harassment', 'self_harm', 'misinformation', 'other')),
  note        TEXT CHECK (note IS NULL OR char_length(btrim(note)) <= 500),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (comment_id, reporter_id)
);

CREATE INDEX idx_comment_reports_open ON comment_reports (resolved_at, created_at);
CREATE INDEX idx_comment_reports_comment ON comment_reports (comment_id);

ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;

-- Reports are write-only for readers: you may file one, but nobody except the
-- admin can read who reported what.
CREATE POLICY "Users can file own reports"
  ON comment_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);
