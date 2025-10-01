import React from 'react';
import { HeartHandshake, CheckCircle2, Calendar, Mail } from 'lucide-react';
import type { EmailData } from '../services/emailService';

type PoorExperienceCalendlyStepProps = {
  onEmailConnect: () => void;
  cancellationData: EmailData;
};

export function PoorExperienceCalendlyStep({ onEmailConnect, cancellationData }: PoorExperienceCalendlyStepProps) {
  const handleScheduleClick = () => {
    window.location.href = 'https://calendly.com/wade-cline/discussionaboutcurrentplan';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <HeartHandshake className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Let's Make Things Right
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Our General Manager, Wade, would like to personally discuss your experience
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
        <p className="text-gray-800 font-medium">
          We're truly sorry about your experience with RaveCapture
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Your satisfaction is our top priority. Wade would like to personally discuss your experience and ensure we address all your concerns.
        </p>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Our commitment to you:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Direct attention from our leadership team
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Immediate action on your concerns
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Personalized solutions to improve your experience
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              Ongoing support to ensure your success
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-600 italic">
          We value your feedback and want to ensure you have the best possible experience with RaveCapture. Let's have an open conversation about how we can better serve you.
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleScheduleClick}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Schedule time with Wade
          </button>
          <button
            onClick={onEmailConnect}
            className="w-full flex items-center justify-center py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Ask Wade to follow up
          </button>
        </div>
      </div>
    </div>
  );
}