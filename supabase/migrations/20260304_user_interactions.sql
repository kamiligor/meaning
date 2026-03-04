-- User interactions table (likes, future: bookmarks, badges)
CREATE TABLE user_interactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, interaction_type, target_type, target_id)
);

-- RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own interactions"
  ON user_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON user_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
  ON user_interactions FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_interactions_user_type ON user_interactions(user_id, interaction_type);
CREATE INDEX idx_user_interactions_target ON user_interactions(target_type, target_id);
