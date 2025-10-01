import React from 'react';
import { HeartHandshake, XCircle, CheckCircle2 } from 'lucide-react';

type PoorExperienceEducationStepProps = {
  onContinue: (continueWithCancellation: boolean) => void;
};

export function PoorExperienceEducationStep({ onContinue }: PoorExperienceEducationStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <HeartHandshake className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          We Want to Make Things Right
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We're truly sorry to hear about your poor experience with RaveCapture
        </p>
      </div>

      {/* Feature Information Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Personal Attention
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Let's Have a Conversation
          </h3>
          <p className="text-sm text-gray-600">
            Our General Manager, Wade, would love the opportunity to personally discuss your experience and find a way to make it right.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Direct conversation with our GM
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Address your specific concerns
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Find a solution that works for you
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Personalized plan moving forward
            </li>
          </ul>
          <div className="w-full text-center space-y-4">
            <p className="text-sm font-medium text-gray-700">
              Would you give us a chance to make things right?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onContinue(false)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Yes, let's talk
              </button>
              <button
                onClick={() => onContinue(true)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}