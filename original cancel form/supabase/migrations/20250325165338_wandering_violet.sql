/*
  # Remove Rate Limiting Implementation

  1. Changes
    - Drop submission_attempts table
    - Remove associated indexes and policies
*/

-- Drop the table (this will automatically drop associated indexes and policies)
DROP TABLE IF EXISTS submission_attempts;