import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { sendCancellationConfirmationEmail, sendCancellationNotificationEmail } from '../services/emailService';
import type { EmailData } from '../services/emailService';
import { supabase } from '../lib/supabase';

const FUTURE_PLANS = [
  "Switching to another review platform",
  "Managing reviews manually/in-house",
  "No longer collecting reviews",
  "Closing business",
  "Haven't decided yet"
];

const COMPETITORS = [
  "Trustpilot",
  "Yotpo",
  "Judge.me",
  "Okendo",
  "Other"
];

type FuturePlansStepProps = {
  onSubmit: (plan: string, competitor?: string) => void;
};

export function FuturePlansStep({ onSubmit }: FuturePlansStepProps) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [otherCompetitor, setOtherCompetitor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError('Please select your future plans');
      return;
    }

    if (selectedPlan === "Switching to another review platform" && !selectedCompetitor) {
      setError('Please select which platform you plan to use');
      return;
    }

    try {
      // Get the latest submission and feedback
      const { data: submissions } = await supabase
        .from('cancellation_submissions')
        .select(`
          *,
          cancellation_feedback (
            reasons,
            feedback_text
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (submissions) {
        const emailData: EmailData = {
          user_email: submissions.user_email,
          reasons: submissions.cancellation_feedback?.reasons || [],
          feedback: submissions.cancellation_feedback?.feedback_text || '',
          owner_email: submissions.user_email,
          future_plan: selectedPlan,
          competitor: selectedCompetitor === 'Other' ? otherCompetitor : selectedCompetitor
        };

        // Send cancellation confirmation email to user
        await sendCancellationConfirmationEmail(emailData);
        
        // Send notification email to support team
        await sendCancellationNotificationEmail(emailData);
      }
    } catch (error) {
      console.error('Failed to send cancellation emails:', error);
      // Continue with the flow even if emails fail
    }

    const competitor = selectedCompetitor === 'Other' ? otherCompetitor : selectedCompetitor;
    onSubmit(selectedPlan, competitor);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          What Are Your Future Plans?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Help us understand how you plan to manage reviews going forward
        </p>
      </div>

      <div className="space-y-6">
        {/* Future Plans Selection */}
        <div className="space-y-3">
          {FUTURE_PLANS.map(plan => (
            <button
              key={plan}
              type="button"
              onClick={() => {
                setSelectedPlan(plan);
                if (plan !== "Switching to another review platform") {
                  setSelectedCompetitor('');
                  setOtherCompetitor('');
                }
                setError('');
              }}
              className={`w-full flex items-center p-4 border-2 rounded-lg transition-all duration-200 text-left text-sm ${
                selectedPlan === plan
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
              }`}
            >
              <CheckCircle2 
                className={`h-5 w-5 mr-2 flex-shrink-0 transition-colors ${
                  selectedPlan === plan ? 'text-blue-500' : 'text-gray-400'
                }`}
              />
              <span>{plan}</span>
            </button>
          ))}
        </div>

        {/* Competitor Selection */}
        {selectedPlan === "Switching to another review platform" && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Which platform are you planning to use?
            </h3>
            <div className="space-y-3">
              {COMPETITORS.map(competitor => (
                <button
                  key={competitor}
                  type="button"
                  onClick={() => {
                    setSelectedCompetitor(competitor);
                    setError('');
                  }}
                  className={`w-full flex items-center p-4 border-2 rounded-lg transition-all duration-200 text-left text-sm ${
                    selectedCompetitor === competitor
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <CheckCircle2 
                    className={`h-5 w-5 mr-2 flex-shrink-0 transition-colors ${
                      selectedCompetitor === competitor ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  />
                  <span>{competitor}</span>
                </button>
              ))}
            </div>

            {selectedCompetitor === 'Other' && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter platform name"
                  value={otherCompetitor}
                  onChange={(e) => {
                    setOtherCompetitor(e.target.value);
                    setError('');
                  }}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}