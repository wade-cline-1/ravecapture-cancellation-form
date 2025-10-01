/*
  # Initial Cancellation Flow Schema

  1. New Tables
    - `cancellation_flows`
      - Core table for tracking cancellation sessions
      - Stores user feedback, reasons, and flow progress
      - Includes retention offer tracking
      - Has status tracking and timestamps
    
    - `cancellation_education_events`
      - Tracks user engagement with educational content
      - Records step interactions and link clicks
      - Connected to cancellation_flows via flow_id
    
    - `cancellation_events`
      - Audit log for cancellation flow events
      - Stores event type and structured data
      - Used for analytics and tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Allow public insertion for initial flow creation
    - Restrict updates to own records only

  3. Performance
    - Add indexes on frequently queried columns
    - Add constraints for data integrity
    - Include timestamp tracking for all events
*/

-- Create cancellation_flows table
CREATE TABLE IF NOT EXISTS cancellation_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  feedback_reasons text[] NOT NULL,
  feedback_comment text,
  selected_features text[],
  future_plan text,
  competitor text,
  technical_issue_description text,
  technical_issue_reported_at timestamptz,
  retention_offer_shown_at timestamptz,
  retention_offer_accepted boolean,
  retention_offer_response_at timestamptz,
  status text DEFAULT 'in_progress',
  updated_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now()
);

-- Add constraints to cancellation_flows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_status'
  ) THEN
    ALTER TABLE cancellation_flows 
      ADD CONSTRAINT check_status 
      CHECK (status IN ('in_progress', 'retained', 'cancelled'));
  END IF;
END $$;

-- Add indexes to cancellation_flows
CREATE INDEX IF NOT EXISTS idx_cancellation_flows_user_email ON cancellation_flows(user_email);
CREATE INDEX IF NOT EXISTS idx_cancellation_flows_status ON cancellation_flows(status);
CREATE INDEX IF NOT EXISTS idx_cancellation_flows_started_at ON cancellation_flows(started_at DESC);

-- Enable RLS on cancellation_flows
ALTER TABLE cancellation_flows ENABLE ROW LEVEL SECURITY;

-- Create cancellation_education_events table
CREATE TABLE IF NOT EXISTS cancellation_education_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES cancellation_flows(id),
  step_type text NOT NULL,
  action text NOT NULL,
  link_url text,
  created_at timestamptz DEFAULT now()
);

-- Add constraints to cancellation_education_events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_action'
  ) THEN
    ALTER TABLE cancellation_education_events
      ADD CONSTRAINT check_action
      CHECK (action IN ('shown', 'accepted', 'declined', 'link_clicked'));
  END IF;
END $$;

-- Add indexes to cancellation_education_events
CREATE INDEX IF NOT EXISTS idx_education_events_flow_id ON cancellation_education_events(flow_id);
CREATE INDEX IF NOT EXISTS idx_education_events_step_type ON cancellation_education_events(step_type);

-- Enable RLS on cancellation_education_events
ALTER TABLE cancellation_education_events ENABLE ROW LEVEL SECURITY;

-- Create cancellation_events table
CREATE TABLE IF NOT EXISTS cancellation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add constraints to cancellation_events
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_event_type'
  ) THEN
    ALTER TABLE cancellation_events
      ADD CONSTRAINT check_event_type
      CHECK (event_type = 'cancellation_flow');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_event_data_structure'
  ) THEN
    ALTER TABLE cancellation_events
      ADD CONSTRAINT check_event_data_structure
      CHECK (
        jsonb_typeof(event_data) = 'object'
        AND event_data ? 'final_status'
        AND jsonb_typeof(event_data->'final_status') = 'string'
        AND event_data->>'final_status' = ANY (ARRAY['retained', 'cancelled', 'in_progress'])
      );
  END IF;
END $$;

-- Add indexes to cancellation_events
CREATE INDEX IF NOT EXISTS idx_cancellation_events_user_email ON cancellation_events(user_email);
CREATE INDEX IF NOT EXISTS idx_cancellation_events_event_type ON cancellation_events(event_type);
CREATE INDEX IF NOT EXISTS idx_cancellation_events_created_at ON cancellation_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cancellation_events_final_status ON cancellation_events((event_data->>'final_status'));

-- Enable RLS on cancellation_events
ALTER TABLE cancellation_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  -- cancellation_flows policies
  DROP POLICY IF EXISTS "Users can read their own events" ON cancellation_flows;
  DROP POLICY IF EXISTS "Allow public event creation" ON cancellation_flows;
  DROP POLICY IF EXISTS "Users can update their own events" ON cancellation_flows;
  
  -- cancellation_education_events policies
  DROP POLICY IF EXISTS "Users can read their own education events" ON cancellation_education_events;
  DROP POLICY IF EXISTS "Allow public education event creation" ON cancellation_education_events;
  
  -- cancellation_events policies
  DROP POLICY IF EXISTS "Users can read their own events" ON cancellation_events;
  DROP POLICY IF EXISTS "Allow public event creation" ON cancellation_events;
  DROP POLICY IF EXISTS "Users can update their own events" ON cancellation_events;
END $$;

-- Add RLS policies for cancellation_flows
CREATE POLICY "Users can read their own events"
  ON cancellation_flows
  FOR SELECT
  TO authenticated
  USING (user_email = CURRENT_USER);

CREATE POLICY "Allow public event creation"
  ON cancellation_flows
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own events"
  ON cancellation_flows
  FOR UPDATE
  TO public
  USING (user_email = CURRENT_USER)
  WITH CHECK (user_email = CURRENT_USER);

-- Add RLS policies for cancellation_education_events
CREATE POLICY "Users can read their own education events"
  ON cancellation_education_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cancellation_flows
    WHERE id = cancellation_education_events.flow_id
    AND user_email = CURRENT_USER
  ));

CREATE POLICY "Allow public education event creation"
  ON cancellation_education_events
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add RLS policies for cancellation_events
CREATE POLICY "Users can read their own events"
  ON cancellation_events
  FOR SELECT
  TO authenticated
  USING (user_email = CURRENT_USER);

CREATE POLICY "Allow public event creation"
  ON cancellation_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own events"
  ON cancellation_events
  FOR UPDATE
  TO public
  USING (user_email = CURRENT_USER)
  WITH CHECK (user_email = CURRENT_USER);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to cancellation_flows
DROP TRIGGER IF EXISTS update_cancellation_flows_updated_at ON cancellation_flows;
CREATE TRIGGER update_cancellation_flows_updated_at
    BEFORE UPDATE ON cancellation_flows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();