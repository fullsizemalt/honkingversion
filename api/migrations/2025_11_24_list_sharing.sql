-- Migration: Add list sharing fields
ALTER TABLE userlist ADD COLUMN share_token TEXT;
ALTER TABLE userlist ADD COLUMN is_public BOOLEAN DEFAULT 1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_userlist_share_token ON userlist(share_token);
