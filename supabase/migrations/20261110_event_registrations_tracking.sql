-- Add membership status + campaign attribution to event_registrations
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS membership_status text,          -- 'member' | 'non_member'
  ADD COLUMN IF NOT EXISTS utm_source        text,
  ADD COLUMN IF NOT EXISTS utm_medium        text,
  ADD COLUMN IF NOT EXISTS utm_campaign      text,
  ADD COLUMN IF NOT EXISTS utm_content       text,
  ADD COLUMN IF NOT EXISTS utm_term          text,
  ADD COLUMN IF NOT EXISTS fbclid            text;
