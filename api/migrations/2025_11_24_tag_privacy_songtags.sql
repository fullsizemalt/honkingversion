-- Add privacy fields and song tag mapping
ALTER TABLE tag ADD COLUMN is_private BOOLEAN DEFAULT 0;
ALTER TABLE tag ADD COLUMN owner_user_id INTEGER REFERENCES user(id);

CREATE TABLE IF NOT EXISTS songtag (
    id INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL REFERENCES song(id),
    tag_id INTEGER NOT NULL REFERENCES tag(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_songtag_song_id ON songtag(song_id);
CREATE INDEX IF NOT EXISTS idx_songtag_tag_id ON songtag(tag_id);
