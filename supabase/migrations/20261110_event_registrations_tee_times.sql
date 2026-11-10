-- Add preferred_tee_times field to event_registrations
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS preferred_tee_times text;
