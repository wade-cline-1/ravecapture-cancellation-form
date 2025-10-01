import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';
import { sendRetentionAcceptanceEmail, sendRetentionConfirmationEmail } from '../services/emailService';
import { supabase } from '../lib/supabase';

type RetentionStepProps = {
  onDecision: (acceptedOffer: boolean) => void;
};

export function RetentionStep({ onDecision }: RetentionStepProps) {
  const handleAcceptOffer = async () => {
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
        // Send email to admin team
        await sendRetentionAcceptanceEmail({
          user_email: submissions.user_email,
          reasons: submissions.cancellation_feedback?.reasons || [],
          feedback: submissions.cancellation_feedback?.feedback_text || '',
          owner_email: submissions.user_email
        });

        // Send confirmation email to user
        await sendRetentionConfirmationEmail(submissions.user_email);
      }
    } catch (error) {
      console.error('Failed to send retention emails:', error);
      // Continue with the flow even if emails fail
    }
    onDecision(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <img 
          src="https://ravecapture.com/wp-content/uploads/2025/03/SVG-Icon.svg"
          alt="RaveCapture Logo"
          className="mx-auto h-14 w-14"
        />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          What about a Special Offer?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We value your partnership and would love to have you stay
        </p>
      </div>

      {/* Special Offer Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Limited Time Offer
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Save 50% for the Next 12 Months
          </h3>
          <p className="text-sm text-gray-600">
            We'd hate to see you go. Take advantage of this exclusive discount and continue enjoying all the benefits of your current plan at half the price.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              50% off your current plan
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Lock in this rate for 12 months
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              No commitments - cancel anytime
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              BONUS: Unlimited Email Credits!
            </li>
          </ul>
          <button
            onClick={handleAcceptOffer}
            className="w-full mt-2 py-3 px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Accept Offer & Continue
          </button>
        </div>
      </div>

      {/* Cancellation Section */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-4">
          Not interested in the offer?
        </p>
        <button
          onClick={() => onDecision(false)}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <XCircle className="h-5 w-5 mr-2 text-gray-400" />
          Continue with cancellation
        </button>
      </div>
    </div>
  );
}