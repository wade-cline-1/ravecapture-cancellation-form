-- RaveCapture Cancellation Form - Database Tables
-- This migration creates all the necessary tables for the cancellation form

-- Create cancellation_submissions table
CREATE TABLE IF NOT EXISTS cancellation_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT NOT NULL,
    "currentStep" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "completedAt" TIMESTAMP WITH TIME ZONE
);

-- Create cancellation_feedback table
CREATE TABLE IF NOT EXISTS cancellation_feedback (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "submissionId" TEXT NOT NULL,
    "cancellationReasons" TEXT NOT NULL,
    "specificIssues" TEXT,
    "additionalFeedback" TEXT,
    "futurePlans" TEXT,
    "competitorInfo" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "cancellation_feedback_submissionId_fkey" 
        FOREIGN KEY ("submissionId") 
        REFERENCES cancellation_submissions(id) 
        ON DELETE CASCADE
);

-- Create cancellation_retention table
CREATE TABLE IF NOT EXISTS cancellation_retention (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "submissionId" TEXT NOT NULL,
    "offerPresented" BOOLEAN NOT NULL DEFAULT false,
    "offerAccepted" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" INTEGER NOT NULL DEFAULT 50,
    "discountDuration" INTEGER NOT NULL DEFAULT 12,
    "presentedAt" TIMESTAMP WITH TIME ZONE,
    "acceptedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "cancellation_retention_submissionId_fkey" 
        FOREIGN KEY ("submissionId") 
        REFERENCES cancellation_submissions(id) 
        ON DELETE CASCADE
);

-- Create cancellation_education_events table
CREATE TABLE IF NOT EXISTS cancellation_education_events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "submissionId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "completedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "timeSpent" INTEGER,
    CONSTRAINT "cancellation_education_events_submissionId_fkey" 
        FOREIGN KEY ("submissionId") 
        REFERENCES cancellation_submissions(id) 
        ON DELETE CASCADE
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "submissionId" TEXT,
    "emailType" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "sentAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'sent',
    "errorMessage" TEXT
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "cancellation_feedback_submissionId_key" 
    ON cancellation_feedback("submissionId");

CREATE UNIQUE INDEX IF NOT EXISTS "cancellation_retention_submissionId_key" 
    ON cancellation_retention("submissionId");

-- Create updatedAt trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_cancellation_submissions_updated_at 
    BEFORE UPDATE ON cancellation_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancellation_feedback_updated_at 
    BEFORE UPDATE ON cancellation_feedback 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancellation_retention_updated_at 
    BEFORE UPDATE ON cancellation_retention 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
