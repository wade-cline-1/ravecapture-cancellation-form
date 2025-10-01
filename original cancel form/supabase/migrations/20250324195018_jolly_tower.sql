/*
  # Add Technical Issue Description to Analysis View

  1. Changes
    - Add technical_issue_description column to cancellation_journey_analysis view
    - Preserve all existing functionality and optimizations
    - Maintain existing CTEs and join structure
    - Keep all existing indexes and constraints

  2. Performance
    - No new indexes needed as we're using existing table structure
    - Maintains optimal query performance with existing indexes
*/

-- Update the view to include technical issue description while preserving column order
CREATE OR REPLACE VIEW public.cancellation_journey_analysis AS
WITH latest_offer_response AS (
  -- Get the latest offer response
  SELECT DISTINCT ON (submission_id)
    submission_id,
    offer_accepted,
    offer_shown_at,
    offer_type,
    response_at
  FROM cancellation_retention
  WHERE offer_accepted IS NOT NULL
  ORDER BY submission_id, response_at DESC NULLS LAST
),
latest_future_plans AS (
  -- Get the latest future plans
  SELECT DISTINCT ON (submission_id)
    submission_id,
    future_plan,
    competitor
  FROM cancellation_retention
  WHERE future_plan IS NOT NULL OR competitor IS NOT NULL
  ORDER BY submission_id, response_at DESC NULLS LAST
)
SELECT 
  s.id as submission_id,
  s.user_email,
  s.status,
  s.current_step,
  get_retention_reason(s.status, s.current_step, o.offer_accepted) as outcome_reason,
  f.reasons,
  o.offer_accepted,
  p.future_plan,
  p.competitor,
  s.started_at,
  s.completed_at,
  s.last_activity_at,
  CASE 
    WHEN s.status = 'in_progress' AND s.last_activity_at < NOW() - INTERVAL '24 hours' 
    THEN true 
    ELSE false 
  END as potentially_abandoned,
  f.technical_issue_description
FROM 
  cancellation_submissions s
  LEFT JOIN cancellation_feedback f ON s.id = f.submission_id
  LEFT JOIN latest_offer_response o ON s.id = o.submission_id
  LEFT JOIN latest_future_plans p ON s.id = p.submission_id;

-- Update view comment with new column information and example queries
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

-- Get technical issues reported
SELECT 
  submission_id,
  user_email,
  technical_issue_description,
  started_at
FROM cancellation_journey_analysis
WHERE technical_issue_description IS NOT NULL
ORDER BY started_at DESC;

Note: This view inherits RLS policies from the underlying tables. Access control is managed through the RLS policies on cancellation_submissions, cancellation_feedback, and cancellation_retention tables.

View Implementation Details:
- Uses separate CTEs to handle offer responses and future plans independently
- Selects latest offer_accepted based on response_at
- Selects latest future_plan/competitor based on response_at
- Includes technical_issue_description from cancellation_feedback
- Maintains all existing indexes and optimizations
- Preserves unique constraint on cancellation_feedback
- Optimized for NULL handling in retention records';