/*
  # Add feedback text column to journey analysis view

  1. Changes
    - Add feedback_text column to cancellation_journey_analysis view
    - Preserve all existing columns and their order
    - Maintain all CTEs and optimizations
    - Update example queries to demonstrate feedback text usage

  2. Implementation Details
    - Uses existing feedback_text from cancellation_feedback table
    - Maintains all existing indexes and performance optimizations
    - Preserves RLS policies and security settings
*/

-- Update view to include feedback text while maintaining column order
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
),
latest_education_event AS (
  -- Get the latest education CTA click
  SELECT DISTINCT ON (flow_id)
    flow_id,
    step_type as education_step,
    cta_type as education_cta_type,
    created_at as education_event_at
  FROM cancellation_education_events
  WHERE action = 'cta_clicked'
  ORDER BY flow_id, created_at DESC NULLS LAST
)
SELECT 
  s.id as submission_id,
  s.user_email,
  s.status,
  s.current_step,
  get_retention_reason(
    s.status, 
    s.current_step, 
    o.offer_accepted,
    e.education_cta_type
  ) as outcome_reason,
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
  f.technical_issue_description,
  e.education_step,
  e.education_cta_type,
  e.education_event_at,
  f.feedback_text
FROM 
  cancellation_submissions s
  LEFT JOIN cancellation_feedback f ON s.id = f.submission_id
  LEFT JOIN latest_offer_response o ON s.id = o.submission_id
  LEFT JOIN latest_future_plans p ON s.id = p.submission_id
  LEFT JOIN latest_education_event e ON s.id = e.flow_id;

-- Update view comment with new example queries
COMMENT ON VIEW public.cancellation_journey_analysis IS 'Common queries:

-- Get education exit breakdown
SELECT 
  outcome_reason,
  education_cta_type,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM cancellation_journey_analysis
WHERE status = ''retained''
  AND outcome_reason LIKE ''education_exit%''
  AND started_at >= NOW() - INTERVAL ''30 days''
GROUP BY outcome_reason, education_cta_type
ORDER BY total DESC;

-- Get all education events with CTAs
SELECT 
  submission_id,
  user_email,
  education_step,
  education_cta_type,
  education_event_at,
  outcome_reason
FROM cancellation_journey_analysis
WHERE education_cta_type IS NOT NULL
ORDER BY education_event_at DESC;

-- Get cancellations with feedback from last 30 days
SELECT 
  submission_id,
  user_email,
  reasons,
  feedback_text,
  started_at
FROM cancellation_journey_analysis
WHERE status = ''cancelled''
  AND feedback_text IS NOT NULL
  AND started_at >= NOW() - INTERVAL ''30 days''
ORDER BY started_at DESC;

-- Get feedback text for specific cancellation reason
SELECT 
  submission_id,
  user_email,
  feedback_text,
  started_at
FROM cancellation_journey_analysis
WHERE status = ''cancelled''
  AND ''Missing Features'' = ANY(reasons)
  AND feedback_text IS NOT NULL
ORDER BY started_at DESC;

Note: This view inherits RLS policies from the underlying tables. Access control is managed through the RLS policies on cancellation_submissions, cancellation_feedback, and cancellation_retention tables.

View Implementation Details:
- Uses separate CTEs to handle offer responses, future plans, and education events
- Selects latest education CTA click based on created_at
- Updates outcome_reason to include specific education exit types
- Includes feedback_text from cancellation_feedback table
- Maintains all existing optimizations and security policies';