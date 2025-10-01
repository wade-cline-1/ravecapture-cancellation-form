/*
  # Add Education CTA Tracking to Analytics

  1. Changes
    - Update get_retention_reason function to handle education CTAs
    - Add latest_education_event CTE to view
    - Include education CTA type in view output
    - Update outcome_reason logic for education exits

  2. New Columns
    - education_cta_type: Shows the specific CTA clicked during education
    - Updated outcome_reason values:
      - education_exit_call: User scheduled a call
      - education_exit_email: User requested email follow-up
      - education_exit: Default education exit

  3. Performance
    - Add index on education events created_at
    - Optimize CTE for latest education event
*/

-- Add index for education event sorting
CREATE INDEX IF NOT EXISTS idx_education_events_created_at 
  ON cancellation_education_events(created_at DESC NULLS LAST);

-- Update retention reason function to handle education CTAs
CREATE OR REPLACE FUNCTION get_retention_reason(
  status submission_status,
  current_step step_type,
  offer_accepted boolean,
  education_cta_type text DEFAULT NULL
) RETURNS text AS $$
BEGIN
  IF status = 'retained' THEN
    IF offer_accepted IS TRUE THEN
      RETURN 'retention_offer';
    ELSIF current_step = 'education' THEN
      -- Return specific education exit reasons based on CTA
      CASE education_cta_type
        WHEN 'schedule_call' THEN RETURN 'education_exit_call';
        WHEN 'connect_email' THEN RETURN 'education_exit_email';
        ELSE RETURN 'education_exit';
      END CASE;
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

-- Update view to include education CTA information
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
  e.education_event_at
FROM 
  cancellation_submissions s
  LEFT JOIN cancellation_feedback f ON s.id = f.submission_id
  LEFT JOIN latest_offer_response o ON s.id = o.submission_id
  LEFT JOIN latest_future_plans p ON s.id = p.submission_id
  LEFT JOIN latest_education_event e ON s.id = e.flow_id;

-- Update view comment with new columns and example queries
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

-- Previous example queries still work...

Note: This view inherits RLS policies from the underlying tables. Access control is managed through the RLS policies on cancellation_submissions, cancellation_feedback, and cancellation_retention tables.

View Implementation Details:
- Uses separate CTEs to handle offer responses, future plans, and education events
- Selects latest education CTA click based on created_at
- Updates outcome_reason to include specific education exit types
- Includes education_step, education_cta_type, and education_event_at columns
- Maintains all existing optimizations and security policies';