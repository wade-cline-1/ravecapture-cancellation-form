/*
  # Cancellation Flow Schema Implementation

  1. Core Tables
    - `cancellation_submissions`
      - Main table tracking all cancellation attempts
      - Records basic info and status from the start
      - Captures partial submissions
    
    - `cancellation_feedback`
      - Stores detailed feedback and reasons
      - Links to submissions via foreign key
      - Allows updating as user progresses
    
    - `cancellation_retention`
      - Tracks retention offer interactions
      - Records offer acceptance/rejection
      - Stores timing information

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
    - Allow anonymous submissions
    - Protect sensitive data

  3. Features
    - Automatic timestamps
    - Status tracking
    - Audit trail
    - Analytics support
*/

-- Create enum for submission status
CREATE TYPE submission_status AS ENUM (
  'started',
  'in_progress',
  'retained',
  'cancelled',
  'abandoned'
);

-- Create enum for step types
CREATE TYPE step_type AS ENUM (
  'feedback',
  'education',
  'retention',
  'future_plans',
  'confirmation'
);

-- Main submissions table
CREATE TABLE cancellation_submissions (
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
CREATE TABLE cancellation_feedback (
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
CREATE TABLE cancellation_retention (
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
CREATE INDEX idx_submissions_user_email ON cancellation_submissions(user_email);
CREATE INDEX idx_submissions_status ON cancellation_submissions(status);
CREATE INDEX idx_submissions_created_at ON cancellation_submissions(created_at);
CREATE INDEX idx_feedback_submission_id ON cancellation_feedback(submission_id);
CREATE INDEX idx_retention_submission_id ON cancellation_retention(submission_id);

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
CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON cancellation_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON cancellation_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_retention_updated_at
    BEFORE UPDATE ON cancellation_retention
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies

-- Submissions policies
CREATE POLICY "Allow anonymous submission creation"
    ON cancellation_submissions FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Users can view own submissions"
    ON cancellation_submissions FOR SELECT
    TO public
    USING (user_email = current_user);

CREATE POLICY "Users can update own submissions"
    ON cancellation_submissions FOR UPDATE
    TO public
    USING (user_email = current_user);

-- Feedback policies
CREATE POLICY "Allow feedback creation"
    ON cancellation_feedback FOR INSERT
    TO public
    WITH CHECK (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Users can view own feedback"
    ON cancellation_feedback FOR SELECT
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
        AND user_email = current_user
    ));

CREATE POLICY "Users can update own feedback"
    ON cancellation_feedback FOR UPDATE
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
        AND user_email = current_user
    ));

-- Retention policies
CREATE POLICY "Allow retention creation"
    ON cancellation_retention FOR INSERT
    TO public
    WITH CHECK (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Users can view own retention"
    ON cancellation_retention FOR SELECT
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
        AND user_email = current_user
    ));

CREATE POLICY "Users can update own retention"
    ON cancellation_retention FOR UPDATE
    TO public
    USING (EXISTS (
        SELECT 1 FROM cancellation_submissions
        WHERE id = submission_id
        AND user_email = current_user
    ));