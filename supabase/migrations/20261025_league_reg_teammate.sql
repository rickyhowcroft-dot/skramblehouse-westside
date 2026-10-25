-- Add teammate fields to league_registrations
ALTER TABLE league_registrations
  ADD COLUMN IF NOT EXISTS teammate_first_name text,
  ADD COLUMN IF NOT EXISTS teammate_last_name  text;
