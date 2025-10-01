import React from 'react';
import { MessageCircle, XCircle, Palette, CheckCircle2 } from 'lucide-react';

type FeatureEducationStepProps = {
  onContinue: (continueWithCancellation: boolean) => void;
  selectedFeature: string;
};

export function FeatureEducationStep({ onContinue, selectedFeature }: FeatureEducationStepProps) {
  const isGoogleShopping = selectedFeature === "Unable to integrate my reviews into Google Shopping Ads";
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        {isGoogleShopping ? (
          <MessageCircle className="mx-auto h-12 w-12 text-blue-500" />
        ) : (
          <Palette className="mx-auto h-12 w-12 text-blue-500" />
        )}
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Wait! Did You Know?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isGoogleShopping
            ? "We actually do offer Google Shopping Ads Integration!"
            : "You have complete control over your widget design!"}
        </p>
      </div>

      {/* Feature Highlight Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Available Feature
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            {isGoogleShopping
              ? "Full Google Shopping Integration"
              : "Complete Widget Customization"}
          </h3>
          <p className="text-sm text-gray-600">
            {isGoogleShopping
              ? "Our platform fully supports Google Shopping review feeds and integration. Let us help you set this up and get the most out of this powerful feature."
              : "Our widget designer puts you in control. Create the perfect widget that matches your brand and website design with our comprehensive customization tools."}
          </p>
          <ul className="space-y-2">
            {isGoogleShopping ? (
              <>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Automatic review feed generation
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Google Merchant Center integration
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Step-by-step setup guide
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Full CSS customization
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Visual design editor
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                  Multiple layout options
                </li>
              </>
            )}
          </ul>
          <a
            href={isGoogleShopping
              ? "https://support.ravecapture.com/en/articles/1587489-google-shopping-review-feed-requirements-and-setup-guide"
              : "https://app.ravecapture.com/display"}
            
            rel="noopener noreferrer"
            className="w-full mt-2 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
          >
            {isGoogleShopping ? "Show me" : "Show me"}
          </a>
        </div>
      </div>

      {/* Cancellation Section */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-4">
          Still want to proceed with cancellation?
        </p>
        <button
          onClick={() => onContinue(true)}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <XCircle className="h-5 w-5 mr-2 text-gray-400" />
          Not Interested
        </button>
      </div>
    </div>
  );
}