import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function RetailSyndicationConfirmationStep() {
  return (
    <div className="text-center space-y-6">
      <div>
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          We've Received Your Request
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your interest in learning about our review export solutions. Our support team has been notified and will reach out to discuss options that have worked well for other merchants.
        </p>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>What happens next:</p>
          <ul className="space-y-1">
            <li>• Our team will review your current setup</li>
            <li>• We'll prepare examples of successful export workflows</li>
            <li>• You'll receive an email within 1 business day to discuss options</li>
            <li>• We'll help you implement the best solution for your needs</li>
          </ul>
        </div>
      </div>
      <div>
        <a
          href="https://app.ravecapture.com/dashboard"
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Return to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>
    </div>
  );
}