CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declining')),
  dietary TEXT NOT NULL DEFAULT '',
  song TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
