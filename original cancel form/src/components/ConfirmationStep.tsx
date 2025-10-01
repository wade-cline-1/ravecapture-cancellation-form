import React from 'react';
import { CheckCircle2, XCircle, Download, Code2, Clock, Mail, HelpCircle, ArrowRight } from 'lucide-react';
import type { CancellationData } from '../App';

type ConfirmationStepProps = {
  data: CancellationData;
};

export function ConfirmationStep({ data }: ConfirmationStepProps) {
  if (data.accepted_offer) {
    return (
      <div className="text-center space-y-6">
        <div>
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Great Decision!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your 50% discount has been applied to your account. It will be reflected in your next billing cycle.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Thank you for staying with us. We're committed to making your experience better.
          </p>
        </div>
        <div>
          <a
            href="https://app.ravecapture.com/dashboard"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Your Subscription Has Been Canceled
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We're sad to see you go. Your subscription will remain active until the end of your current billing period. In the meantime, consider these off-boarding steps to make the transition as smooth as possible.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {/* Export Data Section */}
          <div className="p-4">
            <div className="flex items-start">
              <Download className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Export Your Data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Don't forget to export your reviews and other important data before leaving.
                </p>
                <a
                  href="https://app.ravecapture.com/account_settings/export"
                  className="mt-2 inline-flex text-sm text-blue-600 hover:text-blue-800"
                >
                  Go to Export Page <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Code Cleanup Section */}
          <div className="p-4">
            <div className="flex items-start">
              <Code2 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Remove Integration Code</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you're migrating to another platform, make sure to remove any RaveCapture or TrustSpot code from your site to prevent conflicts.
                </p>
              </div>
            </div>
          </div>

          {/* Free Plan Section */}
          <div className="p-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Taking a Break?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your account will automatically move to our free plan. You'll maintain access to basic features, and existing widgets will continue to work unless they're part of premium features.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Send Section */}
          <div className="p-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Pause Automated Emails</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you're using automated email campaigns, remember to turn off the Auto-Send functionality.
                </p>
                <a
                  href="https://app.ravecapture.com/campaigns"
                  className="mt-2 inline-flex text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage Campaigns <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <a
            href="https://support.ravecapture.com/en/"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Talk with Support
          </a>
          <a
            href="https://app.ravecapture.com/dashboard"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Account
          </a>
        </div>
      </div>
    </div>
  );
}