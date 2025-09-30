-- CreateTable
CREATE TABLE "cancellation_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME
);

-- CreateTable
CREATE TABLE "cancellation_feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "cancellationReasons" TEXT NOT NULL,
    "specificIssues" TEXT,
    "additionalFeedback" TEXT,
    "futurePlans" TEXT,
    "competitorInfo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cancellation_feedback_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "cancellation_submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cancellation_retention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "offerPresented" BOOLEAN NOT NULL DEFAULT false,
    "offerAccepted" BOOLEAN NOT NULL DEFAULT false,
    "discountAmount" INTEGER NOT NULL DEFAULT 50,
    "discountDuration" INTEGER NOT NULL DEFAULT 12,
    "presentedAt" DATETIME,
    "acceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cancellation_retention_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "cancellation_submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cancellation_education_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER,
    CONSTRAINT "cancellation_education_events_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "cancellation_submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT,
    "emailType" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "errorMessage" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_feedback_submissionId_key" ON "cancellation_feedback"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_retention_submissionId_key" ON "cancellation_retention"("submissionId");
