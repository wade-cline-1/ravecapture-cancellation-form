/*
  # Cancellation Journey Analytics

  1. New Views and Functions
    - Helper function for determining retention reasons
    - View for analyzing cancellation journeys and outcomes
  
  2. Performance
    - Added indexes on commonly queried columns
    - Uses efficient joins and computed columns
    
  3. Security
    - Relies on underlying table RLS policies
*/

-- Create helper function to determine retention reason
CREATE OR REPLACE FUNCTION get_retention_reason(
  status submission_status,
  current_step step_type,
  offer_accepted boolean
) RETURNS text AS $$
BEGIN
  IF status = 'retained' THEN
    IF offer_accepted IS TRUE THEN
      RETURN 'retention_offer';
    ELSIF current_step = 'education' THEN
      RETURN 'education_exit';
    ELSE
      RETURN 'other_retention';
    END IF;
  ELSIF status = 'cancelled' THEN
    RETURN 'cancelled';
  ELSIF status = 'in_progress' THEN
    RETURN 'in_progress';
  ELSIF status = 'abandoned' THEN
    RETURN 'abandoned';
  ELSE
    RETURN 'unknown';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add indexes on base tables to improve view performance
CREATE INDEX IF NOT EXISTS idx_submissions_completed_at 
  ON cancellation_submissions(completed_at);

CREATE INDEX IF NOT EXISTS idx_submissions_last_activity 
  ON cancellation_submissions(last_activity_at);

CREATE INDEX IF NOT EXISTS idx_retention_offer_accepted 
  ON cancellation_retention(offer_accepted);

-- Create view for cancellation journey analysis
CREATE OR REPLACE VIEW public.cancellation_journey_analysis AS
SELECT 
  s.id as submission_id,
  s.user_email,
  s.status,
  s.current_step,
  get_retention_reason(s.status, s.current_step, r.offer_accepted) as outcome_reason,
  f.reasons,
  r.offer_accepted,
  r.future_plan,
  r.competitor,
  s.started_at,
  s.completed_at,
  s.last_activity_at,
  CASE 
    WHEN s.status = 'in_progress' AND s.last_activity_at < NOW() - INTERVAL '24 hours' 
    THEN true 
    ELSE false 
  END as potentially_abandoned
FROM 
  cancellation_submissions s
  LEFT JOIN cancellation_feedback f ON s.id = f.submission_id
  LEFT JOIN cancellation_retention r ON s.id = r.submission_id;

-- Add helpful comment with example queries
COMMENT ON VIEW public.cancellation_journey_analysis IS 'Common queries:

-- Get cancellations from last 30 days
SELECT * FROM cancellation_journey_analysis
WHERE status = ''cancelled''
AND started_at >= NOW() - INTERVAL ''30 days''
ORDER BY started_at DESC;

-- Get retention breakdown
SELECT 
  outcome_reason,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM cancellation_journey_analysis
WHERE status IN (''retained'', ''cancelled'')
AND started_at >= NOW() - INTERVAL ''30 days''
GROUP BY outcome_reason
ORDER BY total DESC;

-- Get top cancellation reasons
SELECT 
  unnest(reasons) as reason,
  COUNT(*) as total
FROM cancellation_journey_analysis
WHERE status = ''cancelled''
AND started_at >= NOW() - INTERVAL ''30 days''
GROUP BY reason
ORDER BY total DESC;

-- Find potentially abandoned flows
SELECT *
FROM cancellation_journey_analysis
WHERE potentially_abandoned = true
AND status = ''in_progress''
ORDER BY last_activity_at ASC;

Note: This view inherits RLS policies from the underlying tables. Access control is managed through the RLS policies on cancellation_submissions, cancellation_feedback, and cancellation_retention tables.';