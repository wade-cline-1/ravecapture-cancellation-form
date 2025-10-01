import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { supabase } from '../lib/supabase';

const CANCELLATION_REASONS = [
  "Not Getting Enough Reviews",
  "Too Expensive",
  "Not Seeing Enough Value",
  "Missing Features",
  "Technical Issues",
  "Poor Experience",
  "Only Needed Temporarily",
  "Something Else"
];

const MISSING_FEATURES = [
  "Unable to integrate my reviews into Google Shopping Ads",
  "Cannot display reviews in Google Seller Ads",
  "Lacks integration requirements with my store platform",
  "Can't customize my display widgets",
  "Doesn't offer Retail Syndication",
  "Something else"
];

type FeedbackStepProps = {
  onSubmit: (reasons: string[], feedback: string, owner_email: string, features?: string[]) => void;
};

const isReasonDisabled = (reason: string, selectedReason: string) => {
  return false; // Remove the disabled state completely
};

export function FeedbackStep({ onSubmit }: FeedbackStepProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [error, setError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const selectReason = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'Missing Features') {
      setSelectedFeatures([]);
    }
    setError('');
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => {
      // If feature is already selected, remove it
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature);
      }

      // Handle "Something else" selection
      if (feature === "Something else") {
        return [...prev, feature];
      }

      // Get current regular features (excluding "Something else")
      const regularFeatures = prev.filter(f => f !== "Something else");
      const hasSomethingElse = prev.includes("Something else");

      // If trying to select a third regular feature, prevent it
      if (regularFeatures.length >= 2) {
        return prev;
      }

      // Add the new feature while preserving both existing regular features and "Something else"
      const newFeatures = [...regularFeatures, feature];
      return hasSomethingElse ? [...newFeatures, "Something else"] : newFeatures;
    });
    setError('');
  };

  const isFeatureDisabled = (feature: string) => {
    if (feature === "Something else") return false;
    const regularFeatures = selectedFeatures.filter(f => f !== "Something else");
    return regularFeatures.length >= 2 && !selectedFeatures.includes(feature);
  };

  const checkExistingSubmission = async (email: string) => {
    const { data, error } = await supabase
      .from('cancellation_submissions')
      .select('id')
      .eq('user_email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking for existing submission:', error);
      return false;
    }

    return !!data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a reason for canceling');
      return;
    }

    if (!ownerEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!ownerEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (selectedReason === 'Missing Features') {
      if (selectedFeatures.length === 0) {
        setError('Please select at least one missing feature');
        return;
      }

      if (selectedFeatures.includes("Something else") && !feedback.trim()) {
        setError('Please provide details about the additional feature you need');
        return;
      }
    }

    if (selectedReason === 'None of the Above' && !feedback.trim()) {
      setError('Please provide additional feedback');
      return;
    }

    setIsCheckingEmail(true);
    const hasExistingSubmission = await checkExistingSubmission(ownerEmail);
    setIsCheckingEmail(false);

    if (hasExistingSubmission) {
      setError('A cancellation request has already been submitted for this email address');
      return;
    }

    const finalFeedback = selectedFeatures.length > 0
      ? `Missing Features Selected:\n- ${selectedFeatures.join('\n- ')}\n\nAdditional Feedback:\n${feedback}`
      : feedback;

    onSubmit([selectedReason], finalFeedback, ownerEmail, selectedFeatures);
  };

  const requiresFeedback = selectedReason === 'None of the Above' ||
    (selectedFeatures.includes("Something else")); // Simplified condition for "Something else"

  const showMissingFeatures = selectedReason === 'Missing Features';

  return (
    <div className="space-y-8">
      <div className="relative">
        <a
          href="https://app.ravecapture.com/dashboard"
          className="absolute left-0 top-0 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </a>
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            We're Sorry to See You Go
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please help us understand the reason for canceling your account.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Information Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* Email Field */}
          <div>
            <div className="mb-1">
              <label 
                htmlFor="email" 
                className="text-base font-semibold text-gray-900 flex items-center"
              >
                Email Address
                <span className="text-red-600 ml-1">*</span>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs"
                        sideOffset={5}
                      >
                        Please provide the email address you use to sign into RaveCapture
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </label>
            </div>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                className={`block w-full rounded-lg shadow-sm transition-colors ${
                  !ownerEmail.trim() || error.includes('email')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter your email address"
                value={ownerEmail}
                onChange={(e) => {
                  setOwnerEmail(e.target.value);
                  setError('');
                }}
                disabled={isCheckingEmail}
              />
            </div>
          </div>
        </div>

        {/* Cancellation Reasons Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              What is your main reason for canceling?
              <span className="text-red-600 ml-1">*</span>
            </h3>
            <p className="text-sm text-gray-500">Select one option</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CANCELLATION_REASONS.map(reason => (
              <button
                key={reason}
                type="button"
                onClick={() => selectReason(reason)}
                className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 text-left text-sm ${
                  selectedReason === reason
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : selectedReason && selectedReason !== reason
                    ? 'border-gray-200 bg-gray-50 text-gray-400'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <CheckCircle2 
                  className={`h-5 w-5 mr-2 flex-shrink-0 transition-colors ${
                    selectedReason === reason
                      ? 'text-blue-500'
                      : selectedReason && selectedReason !== reason
                      ? 'text-gray-300'
                      : 'text-gray-400'
                  }`}
                />
                <span className="line-clamp-2">{reason}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Missing Features Section */}
        {showMissingFeatures && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                What features were you looking for?
                <span className="text-red-600 ml-1">*</span>
              </h3>
              <p className="text-sm text-gray-500">Select up-to two features that apply</p>
            </div>
            <div className="space-y-3">
              {MISSING_FEATURES.map(feature => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  disabled={isFeatureDisabled(feature)}
                  className={`w-full flex items-center p-4 border-2 rounded-lg transition-all duration-200 text-left text-sm ${
                    selectedFeatures.includes(feature)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : isFeatureDisabled(feature)
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  <CheckCircle2 
                    className={`h-5 w-5 mr-2 flex-shrink-0 transition-colors ${
                      selectedFeatures.includes(feature)
                        ? 'text-blue-500'
                        : isFeatureDisabled(feature)
                        ? 'text-gray-300'
                        : 'text-gray-400'
                    }`}
                  />
                  <span>{feature}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Additional Feedback Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-2">
            <label 
              htmlFor="feedback" 
              className="text-base font-semibold text-gray-900"
            >
              {requiresFeedback ? (
                <span className="text-red-600">
                  * {selectedFeatures.includes("Something else") 
                      ? "Please describe the additional feature you need" 
                      : "Additional feedback required"}
                </span>
              ) : (
                'Additional Feedback (optional)'
              )}
            </label>
          </div>
          <textarea
            id="feedback"
            rows={4}
            className={`mt-2 block w-full rounded-lg shadow-sm transition-colors ${
              requiresFeedback && !feedback.trim()
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder={requiresFeedback
              ? selectedFeatures.includes("Something else")
                ? 'Please describe the feature you need...'
                : 'Please explain your reason for canceling...'
              : 'Tell us how we can improve...'}
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setError('');
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedReason || isCheckingEmail}
          className="w-full py-4 px-6 rounded-lg bg-blue-600 text-white font-medium text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isCheckingEmail ? 'Checking...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}