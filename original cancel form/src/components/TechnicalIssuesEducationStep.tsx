import React, { useState } from 'react';
import { WrenchIcon, XCircle, CheckCircle2 } from 'lucide-react';
import { sendTechnicalIssueEmails } from '../services/emailService';
import type { EmailData } from '../services/emailService';

type TechnicalIssuesEducationStepProps = {
  onContinue: (continueWithCancellation: boolean, technicalIssue?: string) => void;
  cancellationData: EmailData;
};

export function TechnicalIssuesEducationStep({ onContinue, cancellationData }: TechnicalIssuesEducationStepProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [technicalIssue, setTechnicalIssue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!technicalIssue.trim()) {
      setError('Please describe the technical issue you are experiencing');
      return;
    }

    try {
      // Send notification emails
      await sendTechnicalIssueEmails({
        ...cancellationData,
        technical_issue: technicalIssue
      });
    } catch (error) {
      console.error('Failed to send notification emails:', error);
      // Continue with the flow even if emails fail
    }

    onContinue(false, technicalIssue);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <WrenchIcon className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Let Us Fix This For You
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Technical issues are our top priority. We'd love the opportunity to resolve any problems you're experiencing.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Priority Support
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Our Commitment to You
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Dedicated technical support team
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Priority handling of technical issues
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Direct communication with our engineers
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Regular progress updates
            </li>
          </ul>

          {!showFeedbackForm ? (
            <div className="w-full text-center space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Would you give us a chance to resolve the issue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Yes, let's fix this
                </button>
                <button
                  onClick={() => onContinue(true)}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  No, thanks
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div>
                <label 
                  htmlFor="technical-issue" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Please describe the issue
                  <span className="text-red-600 ml-1">*</span>
                </label>
                <textarea
                  id="technical-issue"
                  rows={4}
                  className={`block w-full rounded-lg shadow-sm ${
                    error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="What technical problems are you experiencing?"
                  value={technicalIssue}
                  onChange={(e) => {
                    setTechnicalIssue(e.target.value);
                    setError('');
                  }}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}