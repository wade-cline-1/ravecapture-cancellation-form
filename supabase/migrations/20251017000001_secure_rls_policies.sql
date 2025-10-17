-- IMPROVED RLS POLICIES WITH PROPER SECURITY
-- This migration replaces the basic policies with more secure, restrictive ones
-- Note: For a cancellation form, we use server-side validation via service role
-- The anon key should have minimal direct access

-- ============================================================
-- DROP PERMISSIVE POLICIES
-- ============================================================

DROP POLICY IF EXISTS "Allow public insert cancellation_submissions" ON cancellation_submissions;
DROP POLICY IF EXISTS "Allow public update own cancellation_submissions" ON cancellation_submissions;
DROP POLICY IF EXISTS "Allow public select own cancellation_submissions" ON cancellation_submissions;

DROP POLICY IF EXISTS "Allow public insert cancellation_feedback" ON cancellation_feedback;
DROP POLICY IF EXISTS "Allow public update cancellation_feedback" ON cancellation_feedback;
DROP POLICY IF EXISTS "Allow public select cancellation_feedback" ON cancellation_feedback;

DROP POLICY IF EXISTS "Allow public insert cancellation_retention" ON cancellation_retention;
DROP POLICY IF EXISTS "Allow public update cancellation_retention" ON cancellation_retention;
DROP POLICY IF EXISTS "Allow public select cancellation_retention" ON cancellation_retention;

DROP POLICY IF EXISTS "Allow public insert cancellation_education_events" ON cancellation_education_events;
DROP POLICY IF EXISTS "Allow public select cancellation_education_events" ON cancellation_education_events;

-- ============================================================
-- RESTRICTIVE POLICIES - SERVER-SIDE ONLY ACCESS
-- ============================================================
-- For security, all database operations should go through your API routes
-- which use the service role key. Anonymous clients should NOT have direct
-- access to tables.

-- Block all anonymous access to submissions
CREATE POLICY "Block anon access to cancellation_submissions"
ON cancellation_submissions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block all anonymous access to feedback
CREATE POLICY "Block anon access to cancellation_feedback"
ON cancellation_feedback
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block all anonymous access to retention
CREATE POLICY "Block anon access to cancellation_retention"
ON cancellation_retention
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block all anonymous access to education events
CREATE POLICY "Block anon access to cancellation_education_events"
ON cancellation_education_events
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Email logs already blocked (from previous migration)

-- ============================================================
-- AUTHENTICATED USER POLICIES (if you add auth later)
-- ============================================================

-- If you implement user authentication in the future, you can add policies like:
-- 
-- CREATE POLICY "Authenticated users can view their own submissions"
-- ON cancellation_submissions
-- FOR SELECT
-- TO authenticated
-- USING (email = auth.jwt()->>'email');
--
-- For now, all access goes through API routes with service role key

-- ============================================================
-- VERIFICATION
-- ============================================================

-- To verify these policies are working:
-- 1. Try to query any table with the anon key - it should fail
-- 2. All operations should go through your /api/submissions endpoint
-- 3. Service role key (used in API routes) bypasses RLS

COMMENT ON POLICY "Block anon access to cancellation_submissions" ON cancellation_submissions IS 
  'All database access must go through API routes using service role key for security';

