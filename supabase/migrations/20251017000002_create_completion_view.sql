-- Create Completion Master View
-- This view provides a simple overview of all users who completed the cancellation flow
-- with their outcomes, making it easy to query and analyze completion data
--
-- Note: This initial version had a security issue (SECURITY DEFINER)
-- Fixed in migration 20251017000003_fix_completion_view_security.sql

CREATE OR REPLACE VIEW completed_cancellations 
WITH (security_invoker = true)
AS
SELECT 
    -- User identification
    cs.email,
    cs.id AS submission_id,
    
    -- Cancellation details
    COALESCE(
        cf."cancellationReasons"::jsonb->0->>0,
        'Unknown'
    ) AS cancellation_reason,
    
    -- Education path taken (if any)
    CASE 
        WHEN cs."currentStep" LIKE 'review_optimization%' THEN 'review_optimization'
        WHEN cs."currentStep" LIKE 'poor_experience%' THEN 'poor_experience'
        WHEN cs."currentStep" = 'technical_issues_confirmation' THEN 'technical_issues'
        WHEN cs."currentStep" = 'retail_syndication_confirmation' THEN 'retail_syndication'
        WHEN cs."currentStep" = 'confirmation' THEN 'none'
        ELSE 'other'
    END AS education_path,
    
    -- Retention offer details
    COALESCE(cr."offerPresented", false) AS retention_offered,
    COALESCE(cr."offerAccepted", false) AS retention_accepted,
    
    -- Final outcome
    CASE 
        WHEN cr."offerAccepted" = true THEN 'retained'
        WHEN cr."offerPresented" = true AND cr."offerAccepted" = false THEN 'cancelled'
        WHEN cs."currentStep" IN (
            'review_optimization_email_confirmation',
            'poor_experience_email_confirmation', 
            'retail_syndication_confirmation',
            'technical_issues_confirmation'
        ) THEN 'cancelled'
        WHEN cs."currentStep" = 'confirmation' AND cr."offerPresented" IS NULL THEN 'cancelled'
        ELSE 'in_progress'
    END AS final_outcome,
    
    -- Timestamps
    cs."updatedAt" AS completed_at,
    
    -- Current step (for reference)
    cs."currentStep" AS current_step,
    
    -- Additional useful fields
    cs."createdAt" AS started_at,
    cf."specificIssues",
    cf."additionalFeedback"

FROM cancellation_submissions cs
LEFT JOIN cancellation_feedback cf ON cs.id = cf."submissionId"
LEFT JOIN cancellation_retention cr ON cs.id = cr."submissionId"

-- Only include completed flows (terminal steps OR retention step with a response)
WHERE (
    cs."currentStep" IN (
        'confirmation',
        'review_optimization_email_confirmation',
        'poor_experience_email_confirmation',
        'retail_syndication_confirmation',
        'technical_issues_confirmation'
    )
    OR (
        -- Also include retention step if they've responded to the offer
        cs."currentStep" = 'retention' 
        AND cr."offerPresented" = true
    )
)

ORDER BY cs."updatedAt" DESC;

-- Add comment explaining the view
COMMENT ON VIEW completed_cancellations IS 
    'Master completion view - use service role key to query. Shows: email, cancellation_reason, education_path, retention_offered, retention_accepted, final_outcome, completed_at, and additional feedback.';

