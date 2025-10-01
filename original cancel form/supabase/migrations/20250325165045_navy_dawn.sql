/*
  # Add IP-based Rate Limiting

  1. New Table
    - `submission_attempts`
      - Tracks submission attempts by IP address
      - Stores timestamps for rate limiting
      - Includes submission success status

  2. Security
    - Enable RLS
    - Add policies for public access
    - Add appropriate indexes

  3. Features
    - IP address tracking
    - Timestamp tracking
    - Attempt counting
*/

-- Create submission attempts table
CREATE TABLE submission_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  was_successful boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_submission_attempts_ip_address 
  ON submission_attempts(ip_address);

CREATE INDEX idx_submission_attempts_attempted_at 
  ON submission_attempts(attempted_at DESC);

CREATE INDEX idx_submission_attempts_ip_and_time 
  ON submission_attempts(ip_address, attempted_at DESC);

-- Enable RLS
ALTER TABLE submission_attempts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow public attempt creation"
  ON submission_attempts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public attempt viewing"
  ON submission_attempts FOR SELECT
  TO public
  USING (true);

-- Add helpful comment
COMMENT ON TABLE submission_attempts IS 
  'Tracks submission attempts by IP address for rate limiting purposes. Limits are enforced via edge function.';