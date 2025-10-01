import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CancellationSubmission = {
  id: string;
  user_email: string;
  current_step: 'feedback' | 'education' | 'retention' | 'future_plans' | 'confirmation';
  status: 'started' | 'in_progress' | 'retained' | 'cancelled' | 'abandoned';
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
};

export type CancellationFeedback = {
  id: string;
  submission_id: string;
  reasons: string[];
  missing_features: string[];
  feedback_text: string | null;
  technical_issue_description: string | null;
};

export type CancellationRetention = {
  id: string;
  submission_id: string;
  offer_shown_at: string | null;
  offer_type: string;
  offer_accepted: boolean | null;
  response_at: string | null;
  future_plan: string | null;
  competitor: string | null;
};