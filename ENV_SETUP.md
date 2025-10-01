# 🔧 Environment Setup for Supabase

## Create .env.local file

Create a file called `.env.local` in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database URL for Prisma (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres

# Postmark Email Service
POSTMARK_SERVER_TOKEN=your_postmark_server_token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=RaveCapture Cancellation Form

# Calendly Integration (optional)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username

# Feature Flags
NEXT_PUBLIC_SIMPLIFIED_FLOW=true
```

## Get Your Supabase Credentials

1. **Sign in to Supabase**: Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **Find your project**: Look for your project (should be named something like `ravecapture-cancellation-form`)

3. **Get API Keys**:
   - Go to **Settings > API**
   - Copy the **anon/public key** (starts with `eyJ...`)
   - Copy the **service_role key** (starts with `eyJ...`)

4. **Get Database Password**:
   - This is the password you set when creating the Supabase project
   - If you forgot it, you can reset it in **Settings > Database**

5. **Update your .env.local**:
   - Replace `your_anon_key_here` with your actual anon key
   - Replace `your_service_role_key_here` with your actual service role key
   - Replace `[YOUR-PASSWORD]` with your database password

## Example of completed .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:your_actual_password@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_SIMPLIFIED_FLOW=true
```

## Next Steps

Once you've created the .env.local file with the correct credentials, run:

```bash
npx prisma generate
npx prisma db push
npm run dev
```
