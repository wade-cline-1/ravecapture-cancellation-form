# RaveCapture Cancellation Flow Simplification - Final Implementation Plan

## Overview
Transform the current multi-select, retention-heavy flow into a simplified single-select flow with terminal exits for support/consultation paths, matching the original wireframe.

## Core Changes (6 Key Areas)

### 1. Terminal Exits (No Retention After Confirmations)

**Problem:** Current app routes to `retention` even after terminal support/consultation confirmations, which pads the flow and muddies user intent.

**Solution:** Make support/consultation confirmations terminal endpoints.

**Terminal Steps:**
- `review_optimization_email_confirmation`
- `poor_experience_email_confirmation` 
- `technical_issues_confirmation`
- `retail_syndication_confirmation`
- Calendly outcomes (scheduled OR email alternative) → email confirmation terminal

**Implementation:**
```typescript
// File: src/components/CancellationForm.tsx
const TERMINAL_STEPS = new Set([
  'confirmation',
  'review_optimization_email_confirmation',
  'poor_experience_email_confirmation',
  'retail_syndication_confirmation', 
  'technical_issues_confirmation'
]);

function isTerminal(step: string): boolean {
  return TERMINAL_STEPS.has(step);
}

// In getNextStep() function:
case 'review_optimization_email_confirmation':
case 'poor_experience_email_confirmation':
case 'retail_syndication_confirmation':
case 'technical_issues_confirmation':
  return currentStep; // Terminal - stays on itself, no further navigation
```

**UI Changes:**
- Terminal screens show only "Return to Dashboard" button
- Remove all "Continue" buttons from terminal components
- Link: `https://app.ravecapture.com/dashboard`

### 2. Single-Select Reason (Radio Buttons)

**Problem:** Multi-select reasons explode branch combinations and complicate analytics.

**Solution:** Enforce exactly one primary reason selection.

**UI Changes:**
```typescript
// File: src/components/form-steps/FeedbackStep.tsx
// Change from checkboxes to radio buttons
const [selectedReason, setSelectedReason] = useState<string>('');

const handleReasonSelect = (reason: string) => {
  setSelectedReason(reason);
};

// Radio button implementation
<input
  type="radio"
  name="cancellationReason"
  value={reason}
  checked={selectedReason === reason}
  onChange={() => handleReasonSelect(reason)}
/>
```

**Server-side Validation:**
- Exactly one primary reason required
- If reason = "Something Else", require additional feedback text
- If reason = "Missing Features", allow max 2 regular sub-features + "Something else"
- Return 422 with clear message on validation failure

**Canonical Reason Taxonomy:**
- Not Getting Enough Reviews
- Too Expensive
- Not Seeing Enough Value
- Missing Features
- Technical Issues
- Poor Experience
- Only Needed Temporarily
- Something Else

### 3. Binary Progress UI

**Problem:** Current progress calculation includes all steps, showing misleading percentages on education branches.

**Solution:** Binary progress - 100% only on terminal steps, bar without percentage for others.

**Implementation:**
```typescript
// File: src/components/CancellationForm.tsx
export function getProgressDisplay(currentStep: string) {
  return isTerminal(currentStep)
    ? { showPercent: true, percent: 100 }
    : { showPercent: false, percent: undefined }; // bar without %
}

// Update ProgressBar component to handle showPercent
// File: src/components/ui/ProgressBar.tsx
export function ProgressBar({ percentage, showPercent }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="rc-progress-bar">
        <div 
          className="rc-progress-fill"
          style={{ width: `${percentage || 0}%` }}
        />
      </div>
      {showPercent && (
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600">
            {percentage}% Complete
          </span>
        </div>
      )}
    </div>
  )
}
```

### 4. Explicit Terminal Components

**Problem:** Returning `null` from routing is risky and can cause UI errors.

**Solution:** Always render terminal components, never return null.

**Implementation:**
```typescript
// File: src/components/CancellationForm.tsx
// Terminal steps stay on themselves
const getNextStep = (currentStep: string, data: FormData): string => {
  if (isTerminal(currentStep)) {
    return currentStep; // Terminal - no forward navigation
  }
  // ... rest of routing logic
}

// In renderCurrentStep(), terminal components render themselves
case 'review_optimization_email_confirmation':
  return <ReviewOptimizationEmailConfirmation data={formData} />
```

### 5. Reason Mapping at App Layer

**Problem:** Current production labels don't match original taxonomy.

**Solution:** Map production labels to canonical taxonomy at save and analytics emission.

**Implementation:**
```typescript
// File: src/lib/database.ts
const REASON_MAP = new Map<string, string>([
  ['found better alternative', 'Not Seeing Enough Value'],
  ['no longer needed', 'Only Needed Temporarily'],
  ['other', 'Something Else'],
]);

export const toCanonical = (reason: string): string => {
  return REASON_MAP.get(reason.trim().toLowerCase()) ?? reason;
};

// Apply mapping at save time
const canonicalReason = toCanonical(selectedReason);
```

### 6. Email Idempotency

**Problem:** Terminal confirmations can send duplicate emails on refresh/back button.

**Solution:** Use unique index on existing `email_logs` table to prevent duplicates.

**Database Migration:**
```sql
-- File: supabase/migrations/[timestamp]_add_email_idempotency.sql
CREATE UNIQUE INDEX IF NOT EXISTS email_logs_submission_emailtype_uniq
ON email_logs (submission_id, email_type);
```

**Implementation:**
```typescript
// File: src/app/api/send-email/route.ts
await db.tx(async (trx) => {
  try {
    await trx.insert('email_logs', {
      submission_id,
      email_type, // must uniquely identify the terminal email
      created_at: new Date().toISOString(),
    }); // unique index enforces at-most-once
    
    await sendEmail(...);
  } catch (e) {
    if (isUniqueViolation(e)) return; // already sent; skip
    throw e;
  }
});
```

## Files to Modify

### Core Logic Files
1. **`src/components/CancellationForm.tsx`**
   - Add `isTerminal()` helper function
   - Update `getNextStep()` to handle terminal steps
   - Update `getProgressDisplay()` for binary logic
   - Ensure no path from terminal steps to retention

2. **`src/components/form-steps/FeedbackStep.tsx`**
   - Change to radio buttons (single-select)
   - Update validation logic for single reason
   - Apply reason mapping on save
   - Enforce "Something Else" text requirement

3. **`src/components/ui/ProgressBar.tsx`**
   - Add `showPercent` prop support
   - Handle binary display logic

### Terminal Component Files
4. **`src/components/email-confirmation/ReviewOptimizationEmailConfirmation.tsx`**
   - Replace "Continue" with "Return to Dashboard"
   - Remove any retention routing

5. **`src/components/email-confirmation/PoorExperienceEmailConfirmation.tsx`**
   - Replace "Continue" with "Return to Dashboard"
   - Remove any retention routing

6. **`src/components/email-confirmation/RetailSyndicationConfirmationStep.tsx`**
   - Replace "Continue" with "Return to Dashboard"
   - Remove any retention routing

7. **`src/components/email-confirmation/TechnicalIssuesConfirmationStep.tsx`**
   - Replace "Continue" with "Return to Dashboard"
   - Remove any retention routing

### API Files
8. **`src/app/api/send-email/route.ts`**
   - Add unique index check before sending
   - Implement transaction-based idempotency

9. **`src/app/api/submissions/route.ts`**
   - Add server-side validation for single-select
   - Return 422 on validation failure
   - Apply reason mapping at save time

### Database Files
10. **`src/lib/database.ts`**
    - Add reason mapping functions
    - Add terminal event logging helpers

11. **`supabase/migrations/[timestamp]_add_email_idempotency.sql`**
    - Add unique index to email_logs table

## Feature Flag Implementation

**Environment Variable:**
```bash
NEXT_PUBLIC_SIMPLIFIED_FLOW=true
```

**Gating Logic:**
```typescript
// File: src/components/CancellationForm.tsx
const SIMPLIFIED_FLOW = process.env.NEXT_PUBLIC_SIMPLIFIED_FLOW === 'true';

if (SIMPLIFIED_FLOW) {
  // New terminal exit logic
  // New single-select logic
  // New progress logic
} else {
  // Current behavior (unchanged)
}
```

## Testing Requirements

### Blocked Path Tests
```typescript
const terminalSteps = [
  'review_optimization_email_confirmation',
  'poor_experience_email_confirmation',
  'technical_issues_confirmation',
  'retail_syndication_confirmation',
];

for (const step of terminalSteps) {
  expect(getNextStep(step)).toBe(step);         // stays on itself
  expect(getNextStep(step)).not.toBe('retention');
}
// No "Continue" buttons on any terminal component
```

### Validation Tests
- Single reason enforced (cannot select multiple)
- "Something Else" requires text
- If "Missing Features": max 2 regular + "Something else"

### Progress Tests
- Non-terminal: bar without %
- Terminal: 100%

### Idempotency Tests
- First arrival at terminal: insert succeeds; provider sends
- Refresh/back on terminal: unique violation triggers; no duplicate send

### Mapping Tests
- Inputs "Found Better Alternative" / "No Longer Needed" / "Other" are saved/emitted as canonical values

## Rollout & Rollback

**Deployment:**
- Ship with `NEXT_PUBLIC_SIMPLIFIED_FLOW=true`
- All new behavior gated behind flag

**Rollback:**
- Set `NEXT_PUBLIC_SIMPLIFIED_FLOW=false`
- No code changes, no migrations needed
- Instant revert to current behavior

## Success Criteria

✅ **Terminal exits:** No routing to retention from support/consultation confirmations  
✅ **Single-select:** Radio buttons enforce one reason selection  
✅ **Progress bar:** 100% only on terminal steps  
✅ **Idempotency:** No duplicate emails on refresh/back  
✅ **Feature flag:** Instant rollback capability  
✅ **Analytics:** Canonical reason taxonomy  
✅ **UI/UX:** "Return to Dashboard" buttons on terminal steps  

## Database Changes Summary

**Single SQL Migration:**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS email_logs_submission_emailtype_uniq
ON email_logs (submission_id, email_type);
```

**No schema changes to existing tables** - all existing columns remain unchanged.

## Implementation Order

1. Add feature flag and gating logic
2. Implement terminal step detection and routing
3. Update progress bar logic
4. Convert feedback step to single-select
5. Update terminal components with "Return to Dashboard"
6. Add reason mapping at save time
7. Implement email idempotency
8. Add server-side validation
9. Add database migration
10. Test all blocked paths and idempotency

**Total Files Modified:** 10 files  
**Database Changes:** 1 unique index  
**Breaking Changes:** None  
**Rollback Time:** < 1 minute (environment variable)




## **Phases of Development**

## Phase 1: Foundation & Feature Flag (Start Here)
Goal: Set up the infrastructure and feature flag without changing any behavior yet.
Phase 1 Tasks:
Add feature flag environment variable
Add terminal step detection helper
Add reason mapping functions
Create database migration for email idempotency
Why start here: This gives us the foundation without breaking anything, and we can test the feature flag works correctly.

## Phase 2: Terminal Exit Routing
Goal: Implement terminal exits without changing UI yet.
Phase 2 Tasks:
Update getNextStep() to handle terminal steps
Test that terminal steps don't route to retention
Verify feature flag gates the new behavior
Why this phase: This is the core logic change that everything else depends on.

## Phase 3: Progress Bar Logic
Goal: Implement binary progress display.
Phase 3 Tasks:
Update getProgressDisplay() function
Modify ProgressBar component to handle showPercent
Test progress shows correctly on terminal vs non-terminal steps
Why this phase: This is a visual change that's easy to test and doesn't affect functionality.


## Phase 4: Single-Select Feedback
Goal: Convert feedback step to single-select.
Phase 4 Tasks:
Change UI from checkboxes to radio buttons
Update validation logic
Add reason mapping at save time
Test single-select enforcement
Why this phase: This is a significant UI change that needs to work correctly before we touch the terminal components.


## Phase 5: Terminal Components
Goal: Update terminal components to show "Return to Dashboard".
Phase 5 Tasks:
Update all email confirmation components
Replace "Continue" with "Return to Dashboard"
Test terminal components render correctly
Why this phase: This completes the user experience changes.


## Phase 6: Email Idempotency
Goal: Prevent duplicate emails on refresh/back.
Phase 6 Tasks:
Implement unique index check in email API
Add transaction-based idempotency
Test duplicate prevention
Why this phase: This is the final piece that ensures robustness.
