CREATE TABLE IF NOT EXISTS roc_experience_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE roc_experience_signups ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roc_experience_signups' 
    AND policyname = 'service role only'
  ) THEN
    CREATE POLICY "service role only" ON roc_experience_signups FOR ALL USING (false);
  END IF;
END $$;

GRANT ALL ON roc_experience_signups TO service_role;
