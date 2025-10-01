-- Add unique index for email idempotency
-- This prevents duplicate emails from being sent on refresh/back button

CREATE UNIQUE INDEX IF NOT EXISTS email_logs_submission_emailtype_uniq
ON email_logs ("submissionId", "emailType")
WHERE "emailType" IS NOT NULL;
