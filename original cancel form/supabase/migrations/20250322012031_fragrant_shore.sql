/*
  # Complete Schema Reset
  
  This migration removes all existing database objects to start fresh:
  - Tables and their data
  - Views
  - Functions and triggers
  - Policies
  - Relationships
*/

-- Drop all tables (if they exist)
DROP TABLE IF EXISTS cancellation_events CASCADE;
DROP TABLE IF EXISTS cancellation_education_events CASCADE;
DROP TABLE IF EXISTS cancellation_flows CASCADE;

-- Drop any functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Ensure we're starting completely fresh
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  -- Drop all policies
  FOR r IN (
    SELECT 
      pol.policyname,
      pol.tablename
    FROM pg_policies pol
    JOIN pg_class c ON c.relname = pol.tablename
    WHERE c.relkind = 'r'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
  
  -- Drop all triggers
  FOR r IN (
    SELECT 
      trig.tgname AS trigger_name,
      cls.relname AS table_name
    FROM pg_trigger trig
    JOIN pg_class cls ON trig.tgrelid = cls.oid
    WHERE NOT trig.tgisinternal
    AND cls.relkind = 'r'
    AND cls.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = current_schema())
  ) LOOP
    BEGIN
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', r.trigger_name, r.table_name);
    EXCEPTION 
      WHEN undefined_table THEN
        -- Skip if table doesn't exist
        NULL;
    END;
  END LOOP;
END $$;