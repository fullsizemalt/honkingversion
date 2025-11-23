-- Migration: Add comments, comment votes, and notifications

CREATE TABLE IF NOT EXISTS reviewcomment (
    id INTEGER PRIMARY KEY,
    vote_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER,
    body TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vote_id) REFERENCES vote(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (parent_id) REFERENCES reviewcomment(id)
);
CREATE INDEX IF NOT EXISTS idx_reviewcomment_vote_id ON reviewcomment (vote_id);
CREATE INDEX IF NOT EXISTS idx_reviewcomment_user_id ON reviewcomment (user_id);
CREATE INDEX IF NOT EXISTS idx_reviewcomment_parent_id ON reviewcomment (parent_id);

CREATE TABLE IF NOT EXISTS commentvote (
    id INTEGER PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_upvote BOOLEAN DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES reviewcomment(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    UNIQUE (comment_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_commentvote_comment_id ON commentvote (comment_id);
CREATE INDEX IF NOT EXISTS idx_commentvote_user_id ON commentvote (user_id);

CREATE TABLE IF NOT EXISTS notification (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    actor_id INTEGER,
    object_type TEXT NOT NULL,
    object_id INTEGER NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (actor_id) REFERENCES user(id)
);
CREATE INDEX IF NOT EXISTS idx_notification_user_id ON notification (user_id);
CREATE INDEX IF NOT EXISTS idx_notification_read_at ON notification (read_at);
