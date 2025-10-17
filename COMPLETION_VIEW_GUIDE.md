# Completion Master View Guide

## Overview

The `completed_cancellations` view provides a simple, consolidated view of all users who completed the cancellation flow with their outcomes.

---

## What It Shows

The view only includes submissions that reached a **terminal step**:
- `confirmation` (standard completion)
- `review_optimization_email_confirmation`
- `poor_experience_email_confirmation`
- `retail_syndication_confirmation`
- `technical_issues_confirmation`

---

## Columns

| Column | Type | Description |
|--------|------|-------------|
| `email` | text | User's email address |
| `submission_id` | text | Unique submission ID |
| `cancellation_reason` | text | Primary cancellation reason |
| `education_path` | text | Education flow taken: `review_optimization`, `poor_experience`, `technical_issues`, `retail_syndication`, or `none` |
| `retention_offered` | boolean | Was a retention offer shown? |
| `retention_accepted` | boolean | Did they accept the retention offer? |
| `final_outcome` | text | `retained`, `cancelled`, or `in_progress` |
| `completed_at` | timestamp | When they completed the flow |
| `current_step` | text | The terminal step they reached |
| `started_at` | timestamp | When they started the form |
| `specificIssues` | text | Detailed issues they described |
| `additionalFeedback` | text | Additional feedback provided |

---

## How to Query

### View All Completions
```sql
SELECT * FROM completed_cancellations;
```

### Count by Outcome
```sql
SELECT final_outcome, COUNT(*) as total
FROM completed_cancellations
GROUP BY final_outcome;
```

### Retained Users
```sql
SELECT email, cancellation_reason, completed_at
FROM completed_cancellations
WHERE final_outcome = 'retained'
ORDER BY completed_at DESC;
```

### Cancelled Users
```sql
SELECT email, cancellation_reason, education_path, completed_at
FROM completed_cancellations
WHERE final_outcome = 'cancelled'
ORDER BY completed_at DESC;
```

### By Cancellation Reason
```sql
SELECT cancellation_reason, 
       COUNT(*) as total,
       SUM(CASE WHEN retention_accepted THEN 1 ELSE 0 END) as retained_count
FROM completed_cancellations
GROUP BY cancellation_reason
ORDER BY total DESC;
```

### By Education Path
```sql
SELECT education_path, 
       COUNT(*) as total,
       AVG(CASE WHEN retention_accepted THEN 1 ELSE 0 END) * 100 as retention_rate
FROM completed_cancellations
WHERE retention_offered = true
GROUP BY education_path;
```

### Recent Completions (Last 7 Days)
```sql
SELECT email, cancellation_reason, final_outcome, completed_at
FROM completed_cancellations
WHERE completed_at > NOW() - INTERVAL '7 days'
ORDER BY completed_at DESC;
```

---

## Access from Code

### Using Supabase Client (Server-Side)

```typescript
import { supabaseAdmin } from '@/lib/supabase'

// Get all completed cancellations
const { data, error } = await supabaseAdmin
  .from('completed_cancellations')
  .select('*')
  .order('completed_at', { ascending: false })

// Get retained users
const { data: retained } = await supabaseAdmin
  .from('completed_cancellations')
  .select('*')
  .eq('final_outcome', 'retained')
```

### Example API Endpoint

You could create `/api/admin/completions`:

```typescript
// src/app/api/admin/completions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const outcome = searchParams.get('outcome') // retained, cancelled, or all

  let query = supabaseAdmin
    .from('completed_cancellations')
    .select('*')
    .order('completed_at', { ascending: false })

  if (outcome && outcome !== 'all') {
    query = query.eq('final_outcome', outcome)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

---

## Security

The view uses `security_invoker = true`, which means:
- It respects the caller's RLS policies
- Use **service role key** (`supabaseAdmin`) to query it
- Anonymous users cannot access it (blocked by underlying table RLS)

---

## Benefits

1. **No Data Duplication** - It's a view, not a table, so always up-to-date
2. **Simple Queries** - One SELECT statement gets all completion data
3. **Performance** - View is optimized with proper joins
4. **Easy Analytics** - Calculate retention rates, popular reasons, etc.
5. **Flexible** - Filter by date, outcome, reason, education path

---

## Example Dashboard Query

```sql
-- Overall stats
SELECT 
    COUNT(*) as total_completions,
    SUM(CASE WHEN final_outcome = 'retained' THEN 1 ELSE 0 END) as total_retained,
    SUM(CASE WHEN final_outcome = 'cancelled' THEN 1 ELSE 0 END) as total_cancelled,
    ROUND(
        SUM(CASE WHEN retention_accepted THEN 1 ELSE 0 END)::numeric / 
        NULLIF(SUM(CASE WHEN retention_offered THEN 1 ELSE 0 END), 0) * 100, 
        2
    ) as retention_offer_success_rate
FROM completed_cancellations;
```

---

## Migration File

The view is defined in:
- `supabase/migrations/20251017000002_create_completion_view.sql`

If you need to modify the view, create a new migration that runs:
```sql
CREATE OR REPLACE VIEW completed_cancellations AS
-- your updated query
```

---

## Testing

The view is currently empty because test submissions haven't reached terminal steps. 

Once real users complete the flow, you'll see data like:

| email | cancellation_reason | education_path | final_outcome | completed_at |
|-------|---------------------|----------------|---------------|--------------|
| user@example.com | Too Expensive | none | retained | 2025-10-17 14:30:00 |
| other@example.com | Not Getting Enough Reviews | review_optimization | cancelled | 2025-10-17 15:00:00 |
| test@example.com | Technical Issues | technical_issues | cancelled | 2025-10-17 16:15:00 |

---

## Summary

Use `completed_cancellations` view to:
- Track which users completed the flow
- Analyze retention offer success rates
- Understand which cancellation reasons are most common
- See which education paths are most effective
- Monitor completion trends over time

**Query it using service role key only - it's not accessible to anonymous users.**

