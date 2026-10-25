-- Add teammate handicap fields to league_registrations
ALTER TABLE league_registrations
  ADD COLUMN IF NOT EXISTS teammate_ghin_number    text,
  ADD COLUMN IF NOT EXISTS teammate_estimated_hcp  text;
