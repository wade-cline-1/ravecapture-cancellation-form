You are a master developer and understand the importance for simplicity. I have two projects that I need help comparing the differences between. Both are basically the same objective (to provide a cancelation flow for a user who wants to cancel ravecapture and offer education + retention opportunities. 

I'm going to provide you two different wireframes that detail the paths for each app. The first wireframe is for our original cancelation form; this one I prefer because it keeps it simple and effective without too many steps. The second one which I'll provide after your response to this message, is for our updated app which is live on production. 

My goal is to update our live app to use the exact same steps as the original cancel form. 

Here is the first wireframe - I want you to ingest the information and then prompt me to provide you with the second wireframe of our current app. 

# RaveCapture Cancellation Flow - User Journey Wireframes

## Overview
This document outlines all possible user flows through the RaveCapture cancellation process, including decision points, education steps, and final outcomes.

## Main Flow Structure

```
Start → Feedback Step → Education Steps → Retention/Confirmation
```

## 1. Initial Feedback Step (Step 1)

### Input Fields:
- **Email Address** (required)
- **Cancellation Reason** (single select, required):
  - Not Getting Enough Reviews
  - Too Expensive
  - Not Seeing Enough Value
  - Missing Features
  - Technical Issues
  - Poor Experience
  - Only Needed Temporarily
  - Something Else
- **Missing Features** (if "Missing Features" selected, up to 2 + "Something else"):
  - Unable to integrate my reviews into Google Shopping Ads
  - Cannot display reviews in Google Seller Ads
  - Lacks integration requirements with my store platform
  - Can't customize my display widgets
  - Doesn't offer Retail Syndication
  - Something else
- **Additional Feedback** (optional, required for "Something Else" reason or "Something else" feature)

### Validation:
- Email uniqueness check against existing submissions
- Required field validation
- Feature selection limits (max 2 regular features + "Something else")

---

## 2. Education Step Routing Logic

Based on the selected reason, users are routed to different education steps:

### 2.1 Technical Issues → Step 1.95
**TechnicalIssuesEducationStep**
- Offers priority support
- Two options:
  - "Yes, let's fix this" → Technical issue form → Step 1.96 (Confirmation)
  - "No, thanks" → Step 2 (Retention)

### 2.2 Not Getting Enough Reviews → Step 1.3
**ReviewOptimizationEducationStep**
- Offers free consultation for optimization
- Two options:
  - "Yes!" → Step 1.31 (Calendly)
  - "Not Interested" → Step 2 (Retention)

#### 2.2.1 Review Optimization Calendly → Step 1.31
**ReviewOptimizationCalendlyStep**
- Two options:
  - "Schedule Consultation" → External Calendly link
  - "Just Connect via Email" → Step 1.35 (Email Confirmation)

### 2.3 Poor Experience → Step 1.4
**PoorExperienceEducationStep**
- Offers personal conversation with GM
- Two options:
  - "Yes, let's talk" → Step 1.41 (Calendly)
  - "No, thanks" → Step 2 (Retention)

#### 2.3.1 Poor Experience Calendly → Step 1.41
**PoorExperienceCalendlyStep**
- Two options:
  - "Schedule time with Wade" → External Calendly link
  - "Ask Wade to follow up" → Step 1.45 (Email Confirmation)

### 2.4 Missing Features → Multiple Paths

#### 2.4.1 Google Shopping Ads Only → Step 1.5
**FeatureEducationStep** (Google Shopping variant)
- Shows Google Shopping integration is available
- Two options:
  - "Show me" → External link to support article
  - "Not Interested" → Step 2 (Retention)

#### 2.4.2 Custom Widgets Only → Step 1.5
**FeatureEducationStep** (Widget customization variant)
- Shows widget customization is available
- Two options:
  - "Show me" → External link to display settings
  - "Not Interested" → Step 2 (Retention)

#### 2.4.3 Both Google Shopping + API Integration → Step 1.6
**CombinedEducationStep**
- Shows both API and Google Shopping solutions
- Two columns with separate "Show me" links
- One option:
  - "Not Interested" → Step 2 (Retention)

#### 2.4.4 API Integration Only → Step 1.9
**CustomAPIEducationStep**
- Shows API integration capabilities
- Two options:
  - "Show me" → External link to API settings
  - "Not Interested" → Step 2 (Retention)

#### 2.4.5 Google Seller Ads → Step 1.8
**GoogleBusinessEducationStep**
- Shows alternative solution using Google Business Reviews
- Two options:
  - "Show me" → External link to company review settings
  - "Not Interested" → Step 2 (Retention)

#### 2.4.6 Retail Syndication → Step 1.75
**RetailSyndicationEducationStep**
- Shows manual export workflow solution
- Two options:
  - "Talk to Support" → Step 1.76 (Confirmation)
  - "Not Interested" → Step 2 (Retention)

### 2.5 All Other Reasons → Step 2 (Retention)
Direct routing to retention offer

---

## 3. Retention Step (Step 2)

**RetentionStep**
- Shows 50% discount offer for 12 months
- Two options:
  - "Accept Offer & Continue" → Step 3 (Confirmation - Retained)
  - "Continue with cancellation" → Step 2.5 (Future Plans)

---

## 4. Future Plans Step (Step 2.5)

**FuturePlansStep**
- **Future Plans** (single select, required):
  - Switching to another review platform
  - Managing reviews manually/in-house
  - No longer collecting reviews
  - Closing business
  - Haven't decided yet

- **Competitor Selection** (if switching platforms):
  - Trustpilot
  - Yotpo
  - Judge.me
  - Okendo
  - Other (with text input)

- Outcome: Step 3 (Confirmation - Cancelled)

---

## 5. Final Confirmation Steps (Step 3 & Variants)

### 5.1 Retained Confirmation (Step 3 - Accepted Offer)
**ConfirmationStep** (retained variant)
- Success message about 50% discount
- "Return to Dashboard" button

### 5.2 Cancelled Confirmation (Step 3 - Completed Cancellation)
**ConfirmationStep** (cancelled variant)
- Cancellation confirmation
- Off-boarding checklist:
  - Export data
  - Remove integration code
  - Free plan information
  - Pause automated emails
- Two buttons:
  - "Talk with Support"
  - "Go to Account"

### 5.3 Education Exit Confirmations

#### 5.3.1 Review Optimization Email Confirmation (Step 1.35)
**ReviewOptimizationEmailConfirmation**
- Confirmation that team will reach out
- "Return to Dashboard" button

#### 5.3.2 Poor Experience Email Confirmation (Step 1.45)
**PoorExperienceEmailConfirmation**
- Confirmation that Wade will follow up within 24 hours
- "Return to Dashboard" button

#### 5.3.3 Retail Syndication Confirmation (Step 1.76)
**RetailSyndicationConfirmationStep**
- Confirmation that support will discuss export options
- "Return to Dashboard" button

#### 5.3.4 Technical Issues Confirmation (Step 1.96)
**TechnicalIssuesConfirmationStep**
- Confirmation that technical team will review
- "Return to Dashboard" button

---

## 6. Complete User Flow Paths

### Path 1: Technical Issues → Support
```
Step 1 (Technical Issues) → Step 1.95 → Step 1.96 → End (Retained)
```

### Path 2: Review Optimization → Calendly
```
Step 1 (Not Getting Reviews) → Step 1.3 → Step 1.31 → External Calendly → End
```

### Path 3: Review Optimization → Email
```
Step 1 (Not Getting Reviews) → Step 1.3 → Step 1.31 → Step 1.35 → End (Retained)
```

### Path 4: Poor Experience → Calendly
```
Step 1 (Poor Experience) → Step 1.4 → Step 1.41 → External Calendly → End
```

### Path 5: Poor Experience → Email
```
Step 1 (Poor Experience) → Step 1.4 → Step 1.41 → Step 1.45 → End (Retained)
```

### Path 6: Missing Features → Education → Retention
```
Step 1 (Missing Features) → Step 1.5/1.6/1.8/1.9 → Step 2 → Step 3 (Retained/Cancelled)
```

### Path 7: Retail Syndication → Support
```
Step 1 (Missing Features - Retail) → Step 1.75 → Step 1.76 → End (Retained)
```

### Path 8: Standard Cancellation Flow
```
Step 1 (Other Reasons) → Step 2 → Step 2.5 → Step 3 → End (Cancelled)
```

### Path 9: Retention Accepted
```
Step 1 → Education (optional) → Step 2 → Step 3 → End (Retained)
```

---

## 7. Data Collection Points

### Database Tables Used:
1. **cancellation_submissions** - Main submission tracking
2. **cancellation_feedback** - User feedback and reasons
3. **cancellation_retention** - Retention offer responses
4. **cancellation_education_events** - Education step interactions

### Email Triggers:
- Cancellation confirmation (to user)
- Cancellation notification (to support)
- Poor experience follow-up (to Wade)
- Retention confirmation (to user)
- Retention acceptance (to Wade)
- Optimization request (to Wade)
- Technical issue reports (to support & user)
- Retail syndication request (to support)

---

## 8. External Integrations

### Calendly Links:
- Poor Experience: `https://calendly.com/wade-cline/discussionaboutcurrentplan`
- Review Optimization: `https://calendly.com/wade-cline/account-optimization-clone`

### RaveCapture App Links:
- Dashboard: `https://app.ravecapture.com/dashboard`
- Export: `https://app.ravecapture.com/account_settings/export`
- API Settings: `https://app.ravecapture.com/settings/integrations#api`
- Display Settings: `https://app.ravecapture.com/display`
- Company Reviews: `https://app.ravecapture.com/campaigns/company/settings`
- Campaigns: `https://app.ravecapture.com/campaigns`

### Support Links:
- Support Center: `https://support.ravecapture.com/en/`
- Google Shopping Guide: `https://support.ravecapture.com/en/articles/1587489-google-shopping-review-feed-requirements-and-setup-guide`

---

## 9. Progress Tracking

The application uses a progress bar that calculates completion based on:
- Current step number
- Whether the step is a final step (confirmation)
- Progress shows 100% for all final confirmation steps

### Final Steps:
- Step 3 (main confirmation)
- Step 1.35 (review optimization email)
- Step 1.45 (poor experience email)
- Step 1.76 (retail syndication confirmation)
- Step 1.96 (technical issues confirmation)