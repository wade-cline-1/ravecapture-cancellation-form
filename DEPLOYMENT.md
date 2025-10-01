# Netlify Deployment Guide

## ✅ Code is Ready
Your code has been committed and pushed to GitHub: `wade-cline-1/ravecapture-cancellation-form`

## 🚀 Deploy to Netlify

### Option 1: Connect GitHub Repository to Netlify

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in to your account

2. **Create New Site**
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select repository: `wade-cline-1/ravecapture-cancellation-form`

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

4. **Add Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Add: `POSTMARK_SERVER_TOKEN` = `017d4094-24af-4c00-9f15-99cf969722eb`

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site

### Option 2: Manual Deploy (if you prefer)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## 🔧 Environment Variables Required

Make sure these are set in Netlify:

- `POSTMARK_SERVER_TOKEN`: `017d4094-24af-4c00-9f15-99cf969722eb`
- `DATABASE_URL`: Your Supabase database URL (if not already set)

## 🧪 Test Production

Once deployed, test your email functionality:

```bash
curl -X POST https://feedback.ravecaptureapp.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailType": "cancellation_confirmation",
    "data": {
      "userEmail": "test@example.com",
      "userName": "Test User",
      "cancellationReasons": ["Poor experience"],
      "specificIssues": "Test issues",
      "additionalFeedback": "Test feedback"
    },
    "submissionId": "test-123"
  }'
```

## 📧 Email Templates Available

- `cancellation_confirmation` - User confirmation
- `cancellation_notification` - Internal notification  
- `retention_confirmation` - Retention offer
- `review_optimization_followup` - Review optimization
- `poor_experience_followup` - Poor experience follow-up
- `retail_syndication_followup` - Retail syndication
- `technical_issues_followup` - Technical support

## 🎯 Your Site URL

Once deployed, your site will be available at:
- **Production**: `https://feedback.ravecaptureapp.com`
- **API Endpoint**: `https://feedback.ravecaptureapp.com/api/send-email`
