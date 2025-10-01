/*
  # Add Email Uniqueness Constraint

  1. Changes
    - Remove duplicate email entries keeping only the latest submission
    - Add unique constraint on user_email in cancellation_submissions
  
  2. Performance
    - Uses existing index on user_email
    - Handles duplicates efficiently with CTE
*/

-- First, identify and remove duplicate submissions, keeping only the latest one
WITH duplicates AS (
  SELECT id
  FROM (
    SELECT 
      id,
      user_email,
      ROW_NUMBER() OVER (
        PARTITION BY user_email 
        ORDER BY created_at DESC
      ) as rn
    FROM cancellation_submissions
  ) ranked
  WHERE rn > 1
)
DELETE FROM cancellation_submissions
WHERE id IN (SELECT id FROM duplicates);

-- Now add the unique constraint
ALTER TABLE cancellation_submissions
  ADD CONSTRAINT unique_user_email UNIQUE (user_email);

-- Add helpful comment
COMMENT ON CONSTRAINT unique_user_email ON cancellation_submissions IS 
  'Ensures users can only submit one cancellation request per email address';