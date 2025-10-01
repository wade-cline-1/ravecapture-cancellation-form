/*
  # Fix cancellation flow schema

  1. Changes
    - Add existence checks for enum types
    - Create tables if they don't exist
    - Set up RLS policies
    - Add indexes for performance
    - Create triggers for updated_at columns

  2. Security
    - Enable RLS on all tables
    - Add policies for public access
    - Ensure data integrity with foreign keys
*/

-- Create enums if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM (
      'started',
      'in_progress',
      'retained',
      'cancelled',
      'abandoned'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'step_type') THEN
    CREATE TYPE step_type AS ENUM (
      'feedback',
      'education',
      'retention',
      'future_plans',
      'confirmation'
    );
  END IF;
END $$;

-- Main submissions table
CREATE TABLE IF NOT EXISTS cancellation_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  current_step step_type NOT NULL DEFAULT 'feedback',
  status submission_status NOT NULL DEFAULT 'started',
  started_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Feedback details table
CREATE TABLE IF NOT EXISTS cancellation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES cancellation_submissions(id) ON DELETE CASCADE,
  reasons text[] NOT NULL DEFAULT '{}',
  missing_features text[] DEFAULT '{}',
  feedback_text text,
  technical_issue_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Retention tracking table
CREATE TABLE IF NOT EXISTS cancellation_retention (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES cancellation_submissions(id) ON DELETE CASCADE,
  offer_shown_at timestamptz,
  offer_type text NOT NULL DEFAULT '50_percent_discount',
  offer_accepted boolean,
  response_at timestamptz,
  future_plan text,
  competitor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_email ON cancellation_submissions(user_email);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON cancellation_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON cancellation_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_submission_id ON cancellation_feedback(submission_id);
CREATE INDEX IF NOT EXISTS idx_retention_submission_id ON cancellation_retention(submission_id);

-- Enable RLS
ALTER TABLE cancellation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_retention ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_submissions_updated_at ON cancellation_submissions;
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON cancellation_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON cancellation_feedback;
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON cancellation_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_retention_updated_at ON cancellation_retention;
CREATE TRIGGER update_retention_updated_at
    BEFORE UPDATE ON cancellation_retention
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public submission creation" ON cancellation_submissions;
  DROP POLICY IF EXISTS "Allow public submission viewing" ON cancellation_submissions;
  DROP POLICY IF EXISTS "Allow public submission updates" ON cancellation_submissions;
  DROP POLICY IF EXISTS "Allow public feedback creation" ON cancellation_feedback;
  DROP POLICY IF EXISTS "Allow public feedback viewing" ON cancellation_feedback;
  DROP POLICY IF EXISTS "Allow public feedback updates" ON cancellation_feedback;
  DROP POLICY IF EXISTS "Allow public retention creation" ON cancellation_retention;
  DROP POLICY IF EXISTS "Allow public retention viewing" ON cancellation_retention;
  DROP POLICY IF EXISTS "Allow public retention updates" ON cancellation_retention;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add RLS policies

-- Submissions policies
CREATE POLICY "Allow public submission creation"
    ON cancellation_submissions FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public submission viewing"
    ON cancellation_submissions FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public submission updates"
    ON cancellation_submissions FOR UPDATE
    TO public
    USING (true);

-- Feedback policies
CREATE POLICY "Allow public feedback creation"
    ON cancellation_feedback FOR INSERT
    TO public
    WITH CHECK (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Allow public feedback viewing"
    ON cancellation_feedback FOR SELECT
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Allow public feedback updates"
    ON cancellation_feedback FOR UPDATE
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

-- Retention policies
CREATE POLICY "Allow public retention creation"
    ON cancellation_retention FOR INSERT
    TO public
    WITH CHECK (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Allow public retention viewing"
    ON cancellation_retention FOR SELECT
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Allow public retention updates"
    ON cancellation_retention FOR UPDATE
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));