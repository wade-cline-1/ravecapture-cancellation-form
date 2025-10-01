# RaveCapture Cancellation Form - User Path Wireframe

## Overview
This document outlines all possible user paths through the RaveCapture cancellation form. The form is designed to understand why users are cancelling and provide targeted retention efforts based on their specific concerns.

## Entry Point
**Step 1: Feedback Step** (`feedback`)
- **Purpose**: Collect initial cancellation reasons and user information
- **User Input Required**:
  - Email address (required)
  - Cancellation reasons (multiple selection allowed):
    - "Not Getting Enough Reviews"
    - "Poor Experience" 
    - "Technical Issues"
    - "Missing Features"
    - "Too Expensive"
    - "Found Better Alternative"
    - "No Longer Needed"
    - "Other"
  - Specific issues (optional text area)
  - Additional feedback (optional text area)
  - If "Missing Features" selected:
    - Feature selection (up to 2 features):
      - "Unable to integrate my reviews into Google Shopping Ads"
      - "Cannot display reviews in Google Seller Ads"
      - "Lacks integration requirements with my store platform"
      - "Can't customize my display widgets"
      - "Doesn't offer Retail Syndication"
      - "Something else"

## Path Routing Logic
Based on the selected cancellation reasons, users are routed to different educational paths:

### Path 1: Review Optimization Education
**Trigger**: User selects "Not Getting Enough Reviews"
**Flow**: `feedback` → `review_optimization_education` → `review_optimization_calendly` → `review_optimization_email_confirmation` → `retention`

#### Step 2: Review Optimization Education
- **Purpose**: Educate users about review collection optimization strategies
- **Content**: 
  - Targeted review requests
  - Optimal timing strategies
  - Multi-channel approach
  - Automated follow-ups
  - Success story testimonial
- **Action**: "I'm interested - let's talk" button

#### Step 3: Review Optimization Calendly
- **Purpose**: Schedule consultation call for review optimization
- **Features**:
  - 30-minute consultation call booking
  - Expert guidance information
  - What will be covered in the call
  - Option to skip for now
- **Calendly URL**: `https://calendly.com/wade-cline/account-optimization-clone`
- **Actions**: "Schedule Free Consultation" or "Skip for Now"

#### Step 4: Review Optimization Email Confirmation
- **Purpose**: Send follow-up email with optimization strategies
- **Auto-actions**: Sends email with review optimization content
- **Content includes**:
  - Proven strategies to increase review volume
  - Best practices for timing and messaging
  - Platform-specific optimization tips
  - Template examples and messaging guides
  - Link to consultation call (if scheduled)

### Path 2: Poor Experience Education
**Trigger**: User selects "Poor Experience"
**Flow**: `feedback` → `poor_experience_education` → `poor_experience_calendly` → `poor_experience_email_confirmation` → `retention`

#### Step 2: Poor Experience Education
- **Purpose**: Address user concerns and offer personalized support
- **Content**:
  - Dedicated account manager
  - Priority support access
  - Custom solutions
  - Performance monitoring
  - 30-day improvement guarantee
- **Action**: "Let's work together to improve this" button

#### Step 3: Poor Experience Calendly
- **Purpose**: Schedule experience review call
- **Features**:
  - Experience review consultation
  - Listen & learn approach
  - Personal attention commitment
  - Detailed discussion topics
- **Calendly URL**: `https://calendly.com/wade-cline/discussionaboutcurrentplan`
- **Actions**: "Schedule Call" or "Skip for Now"

#### Step 4: Poor Experience Email Confirmation
- **Purpose**: Send personalized support email
- **Auto-actions**: Sends email with immediate action steps
- **Content includes**:
  - Immediate steps to resolve specific issues
  - Direct contact information for support team
  - Escalation process for urgent concerns
  - Compensation or service recovery options
  - Link to experience review call (if scheduled)

### Path 3: Technical Issues Education
**Trigger**: User selects "Technical Issues"
**Flow**: `feedback` → `technical_issues_education` → `technical_issues_confirmation` → `retention`

#### Step 2: Technical Issues Education
- **Purpose**: Provide technical support and resolution
- **Content**:
  - Immediate issue resolution
  - Priority technical support
  - Custom integration support
  - Performance optimization
- **Action**: "Let's resolve these issues" button

#### Step 3: Technical Issues Confirmation
- **Purpose**: Send technical support information
- **Auto-actions**: Sends email with technical support content
- **Content includes**:
  - Immediate troubleshooting steps
  - Direct contact for technical support team
  - System requirements and compatibility info
  - Common solutions for technical issues
  - Escalation process for complex problems

### Path 4: Missing Features Education (Complex Routing)
**Trigger**: User selects "Missing Features"
**Flow**: Routes to different education steps based on selected features

#### 4A: Combined Education (API + Google Shopping)
**Trigger**: User selects both "Lacks integration requirements with my store platform" AND "Unable to integrate my reviews into Google Shopping Ads"
**Flow**: `feedback` → `combined_education` → `retention`

#### 4B: Feature Education (Google Shopping Only)
**Trigger**: User selects only "Unable to integrate my reviews into Google Shopping Ads"
**Flow**: `feedback` → `feature_education` → `retention`

#### 4C: Custom API Education
**Trigger**: User selects only "Lacks integration requirements with my store platform"
**Flow**: `feedback` → `custom_api_education` → `retention`

#### 4D: Google Business Education
**Trigger**: User selects "Cannot display reviews in Google Seller Ads"
**Flow**: `feedback` → `google_business_education` → `retention`

#### 4E: Retail Syndication Education
**Trigger**: User selects "Doesn't offer Retail Syndication"
**Flow**: `feedback` → `retail_syndication_education` → `retail_syndication_confirmation` → `retention`

#### 4F: Feature Education (Widget Customization)
**Trigger**: User selects "Can't customize my display widgets"
**Flow**: `feedback` → `feature_education` → `retention`

#### 4G: Default to Retention
**Trigger**: No specific features detected or other combinations
**Flow**: `feedback` → `retention`

### Education Step Details

#### Combined Education Step
- **Purpose**: Show solutions for both API integration and Google Shopping
- **Content**: Two-column layout showing API integration and Google Shopping solutions
- **Actions**: "I want to learn more" or "Not Interested"

#### Feature Education Step
- **Purpose**: Showcase advanced features and integrations
- **Content**: Google Shopping Ads, Custom API, Retail Syndication, Google Business integration
- **Action**: "Show me these features" button

#### Custom API Education Step
- **Purpose**: Highlight custom API integration capabilities
- **Content**: Full control over integration, customization options, documentation access
- **Actions**: "I want to learn more" or "Not Interested"

#### Google Business Education Step
- **Purpose**: Provide alternative solution for Google Ads stars
- **Content**: Google Business Reviews alternative approach
- **Actions**: "I want to learn more" or "Not Interested"

#### Retail Syndication Education Step
- **Purpose**: Explain retail syndication alternatives
- **Content**: Manual export workflow solution
- **Auto-actions**: Sends email to support about retail syndication interest
- **Actions**: "Talk to Support" or "Not Interested"

#### Retail Syndication Confirmation Step
- **Purpose**: Send retail syndication information
- **Auto-actions**: Sends email with retail syndication content
- **Content includes**:
  - Overview of retail syndication capabilities
  - Setup guides for retail partnerships
  - Best practices for retail review collection
  - Integration guides for retail platforms
  - Success stories and implementation support

## Common Path: Retention Step
**All paths converge here**: `retention`

### Retention Step
- **Purpose**: Present retention offer to all users
- **Content**:
  - 50% discount for 12 months offer
  - Special retention offer presentation
  - Value proposition for staying
- **Actions**: 
  - "Yes, I'll stay with 50% off" → `confirmation` (retention accepted)
  - "No, I still want to cancel" → `future_plans`

## Final Steps

### Future Plans Step (if retention declined)
**Flow**: `retention` → `future_plans` → `confirmation`

#### Future Plans Step
- **Purpose**: Collect additional information from users who decline retention
- **User Input**:
  - Plans for review management going forward
  - Information about switching to different service
- **Action**: "Complete Cancellation" button

### Confirmation Step
**Final step for all paths**: `confirmation`

#### Confirmation Step (Retention Accepted)
- **Purpose**: Confirm retention and apply discount
- **Auto-actions**: Sends retention acceptance and confirmation emails
- **Content**:
  - Success message with discount confirmation
  - Link to return to dashboard
- **Email Types**: `retention_acceptance`, `retention_confirmation`

#### Confirmation Step (Cancellation Confirmed)
- **Purpose**: Confirm cancellation and provide offboarding guidance
- **Auto-actions**: Sends cancellation confirmation and notification emails
- **Content**:
  - Cancellation confirmation message
  - Offboarding steps:
    - Export data guidance
    - Remove integration code instructions
    - Free plan information
    - Pause automated emails
  - Support and account management links
- **Email Types**: `cancellation_confirmation`, `cancellation_notification`

## Email Types Sent
The system sends different email types based on user path and decisions:

1. **Retention Path Emails**:
   - `retention_acceptance` - User accepts retention offer
   - `retention_confirmation` - Confirmation of retention

2. **Cancellation Path Emails**:
   - `cancellation_confirmation` - User confirms cancellation
   - `cancellation_notification` - Internal notification

3. **Education Follow-up Emails**:
   - `review_optimization_followup` - Review optimization strategies
   - `poor_experience_followup` - Experience improvement steps
   - `technical_issues_followup` - Technical support information
   - `retail_syndication_followup` - Retail syndication information
   - `retail_syndication_interest` - Interest in retail syndication

## Progress Tracking
- **Progress Bar**: Shows completion percentage based on current step
- **Step Order**: Defined sequence of all possible steps
- **Education Tracking**: Tracks time spent and completion of education steps

## Key Features
- **Dynamic Routing**: Path changes based on user selections
- **Email Automation**: Automatic email sending at appropriate steps
- **Calendly Integration**: Direct booking for consultation calls
- **Progress Tracking**: Visual progress indicator
- **Data Persistence**: Form data saved to database throughout process
- **Retention Focus**: Multiple opportunities to retain customers
- **Educational Content**: Targeted information based on user concerns

## User Experience Flow Summary
1. **Initial Feedback** → User provides cancellation reasons
2. **Targeted Education** → Relevant educational content based on reasons
3. **Consultation Booking** → Optional call scheduling (for specific paths)
4. **Email Follow-up** → Automated email with relevant information
5. **Retention Offer** → 50% discount offer to all users
6. **Final Decision** → Confirmation of retention or cancellation
7. **Offboarding** → Guidance for users who cancel

This comprehensive flow ensures every user receives personalized attention and multiple opportunities for retention while collecting valuable feedback for service improvement.
