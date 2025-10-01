import React from 'react';
import { LineChart, XCircle, CheckCircle2 } from 'lucide-react';
import { logEducationEvent } from '../lib/educationEvents';

type ReviewOptimizationEducationStepProps = {
  onContinue: (continueWithCancellation: boolean) => void;
  submissionId: string;
};

export function ReviewOptimizationEducationStep({ onContinue, submissionId }: ReviewOptimizationEducationStepProps) {
  React.useEffect(() => {
    // Log that this education step was shown
    logEducationEvent(submissionId, 'review_optimization', 'shown');
  }, [submissionId]);

  const handleContinue = async (continueWithCancellation: boolean) => {
    if (!continueWithCancellation) {
      // Log that user clicked to continue with optimization
      await logEducationEvent(
        submissionId,
        'review_optimization',
        'cta_clicked',
        'schedule_call'
      );
    } else {
      // Log that user chose to continue canceling
      await logEducationEvent(
        submissionId,
        'review_optimization',
        'cta_clicked',
        'continue_canceling'
      );
    }
    onContinue(continueWithCancellation);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <LineChart className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Let's Optimize Your Review Collection
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Our team can help you maximize your review collection potential with a personalized optimization plan
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Free Consultation
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Complete Account Optimization
          </h3>
          <p className="text-sm text-gray-600">
            Let our experts analyze your account and create a tailored plan to boost your review collection rate.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Full account audit
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Specific recommendations
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Implementation assistance
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              30-day follow-up report
            </li>
          </ul>
          <div className="w-full text-center space-y-4">
            <p className="text-sm font-medium text-gray-700">
              Would you be interested to see if we could help?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleContinue(false)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Yes!
              </button>
              <button
                onClick={() => handleContinue(true)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Not Interested
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}