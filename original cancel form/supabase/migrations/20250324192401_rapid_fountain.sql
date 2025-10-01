/*
  # Update Cancellation Journey Analysis View

  1. Changes
    - Modified view to use only the latest retention record per submission
    - Added WITH clause to select most recent retention record based on response_at
    - Added unique constraint on submission_id for feedback table
  
  2. Performance
    - Added index on response_at to optimize retention record selection
    - Added unique constraint to prevent duplicate feedback records
  
  3. Notes
    - Uses DISTINCT ON to ensure one row per submission
    - Orders retention records by response_at DESC to get most recent
*/

-- Add index for retention record sorting
CREATE INDEX IF NOT EXISTS idx_retention_response_at 
  ON cancellation_retention(response_at DESC NULLS LAST);

-- Add unique constraint to prevent duplicate feedback
ALTER TABLE cancellation_feedback
  ADD CONSTRAINT unique_submission_feedback UNIQUE (submission_id);

-- Recreate the view with latest retention record selection
CREATE OR REPLACE VIEW public.cancellation_journey_analysis AS
WITH latest_retention AS (
  SELECT DISTINCT ON (submission_id)
    id,
    submission_id,
    offer_shown_at,
    offer_type,
    offer_accepted,
    response_at,
    future_plan,
    competitor
  FROM cancellation_retention
  ORDER BY submission_id, response_at DESC NULLS LAST
)
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
  LEFT JOIN latest_retention r ON s.id = r.submission_id;

-- Update view comment with new information
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

Note: This view inherits RLS policies from the underlying tables. Access control is managed through the RLS policies on cancellation_submissions, cancellation_feedback, and cancellation_retention tables.

View Implementation Details:
- Uses DISTINCT ON to select only the latest retention record per submission
- Orders retention records by response_at DESC (most recent first)
- Includes unique constraint on cancellation_feedback to prevent duplicates
- Optimized with index on retention.response_at';