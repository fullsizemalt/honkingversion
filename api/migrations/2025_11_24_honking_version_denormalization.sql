-- Denormalization for efficient honking version caching
-- Adds cached fields to maintain aggregate vote counts persistently

-- Add honking vote count cache to SongPerformance
ALTER TABLE songperformance ADD COLUMN honking_vote_count INTEGER DEFAULT 0;
ALTER TABLE songperformance ADD COLUMN honking_votes_updated_at DATETIME;

-- Add honking version cache to Song
-- This points to the winning performance and its vote count
ALTER TABLE song ADD COLUMN current_honking_performance_id INTEGER;
ALTER TABLE song ADD COLUMN current_honking_vote_count INTEGER DEFAULT 0;
ALTER TABLE song ADD COLUMN honking_version_updated_at DATETIME;

-- Add foreign key constraint for current honking performance
ALTER TABLE song ADD CONSTRAINT fk_song_current_honking_perf
  FOREIGN KEY (current_honking_performance_id)
  REFERENCES songperformance(id) ON DELETE SET NULL;

-- Create indexes for efficient lookups
CREATE INDEX idx_songperformance_honking_vote_count
  ON songperformance(honking_vote_count DESC);

CREATE INDEX idx_song_current_honking_perf
  ON song(current_honking_performance_id);

CREATE INDEX idx_honking_version_song_id
  ON honkingversion(song_id);

CREATE INDEX idx_honking_version_user_song
  ON honkingversion(user_id, song_id);
