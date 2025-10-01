'use client'

import { useState, useEffect } from 'react'
import { ProgressBar } from './ui/ProgressBar'
import { FeedbackStep } from './form-steps/FeedbackStep'
import { RetentionStep } from './form-steps/RetentionStep'
import { ConfirmationStep } from './form-steps/ConfirmationStep'
import { FuturePlansStep } from './form-steps/FuturePlansStep'

// Education Steps
import { ReviewOptimizationEducationStep } from './education-steps/ReviewOptimizationEducationStep'
import { PoorExperienceEducationStep } from './education-steps/PoorExperienceEducationStep'
import { TechnicalIssuesEducationStep } from './education-steps/TechnicalIssuesEducationStep'
import { FeatureEducationStep } from './education-steps/FeatureEducationStep'
import { CombinedEducationStep } from './education-steps/CombinedEducationStep'
import { CustomAPIEducationStep } from './education-steps/CustomAPIEducationStep'
import { GoogleBusinessEducationStep } from './education-steps/GoogleBusinessEducationStep'
import { RetailSyndicationEducationStep } from './education-steps/RetailSyndicationEducationStep'

// Calendly Integration Steps
import { ReviewOptimizationCalendlyStep } from './calendly-steps/ReviewOptimizationCalendlyStep'
import { PoorExperienceCalendlyStep } from './calendly-steps/PoorExperienceCalendlyStep'

// Email Confirmation Steps
import { ReviewOptimizationEmailConfirmation } from './email-confirmation/ReviewOptimizationEmailConfirmation'
import { PoorExperienceEmailConfirmation } from './email-confirmation/PoorExperienceEmailConfirmation'
import { RetailSyndicationConfirmationStep } from './email-confirmation/RetailSyndicationConfirmationStep'
import { TechnicalIssuesConfirmationStep } from './email-confirmation/TechnicalIssuesConfirmationStep'

export interface FormData {
  email: string
  cancellationReasons: string[]
  specificIssues?: string
  additionalFeedback?: string
  futurePlans?: string
  competitorInfo?: string
  retentionAccepted?: boolean
  currentStep: string
  selectedFeatures?: string[]
}

// Feature flag for simplified flow
const SIMPLIFIED_FLOW = process.env.NEXT_PUBLIC_SIMPLIFIED_FLOW === 'true'

// Debug: Log feature flag status
console.log('🚀 SIMPLIFIED_FLOW feature flag:', SIMPLIFIED_FLOW)

// Terminal steps that should not route to retention
const TERMINAL_STEPS = new Set([
  'confirmation',
  'review_optimization_email_confirmation',
  'poor_experience_email_confirmation',
  'retail_syndication_confirmation',
  'technical_issues_confirmation'
])

// Helper function to check if a step is terminal
function isTerminal(step: string): boolean {
  const result = TERMINAL_STEPS.has(step)
  console.log(`🔍 isTerminal("${step}"):`, result)
  return result
}

// Helper function for progress display (binary logic)
export function getProgressDisplay(currentStep: string) {
  const result = isTerminal(currentStep)
    ? { showPercent: true, percentage: 100 }
    : { showPercent: false, percentage: undefined }; // bar without %
  console.log(`📊 getProgressDisplay("${currentStep}"):`, result)
  return result
}

export function CancellationForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    cancellationReasons: [],
    currentStep: 'feedback'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  // Save form data to database
  const saveFormData = async (data: Partial<FormData>) => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          submissionId: submissionId
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.submissionId && !submissionId) {
          setSubmissionId(result.submissionId)
        }
        return true
      } else {
        console.error('Failed to save form data')
        return false
      }
    } catch (error) {
      console.error('Error saving form data:', error)
      return false
    }
  }

  // Track education step completion
  const trackEducationStep = async (stepName: string, stepType: string, timeSpent?: number) => {
    if (!submissionId) return

    try {
      await fetch('/api/education-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          stepName,
          stepType,
          timeSpent
        })
      })
    } catch (error) {
      console.error('Error tracking education step:', error)
    }
  }


  const handleStepChange = (newStep: string, data?: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      currentStep: newStep,
      ...data
    }))
  }

  const handleNext = async (data?: Partial<FormData>) => {
    if (data) {
      const updatedFormData = { ...formData, ...data }
      setFormData(updatedFormData)
      
      // Save data to database
      await saveFormData(updatedFormData)
      
      // Determine next step based on current step and UPDATED form data
      const nextStep = getNextStep(formData.currentStep, updatedFormData)
      handleStepChange(nextStep)
    } else {
      // Determine next step based on current step and form data
      const nextStep = getNextStep(formData.currentStep, formData)
      handleStepChange(nextStep)
    }
  }

  const getNextStep = (currentStep: string, data: FormData): string => {
    console.log('🔍 getNextStep called:', { currentStep, data })
    
    // Feature flag: Handle terminal steps in simplified flow
    if (SIMPLIFIED_FLOW && isTerminal(currentStep)) {
      console.log('🚫 Terminal step detected - staying on same step')
      console.log('🚫 SIMPLIFIED_FLOW:', SIMPLIFIED_FLOW, 'isTerminal:', isTerminal(currentStep))
      return currentStep; // Terminal - no further navigation
    }
    
    switch (currentStep) {
      case 'feedback':
        // Route to education based on cancellation reasons
        if (data.cancellationReasons.includes('Not Getting Enough Reviews')) {
          console.log('📊 Routing to review optimization education')
          return 'review_optimization_education'
        }
        if (data.cancellationReasons.includes('Poor Experience')) {
          console.log('😞 Routing to poor experience education')
          return 'poor_experience_education'
        }
        if (data.cancellationReasons.includes('Technical Issues')) {
          console.log('🔧 Routing to technical issues education')
          return 'technical_issues_education'
        }
        if (data.cancellationReasons.includes('Missing Features')) {
          // Complex feature detection logic
          const selectedFeatures = data.selectedFeatures || []
          console.log('🎯 Missing Features selected, features:', selectedFeatures)
          
          const hasAPIFeature = selectedFeatures.includes("Lacks integration requirements with my store platform")
          const hasGoogleShoppingFeature = selectedFeatures.includes("Unable to integrate my reviews into Google Shopping Ads")
          const hasGoogleSellerAdsFeature = selectedFeatures.includes("Cannot display reviews in Google Seller Ads")
          const hasRetailSyndicationFeature = selectedFeatures.includes("Doesn't offer Retail Syndication")
          const hasWidgetCustomizationFeature = selectedFeatures.includes("Can't customize my display widgets")
          
          console.log('🔍 Feature detection:', {
            hasAPIFeature,
            hasGoogleShoppingFeature,
            hasGoogleSellerAdsFeature,
            hasRetailSyndicationFeature,
            hasWidgetCustomizationFeature
          })
          
          if (hasAPIFeature && hasGoogleShoppingFeature) {
            console.log('🚀 Routing to combined education')
            return 'combined_education'
          } else if (hasGoogleShoppingFeature) {
            console.log('🛒 Routing to feature education (Google Shopping)')
            return 'feature_education'
          } else if (hasAPIFeature) {
            console.log('⚙️ Routing to custom API education')
            return 'custom_api_education'
          } else if (hasGoogleSellerAdsFeature) {
            console.log('⭐ Routing to Google Business education')
            return 'google_business_education'
          } else if (hasRetailSyndicationFeature) {
            console.log('🏪 Routing to retail syndication education')
            return 'retail_syndication_education'
          } else if (hasWidgetCustomizationFeature) {
            console.log('🎨 Routing to feature education (Widget)')
            return 'feature_education'
          } else {
            console.log('❌ No specific features detected, routing to retention')
            return 'retention'
          }
        }
        console.log('🔄 Default routing to retention')
        return 'retention'
      
      case 'review_optimization_education':
        return 'review_optimization_calendly'
      
      case 'poor_experience_education':
        return 'poor_experience_calendly'
      
      case 'technical_issues_education':
        return 'technical_issues_confirmation'
      
      case 'feature_education':
        return 'retention'
      
      case 'combined_education':
        return 'retention'
      
      case 'custom_api_education':
        return 'retention'
      
      case 'google_business_education':
        return 'retention'
      
      case 'retail_syndication_education':
        return 'retail_syndication_confirmation'
      
      case 'review_optimization_calendly':
        return 'review_optimization_email_confirmation'
      
      case 'poor_experience_calendly':
        return 'poor_experience_email_confirmation'
      
      case 'review_optimization_email_confirmation':
      case 'poor_experience_email_confirmation':
      case 'retail_syndication_confirmation':
      case 'technical_issues_confirmation':
        // Feature flag: Terminal steps don't route to retention in simplified flow
        if (SIMPLIFIED_FLOW) {
          console.log('🚫 Simplified flow: Terminal step staying on same step')
          console.log('🚫 Current step:', currentStep, 'SIMPLIFIED_FLOW:', SIMPLIFIED_FLOW)
          return currentStep; // Terminal - no further navigation
        }
        console.log('📈 Legacy flow: Routing to retention')
        return 'retention'
      
      case 'retention':
        if (data.retentionAccepted) {
          return 'confirmation'
        } else {
          return 'future_plans'
        }
      
      case 'future_plans':
        return 'confirmation'
      
      default:
        return 'confirmation'
    }
  }

  const renderCurrentStep = () => {
    switch (formData.currentStep) {
      case 'feedback':
        return <FeedbackStep onNext={handleNext} data={formData} />
      
      case 'review_optimization_education':
        return <ReviewOptimizationEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'poor_experience_education':
        return <PoorExperienceEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'technical_issues_education':
        return <TechnicalIssuesEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'feature_education':
        return <FeatureEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'combined_education':
        return <CombinedEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'custom_api_education':
        return <CustomAPIEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'google_business_education':
        return <GoogleBusinessEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'retail_syndication_education':
        return <RetailSyndicationEducationStep onNext={handleNext} data={formData} onTrackStep={trackEducationStep} />
      
      case 'review_optimization_calendly':
        return <ReviewOptimizationCalendlyStep onNext={handleNext} data={formData} />
      
      case 'poor_experience_calendly':
        return <PoorExperienceCalendlyStep onNext={handleNext} data={formData} />
      
      case 'review_optimization_email_confirmation':
        return <ReviewOptimizationEmailConfirmation onNext={handleNext} data={formData} />
      
      case 'poor_experience_email_confirmation':
        return <PoorExperienceEmailConfirmation onNext={handleNext} data={formData} />
      
      case 'retail_syndication_confirmation':
        return <RetailSyndicationConfirmationStep onNext={handleNext} data={formData} />
      
      case 'technical_issues_confirmation':
        return <TechnicalIssuesConfirmationStep onNext={handleNext} data={formData} />
      
      case 'retention':
        return <RetentionStep onNext={handleNext} data={formData} />
      
      case 'future_plans':
        return <FuturePlansStep onNext={handleNext} data={formData} />
      
      case 'confirmation':
        return <ConfirmationStep data={formData} />
      
      default:
        return <FeedbackStep onNext={handleNext} data={formData} />
    }
  }

  return (
    <div className="space-y-6">
      <ProgressBar {...getProgressDisplay(formData.currentStep)} />
      {renderCurrentStep()}
    </div>
  )
}
