-- Event registrations for all 3 Skramblehouse locations
-- Events: opening-weekend, baller-league, skramble-tour

CREATE TABLE IF NOT EXISTS event_registrations (
  id                       uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at               timestamptz DEFAULT now(),
  event_slug               text NOT NULL,  -- 'opening-weekend' | 'baller-league' | 'skramble-tour'
  location                 text NOT NULL,  -- 'west-side' | 'horsham' | 'kop'
  first_name               text NOT NULL,
  last_name                text NOT NULL,
  email                    text NOT NULL,
  phone                    text NOT NULL,
  ghin_number              text,
  estimated_handicap       text,
  division                 text,           -- opening-weekend only: 'hcp-20-plus' | 'hcp-under-20'
  teammate_first_name      text,
  teammate_last_name       text,
  teammate_ghin_number     text,
  teammate_estimated_hcp   text
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
-- No public read policies; service role reads all via admin API

GRANT ALL ON event_registrations TO service_role;
