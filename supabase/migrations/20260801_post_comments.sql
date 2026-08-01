-- Comments under feed posts.
--
-- Posts live as Markdown files, not database rows, so the link is the slug
-- rather than a foreign key. Threads are per language: a Polish reader never
-- sees English replies inside a thread, so the slug alone identifies a thread.

-- A name to sign comments with. Without it the only identifier we hold is the
-- email address, which must never be shown.
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT
    CHECK (display_name IS NULL OR char_length(btrim(display_name)) BETWEEN 2 AND 40);

CREATE TABLE post_comments (
  id         BIGSERIAL PRIMARY KEY,
  post_slug  TEXT NOT NULL,
  locale     TEXT NOT NULL CHECK (locale IN ('en', 'pl')),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id  BIGINT REFERENCES post_comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 2000),
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'approved', 'rejected')),
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

-- Approved comments are public; authors additionally see their own while these
-- wait for moderation, so posting does not look like it silently failed.
CREATE POLICY "Anyone can read approved comments"
  ON post_comments FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

-- Status is not settable from the client: the default keeps new rows pending.
CREATE POLICY "Users can insert own comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Deliberately no UPDATE policy for clients. Allowing it would either block
-- authors from touching an approved comment, or let them set status
-- themselves and approve their own writing. Edits and soft deletes run
-- server-side through the service role after the route checks ownership.
--
-- Moderation runs through the service role key too, which bypasses RLS.
