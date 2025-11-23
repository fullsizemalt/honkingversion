-- Migration: Add indexes for discovery features
-- Index on venue name for fast venue lookups
CREATE INDEX IF NOT EXISTS idx_show_venue ON show (venue);
-- Index on location (city/state/country) for geographic queries
CREATE INDEX IF NOT EXISTS idx_show_location ON show (location);
-- Index on date for temporal queries
CREATE INDEX IF NOT EXISTS idx_show_date ON show (date);

-- Optional: materialized view for venue performance stats (PostgreSQL syntax, adjust for SQLite if needed)
-- For SQLite, you can create a regular view
CREATE VIEW IF NOT EXISTS venue_performance_stats AS
SELECT
    venue,
    COUNT(*) AS show_count,
    SUM(CASE WHEN votes.rating IS NOT NULL THEN 1 ELSE 0 END) AS vote_count,
    AVG(votes.rating) AS avg_rating
FROM show
LEFT JOIN vote ON vote.show_id = show.id
GROUP BY venue;
