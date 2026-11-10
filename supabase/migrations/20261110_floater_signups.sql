-- Floater membership signups
-- Limited to 50 paid slots; paid status managed via admin

CREATE TABLE IF NOT EXISTS floater_signups (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   timestamptz DEFAULT now(),
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  email        text NOT NULL UNIQUE,
  phone        text NOT NULL,
  paid         boolean NOT NULL DEFAULT false,
  paid_at      timestamptz
);

ALTER TABLE floater_signups ENABLE ROW LEVEL SECURITY;
-- No public read policies; service role reads all via admin API

GRANT ALL ON floater_signups TO service_role;
