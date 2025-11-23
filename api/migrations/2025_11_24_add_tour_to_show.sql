-- Migration: Add tour column to show
ALTER TABLE show ADD COLUMN tour TEXT;
CREATE INDEX IF NOT EXISTS idx_show_tour ON show(tour);
