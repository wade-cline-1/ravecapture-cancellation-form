import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { sendOptimizationRequestEmail } from '../services/emailService';
import type { EmailData } from '../services/emailService';

type ReviewOptimizationCalendlyStepProps = {
  onEmailConnect: () => void;
  cancellationData: EmailData;
};

export function ReviewOptimizationCalendlyStep({ onEmailConnect, cancellationData }: ReviewOptimizationCalendlyStepProps) {
  const handleScheduleClick = () => {
    window.location.href = 'https://calendly.com/wade-cline/account-optimization-clone';
  };

  const handleEmailClick = async () => {
    try {
      await sendOptimizationRequestEmail(cancellationData);
      onEmailConnect();
    } catch (error) {
      console.error('Failed to send notification email:', error);
      // Still proceed to confirmation screen even if email fails
      onEmailConnect();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Calendar className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Let's Boost Your Review Collection!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Schedule your free strategy session to maximize results with RaveCapture
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
        <p className="mt-2 text-sm text-gray-600">
          In this session, we'll analyze your current review collection strategy and provide personalized recommendations to help you maximize results with RaveCapture.
        </p>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            What we'll cover:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Best practices to increase review volume
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Optimization of automated requests & timing
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Customization options to enhance engagement
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Quick wins to improve response rates
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-600 italic">
          This is a free strategy session to ensure you're getting the most out of RaveCapture. Pick a time that works for you—we're here to help!
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleScheduleClick}
          className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          Schedule Consultation
        </button>
        <button
          onClick={handleEmailClick}
          className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Just Connect via Email
        </button>
      </div>
    </div>
  );
}