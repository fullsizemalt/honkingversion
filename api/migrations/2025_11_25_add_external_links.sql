-- Add external links (Bandcamp, Nugs) to Show and SongPerformance tables
-- Nov 25, 2025

-- Add columns to show table
ALTER TABLE show ADD COLUMN bandcamp_url VARCHAR(500);
ALTER TABLE show ADD COLUMN nugs_url VARCHAR(500);

-- Add columns to songperformance table
ALTER TABLE songperformance ADD COLUMN bandcamp_url VARCHAR(500);
ALTER TABLE songperformance ADD COLUMN nugs_url VARCHAR(500);

-- Create indexes for these URL columns for efficient lookups
CREATE INDEX idx_show_bandcamp_url ON show(bandcamp_url);
CREATE INDEX idx_show_nugs_url ON show(nugs_url);
CREATE INDEX idx_songperformance_bandcamp_url ON songperformance(bandcamp_url);
CREATE INDEX idx_songperformance_nugs_url ON songperformance(nugs_url);
