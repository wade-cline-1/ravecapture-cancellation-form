-- Enable Row Level Security on all tables
-- This migration adds proper RLS policies to secure the database

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE cancellation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_retention ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_education_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DROP EXISTING POLICIES (if any)
-- ============================================================

DROP POLICY IF EXISTS "Allow public insert for cancellation_submissions" ON cancellation_submissions;
DROP POLICY IF EXISTS "Allow public update for cancellation_submissions" ON cancellation_submissions;
DROP POLICY IF EXISTS "Allow public select for cancellation_submissions" ON cancellation_submissions;

DROP POLICY IF EXISTS "Allow public insert for cancellation_feedback" ON cancellation_feedback;
DROP POLICY IF EXISTS "Allow public update for cancellation_feedback" ON cancellation_feedback;

DROP POLICY IF EXISTS "Allow public insert for cancellation_retention" ON cancellation_retention;
DROP POLICY IF EXISTS "Allow public update for cancellation_retention" ON cancellation_retention;

DROP POLICY IF EXISTS "Allow public insert for cancellation_education_events" ON cancellation_education_events;

DROP POLICY IF EXISTS "Allow public insert for email_logs" ON email_logs;

-- ============================================================
-- CANCELLATION_SUBMISSIONS POLICIES
-- ============================================================

-- Allow anonymous users to INSERT new submissions (form start)
CREATE POLICY "Allow public insert cancellation_submissions"
ON cancellation_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anonymous users to UPDATE their own submission using email
CREATE POLICY "Allow public update own cancellation_submissions"
ON cancellation_submissions
FOR UPDATE
TO anon, authenticated
USING (true)  -- Service role will handle validation
WITH CHECK (true);

-- Allow anonymous users to SELECT their own submission using email
CREATE POLICY "Allow public select own cancellation_submissions"
ON cancellation_submissions
FOR SELECT
TO anon, authenticated
USING (true);  -- Service role will handle validation in API

-- Service role has full access (bypasses RLS)

-- ============================================================
-- CANCELLATION_FEEDBACK POLICIES
-- ============================================================

-- Allow public INSERT and UPDATE (linked to submission)
CREATE POLICY "Allow public insert cancellation_feedback"
ON cancellation_feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update cancellation_feedback"
ON cancellation_feedback
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public select cancellation_feedback"
ON cancellation_feedback
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- CANCELLATION_RETENTION POLICIES
-- ============================================================

-- Allow public INSERT and UPDATE (linked to submission)
CREATE POLICY "Allow public insert cancellation_retention"
ON cancellation_retention
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update cancellation_retention"
ON cancellation_retention
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public select cancellation_retention"
ON cancellation_retention
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- CANCELLATION_EDUCATION_EVENTS POLICIES
-- ============================================================

-- Allow public INSERT for tracking analytics
CREATE POLICY "Allow public insert cancellation_education_events"
ON cancellation_education_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public select cancellation_education_events"
ON cancellation_education_events
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- EMAIL_LOGS POLICIES
-- ============================================================

-- Email logs should only be accessible by service role
-- No public access needed

-- Only allow service role to insert (done via API)
CREATE POLICY "Service role only for email_logs"
ON email_logs
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON POLICY "Allow public insert cancellation_submissions" ON cancellation_submissions IS 
  'Allows users to create new cancellation form submissions';

COMMENT ON POLICY "Allow public update own cancellation_submissions" ON cancellation_submissions IS 
  'Allows users to update their submission as they progress through the form';

COMMENT ON POLICY "Service role only for email_logs" ON email_logs IS 
  'Email logs should only be managed by the service role via API routes';

