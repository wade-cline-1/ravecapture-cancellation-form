# 🛠️ Maintenance Tools & Resources

This document outlines the key tools and resources kept for ongoing maintenance, testing, and security monitoring of the RaveCapture Cancellation Form.

---

## 📚 **Documentation Files**

### **1. SECURITY_AUDIT_REPORT.md**
**Purpose:** Complete security audit from October 17, 2025  
**When to use:**
- Reference for security implementation details
- Understanding RLS policies and security model
- Onboarding new team members
- Security compliance reviews

**Key information:**
- Critical security issues that were found and fixed
- RLS implementation details
- Security best practices
- Deployment verification checklist

---

### **2. TEST_GUIDE.md**
**Purpose:** Complete guide for the comprehensive test suite  
**When to use:**
- Running tests before deployments
- Setting up CI/CD pipelines
- Understanding test coverage
- Troubleshooting test failures

**Key information:**
- How to run the test suite
- What each test suite covers
- Expected results
- Troubleshooting common issues
- CI/CD integration examples

---

### **3. ENV_SETUP.md**
**Purpose:** Environment setup and configuration  
**When to use:**
- Setting up new development environments
- Configuring environment variables
- Troubleshooting connection issues

---

### **4. IMPLEMENTATION_PLAN.md**
**Purpose:** Original implementation plan and architecture  
**When to use:**
- Understanding design decisions
- Planning new features
- Architectural reference

---

### **5. User-Path-Wireframe.md**
**Purpose:** User flow documentation and wireframes  
**When to use:**
- Understanding user journeys
- Adding new cancellation paths
- UX improvements
- Onboarding designers/developers

---

### **6. COMPLETION_VIEW_GUIDE.md**
**Purpose:** Guide for the `completed_cancellations` database view  
**When to use:**
- Querying completion data and outcomes
- Analyzing retention offer success rates
- Building admin dashboards
- Generating reports on cancellation trends

**Key features:**
- Shows only users who completed the flow
- Includes cancellation reason, education path, and final outcome
- Queryable with SQL or via Supabase client (service role)
- Real-time view (always up-to-date)

---

## 🧪 **Testing Tools**

### **test-app-comprehensive.js** ⭐
**Purpose:** Complete end-to-end test suite (33 tests across 14 suites)  
**Last run:** October 17, 2025 - **100% pass rate**

**When to run:**
- ✅ **Before every deployment** to production
- ✅ **After any code changes** to verify nothing broke
- ✅ **After database migrations** to ensure data integrity
- ✅ **Before merging PRs** to main branch
- ✅ **Weekly** as part of regular maintenance
- ✅ **After updating dependencies** to catch breaking changes

**How to run:**
```bash
# 1. Start your dev server
npm run dev

# 2. In another terminal, run tests
node test-app-comprehensive.js

# Or test against a specific URL
TEST_BASE_URL=https://staging.example.com node test-app-comprehensive.js
```

**What it tests:**
- ✅ All 8 cancellation reason paths
- ✅ All education flows (5 different paths)
- ✅ Retention offers (accept & decline)
- ✅ Data persistence and retrieval
- ✅ Education event tracking
- ✅ API endpoints functionality
- ✅ Error handling and validation
- ✅ Edge cases and concurrent requests
- ✅ Progressive form updates

**Expected duration:** ~20-30 seconds

**Expected result:** 100% pass rate (all tests green)

---

## 🔐 **Security Monitoring**

### **Regular Security Checks**

**Monthly Security Audit:**
```bash
# Check for security advisories in Supabase
# You can use the Supabase MCP or dashboard
```

**After any database changes:**
1. Verify RLS is still enabled on all tables
2. Check that policies are still in place
3. Test anonymous access is blocked
4. Verify service role key is not exposed

**Security checklist:**
- [ ] RLS enabled on all tables
- [ ] Anonymous users cannot read sensitive data
- [ ] Service role key only used server-side
- [ ] API routes use `supabaseAdmin` not `supabase`
- [ ] All policies are restrictive (not permissive)
- [ ] No sensitive data in client-side code

---

## 📊 **Database Migrations**

All migrations are stored in: `supabase/migrations/`

**Key migrations:**
- `20251001160806_create_cancellation_tables.sql` - Initial schema
- `20251001170000_add_email_idempotency.sql` - Email uniqueness
- `20251017000000_enable_rls_security.sql` - Enable RLS
- `20251017000001_secure_rls_policies.sql` - Security policies
- `20251017000002_create_completion_view.sql` - Completion master view

**When adding new migrations:**
1. Create migration file with timestamp
2. Test locally first
3. Run test suite to verify no breakage
4. Deploy to production
5. Verify with test suite again

---

## 🚀 **Pre-Deployment Checklist**

Before deploying to production:

1. **Run Tests:**
   ```bash
   node test-app-comprehensive.js
   ```
   - ✅ Must show 100% pass rate

2. **Check Linter:**
   ```bash
   npm run lint
   ```
   - ✅ No errors

3. **Verify Environment Variables:**
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` is set
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` is set (server-side only)

4. **Database Check:**
   - ✅ All migrations applied
   - ✅ RLS enabled and policies active
   - ✅ Test data cleaned up (if applicable)

5. **Code Review:**
   - ✅ No console.logs in production code
   - ✅ No hardcoded credentials
   - ✅ Error handling in place

6. **Build Check:**
   ```bash
   npm run build
   ```
   - ✅ Builds successfully

---

## 🔧 **Troubleshooting**

### **Tests Failing?**

1. **Check server is running:**
   ```bash
   curl http://localhost:3000
   ```

2. **Check environment variables:**
   ```bash
   cat .env
   ```

3. **Check database connection:**
   - Verify Supabase project is accessible
   - Check service role key is correct

4. **Check recent changes:**
   ```bash
   git log --oneline -5
   ```

5. **Run specific test suite:**
   - Edit `test-app-comprehensive.js`
   - Comment out other test suites
   - Run to isolate the issue

### **Database Issues?**

1. **Verify RLS status:**
   - Go to Supabase Dashboard → Database → Tables
   - Check RLS is enabled on all tables

2. **Check policies:**
   - Dashboard → Database → Policies
   - Verify restrictive policies are in place

3. **Test with service role:**
   - Service role should have full access
   - Anonymous role should be blocked

---

## 📅 **Maintenance Schedule**

### **Weekly:**
- ✅ Run test suite
- ✅ Check error logs
- ✅ Review any new submissions

### **Monthly:**
- ✅ Security audit (check Supabase advisors)
- ✅ Update dependencies
- ✅ Review and clean test data
- ✅ Check performance metrics

### **Quarterly:**
- ✅ Full security review
- ✅ Update documentation
- ✅ Review and optimize database
- ✅ Audit logs and analytics

---

## 🎯 **Quick Commands Reference**

```bash
# Development
npm run dev                          # Start dev server
npm run build                        # Build for production
npm run lint                         # Check for linting errors

# Testing
node test-app-comprehensive.js       # Run full test suite
TEST_BASE_URL=http://localhost:3001 node test-app-comprehensive.js  # Test on different port

# Database
supabase db push                     # Push migrations
supabase db reset                    # Reset local database
supabase status                      # Check Supabase status

# Git
git status                           # Check changes
git add .                            # Stage all changes
git commit -m "message"              # Commit changes
git push                             # Push to remote
```

---

## 📞 **Resources**

- **Supabase Dashboard:** https://app.supabase.com
- **Test Suite Documentation:** See `TEST_GUIDE.md`
- **Security Report:** See `SECURITY_AUDIT_REPORT.md`
- **User Flows:** See `User-Path-Wireframe.md`

---

## ✨ **Summary**

**Keep these files for ongoing maintenance:**
- ✅ `test-app-comprehensive.js` - Run before every deployment
- ✅ `TEST_GUIDE.md` - How to use the test suite
- ✅ `SECURITY_AUDIT_REPORT.md` - Security implementation reference
- ✅ `COMPLETION_VIEW_GUIDE.md` - How to query completion data
- ✅ `MAINTENANCE_TOOLS.md` (this file) - Quick reference guide

**Regular tasks:**
- 🔄 Run tests before deployments
- 🔐 Monitor security monthly
- 📊 Review logs weekly
- 🔧 Update dependencies monthly

**Your application is production-ready and maintainable!** 🚀

