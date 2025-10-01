import React, { useState } from 'react';
import { FeedbackStep } from './components/FeedbackStep';
import { RetentionStep } from './components/RetentionStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { FeatureEducationStep } from './components/FeatureEducationStep';
import { RetailSyndicationEducationStep } from './components/RetailSyndicationEducationStep';
import { RetailSyndicationConfirmationStep } from './components/RetailSyndicationConfirmationStep';
import { GoogleBusinessEducationStep } from './components/GoogleBusinessEducationStep';
import { CustomAPIEducationStep } from './components/CustomAPIEducationStep';
import { PoorExperienceEducationStep } from './components/PoorExperienceEducationStep';
import { PoorExperienceCalendlyStep } from './components/PoorExperienceCalendlyStep';
import { PoorExperienceEmailConfirmation } from './components/PoorExperienceEmailConfirmation';
import { ReviewOptimizationEducationStep } from './components/ReviewOptimizationEducationStep';
import { ReviewOptimizationCalendlyStep } from './components/ReviewOptimizationCalendlyStep';
import { ReviewOptimizationEmailConfirmation } from './components/ReviewOptimizationEmailConfirmation';
import { CombinedEducationStep } from './components/CombinedEducationStep';
import { TechnicalIssuesEducationStep } from './components/TechnicalIssuesEducationStep';
import { TechnicalIssuesConfirmationStep } from './components/TechnicalIssuesConfirmationStep';
import { FuturePlansStep } from './components/FuturePlansStep';
import { supabase } from './lib/supabase';
import { sendPoorExperienceFollowUpEmail } from './services/emailService';
import type { CancellationSubmission, CancellationFeedback, CancellationRetention } from './lib/supabase';

export type CancellationData = {
  reasons: string[];
  feedback: string;
  accepted_offer: boolean;
  owner_email: string;
  technical_issue?: string;
  future_plan?: string;
  competitor?: string;
};

function App() {
  const [step, setStep] = useState(1);
  const [cancellationData, setCancellationData] = useState<CancellationData>({
    reasons: [],
    feedback: '',
    accepted_offer: false,
    owner_email: '',
  });
  const [selectedFeature, setSelectedFeature] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const isFinalStep = (currentStep: number): boolean => {
    return (
      currentStep === 3 || // ConfirmationStep
      currentStep === 1.35 || // ReviewOptimizationEmailConfirmation
      currentStep === 1.45 || // PoorExperienceEmailConfirmation
      currentStep === 1.76 || // RetailSyndicationConfirmationStep
      currentStep === 1.96 // TechnicalIssuesConfirmationStep
    );
  };

  const getProgressPercentage = (): number => {
    if (isFinalStep(step)) {
      return 100;
    }
    return (step / 3) * 100;
  };

  const handleFeedbackSubmit = async (reasons: string[], feedback: string, owner_email: string, features?: string[]) => {
    setCancellationData(prev => ({ ...prev, reasons, feedback, owner_email }));
    
    // Create the initial submission record when feedback is submitted
    const { data: submission, error: submissionError } = await supabase
      .from('cancellation_submissions')
      .insert([{
        user_email: owner_email,
        current_step: 'education',
        status: 'in_progress',
        last_activity_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return;
    }

    setSubmissionId(submission.id);

    // Save feedback
    const { error: feedbackError } = await supabase
      .from('cancellation_feedback')
      .insert([{
        submission_id: submission.id,
        reasons,
        feedback_text: feedback,
        missing_features: features || []
      }]);

    if (feedbackError) {
      console.error('Error saving feedback:', feedbackError);
    }
    
    const { reasons: selectedReasons } = { reasons, feedback, owner_email };
    if (selectedReasons.includes('Technical Issues')) {
      setStep(1.95);
    } else if (selectedReasons.includes('Not Getting Enough Reviews')) {
      setStep(1.3);
    } else if (selectedReasons.includes('Poor Experience')) {
      setStep(1.4);
    } else if (selectedReasons.includes('Missing Features')) {
      const featuresList = feedback.split('\n').filter(line => line.startsWith('- '));
      const hasAPIFeature = featuresList.includes("- Lacks integration requirements with my store platform");
      const hasGoogleShoppingFeature = featuresList.includes("- Unable to integrate my reviews into Google Shopping Ads");
      
      if (hasAPIFeature && hasGoogleShoppingFeature) {
        setStep(1.6);
      } else if (hasGoogleShoppingFeature) {
        setSelectedFeature("Unable to integrate my reviews into Google Shopping Ads");
        setStep(1.5);
      } else if (hasAPIFeature) {
        setStep(1.9);
      } else if (featuresList.includes("- Cannot display reviews in Google Seller Ads")) {
        setStep(1.8);
      } else if (featuresList.includes("- Doesn't offer Retail Syndication")) {
        setStep(1.75);
      } else if (featuresList.includes("- Can't customize my display widgets")) {
        setSelectedFeature(featuresList[0].substring(2));
        setStep(1.5);
      } else {
        setStep(2);
      }
    } else {
      setStep(2);
    }
  };

  const updateSubmission = async (updates: Partial<CancellationSubmission>) => {
    if (!submissionId) return;

    const { error } = await supabase
      .from('cancellation_submissions')
      .update(updates)
      .eq('id', submissionId);

    if (error) {
      console.error('Error updating submission:', error);
    }
  };

  const saveRetention = async (retention: Partial<CancellationRetention>) => {
    if (!submissionId) return;

    const { error } = await supabase
      .from('cancellation_retention')
      .insert([{
        submission_id: submissionId,
        ...retention
      }]);

    if (error) {
      console.error('Error saving retention:', error);
    }
  };

  const handleTechnicalIssuesContinue = async (continueWithCancellation: boolean, technicalIssue?: string) => {
    if (continueWithCancellation) {
      await updateSubmission({
        current_step: 'retention',
        last_activity_at: new Date().toISOString()
      });
      setStep(2);
    } else if (technicalIssue && submissionId) {
      setCancellationData(prev => ({ ...prev, technical_issue: technicalIssue }));
      
      // Update the technical issue description in the feedback table
      const { error: feedbackError } = await supabase
        .from('cancellation_feedback')
        .update({ technical_issue_description: technicalIssue })
        .eq('submission_id', submissionId);

      if (feedbackError) {
        console.error('Error updating technical issue description:', feedbackError);
      }

      await updateSubmission({
        status: 'retained',
        completed_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });
      setStep(1.96);
    }
  };

  const handleFeatureEducationContinue = async (continueWithCancellation: boolean) => {
    if (continueWithCancellation) {
      await updateSubmission({
        current_step: 'retention',
        last_activity_at: new Date().toISOString()
      });
      setStep(2);
    } else if (step === 1.75) {
      await updateSubmission({
        status: 'retained',
        completed_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });
      setStep(1.76);
    }
  };

  const handleReviewOptimizationContinue = async (continueWithCancellation: boolean) => {
    if (continueWithCancellation) {
      await updateSubmission({
        current_step: 'retention',
        last_activity_at: new Date().toISOString()
      });
      setStep(2);
    } else {
      setStep(1.31);
    }
  };

  const handlePoorExperienceContinue = async (continueWithCancellation: boolean) => {
    if (continueWithCancellation) {
      await updateSubmission({
        current_step: 'retention',
        last_activity_at: new Date().toISOString()
      });
      setStep(2);
    } else {
      setStep(1.41); // Take them to PoorExperienceCalendlyStep
    }
  };

  const handleRetentionDecision = async (acceptedOffer: boolean) => {
    setCancellationData(prev => ({ ...prev, accepted_offer: acceptedOffer }));
    
    const now = new Date().toISOString();
    await saveRetention({
      offer_shown_at: now,
      offer_accepted: acceptedOffer,
      response_at: now
    });

    if (acceptedOffer) {
      await updateSubmission({
        status: 'retained',
        completed_at: now,
        last_activity_at: now
      });
      setStep(3);
    } else {
      await updateSubmission({
        current_step: 'future_plans',
        last_activity_at: now
      });
      setStep(2.5);
    }
  };

  const handleFuturePlansSubmit = async (plan: string, competitor?: string) => {
    setCancellationData(prev => ({ ...prev, future_plan: plan, competitor }));
    
    await saveRetention({
      future_plan: plan,
      competitor
    });

    await updateSubmission({
      status: 'cancelled',
      completed_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString()
    });

    setStep(3);
  };

  const handleEmailConnect = async () => {
    try {
      // Send email to Wade about the poor experience
      await sendPoorExperienceFollowUpEmail(cancellationData);
      
      await updateSubmission({
        status: 'retained',
        completed_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      });
      setStep(1.45);
    } catch (error) {
      console.error('Failed to send poor experience follow-up email:', error);
      // Continue to confirmation screen even if email fails
      setStep(1.45);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="h-2 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          <div className="p-8">
            {step === 1 && (
              <FeedbackStep onSubmit={handleFeedbackSubmit} />
            )}
            {step === 1.3 && submissionId && (
              <ReviewOptimizationEducationStep
                onContinue={handleReviewOptimizationContinue}
                submissionId={submissionId}
              />
            )}
            {step === 1.31 && (
              <ReviewOptimizationCalendlyStep
                onEmailConnect={handleEmailConnect}
                cancellationData={cancellationData}
              />
            )}
            {step === 1.35 && (
              <ReviewOptimizationEmailConfirmation />
            )}
            {step === 1.4 && (
              <PoorExperienceEducationStep
                onContinue={handlePoorExperienceContinue}
              />
            )}
            {step === 1.41 && (
              <PoorExperienceCalendlyStep
                onEmailConnect={handleEmailConnect}
                cancellationData={cancellationData}
              />
            )}
            {step === 1.45 && (
              <PoorExperienceEmailConfirmation />
            )}
            {step === 1.5 && (
              <FeatureEducationStep
                onContinue={handleFeatureEducationContinue}
                selectedFeature={selectedFeature}
              />
            )}
            {step === 1.6 && (
              <CombinedEducationStep
                onContinue={handleFeatureEducationContinue}
              />
            )}
            {step === 1.75 && (
              <RetailSyndicationEducationStep
                onContinue={handleFeatureEducationContinue}
                cancellationData={cancellationData}
              />
            )}
            {step === 1.76 && (
              <RetailSyndicationConfirmationStep />
            )}
            {step === 1.8 && (
              <GoogleBusinessEducationStep
                onContinue={handleFeatureEducationContinue}
              />
            )}
            {step === 1.9 && (
              <CustomAPIEducationStep
                onContinue={handleFeatureEducationContinue}
              />
            )}
            {step === 1.95 && (
              <TechnicalIssuesEducationStep
                onContinue={handleTechnicalIssuesContinue}
                cancellationData={cancellationData}
              />
            )}
            {step === 1.96 && (
              <TechnicalIssuesConfirmationStep />
            )}
            {step === 2 && (
              <RetentionStep onDecision={handleRetentionDecision} />
            )}
            {step === 2.5 && (
              <FuturePlansStep onSubmit={handleFuturePlansSubmit} />
            )}
            {step === 3 && (
              <ConfirmationStep data={cancellationData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;