/*
  # Add Education Events Tracking

  1. New Table
    - `cancellation_education_events`
      - Tracks user interactions with education steps
      - Records CTA clicks and types
      - Links to cancellation_submissions via flow_id

  2. Columns
    - id (uuid, primary key)
    - flow_id (uuid, references cancellation_submissions)
    - step_type (text)
    - action (text)
    - cta_type (text, nullable)
    - link_url (text, nullable)
    - created_at (timestamptz)

  3. Security
    - Enable RLS
    - Add policies for public access (matching other tables)
    - Add appropriate indexes
*/

-- Create education events table
CREATE TABLE cancellation_education_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES cancellation_submissions(id) ON DELETE CASCADE,
  step_type text NOT NULL,
  action text NOT NULL,
  cta_type text,
  link_url text,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT check_action CHECK (
    action IN ('shown', 'cta_clicked', 'link_clicked')
  ),
  CONSTRAINT check_cta_type CHECK (
    cta_type IN (
      'schedule_call',
      'connect_email', 
      'continue_canceling',
      'show_feature',
      'talk_support'
    )
  )
);

-- Add helpful column comments
COMMENT ON COLUMN cancellation_education_events.cta_type IS 
  'Type of CTA clicked during education step. Valid values: schedule_call, connect_email, continue_canceling, show_feature, talk_support. NULL for non-CTA events.';

COMMENT ON COLUMN cancellation_education_events.action IS
  'Type of event. Values: shown (step displayed), cta_clicked (button clicked), link_clicked (resource link clicked)';

-- Add indexes for performance
CREATE INDEX idx_education_events_flow_id 
  ON cancellation_education_events(flow_id);

CREATE INDEX idx_education_events_step_type 
  ON cancellation_education_events(step_type);

CREATE INDEX idx_education_events_action 
  ON cancellation_education_events(action);

CREATE INDEX idx_education_events_cta_type 
  ON cancellation_education_events(cta_type)
  WHERE cta_type IS NOT NULL;

-- Enable RLS
ALTER TABLE cancellation_education_events ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow public education event creation"
  ON cancellation_education_events FOR INSERT
  TO public
  WITH CHECK (EXISTS (
    SELECT 1 FROM cancellation_submissions
    WHERE id = flow_id
  ));

CREATE POLICY "Allow public education event viewing"
  ON cancellation_education_events FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM cancellation_submissions
    WHERE id = flow_id
  ));