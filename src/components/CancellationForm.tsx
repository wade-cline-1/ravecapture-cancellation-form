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

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const stepOrder = [
      'feedback',
      'review_optimization_education',
      'poor_experience_education', 
      'technical_issues_education',
      'feature_education',
      'review_optimization_calendly',
      'poor_experience_calendly',
      'review_optimization_email_confirmation',
      'poor_experience_email_confirmation',
      'retail_syndication_confirmation',
      'technical_issues_confirmation',
      'retention',
      'future_plans',
      'confirmation'
    ]
    
    const currentIndex = stepOrder.indexOf(formData.currentStep)
    return Math.round(((currentIndex + 1) / stepOrder.length) * 100)
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
      setFormData(prev => ({ ...prev, ...data }))
      
      // Save data to database
      await saveFormData({ ...formData, ...data })
    }
    
    // Determine next step based on current step and form data
    const nextStep = getNextStep(formData.currentStep, formData)
    handleStepChange(nextStep)
  }

  const getNextStep = (currentStep: string, data: FormData): string => {
    switch (currentStep) {
      case 'feedback':
        // Route to education based on cancellation reasons
        if (data.cancellationReasons.includes('Not Getting Enough Reviews')) {
          return 'review_optimization_education'
        }
        if (data.cancellationReasons.includes('Poor Experience')) {
          return 'poor_experience_education'
        }
        if (data.cancellationReasons.includes('Technical Issues')) {
          return 'technical_issues_education'
        }
        if (data.cancellationReasons.includes('Missing Features')) {
          return 'feature_education'
        }
        return 'retention'
      
      case 'review_optimization_education':
        return 'review_optimization_calendly'
      
      case 'poor_experience_education':
        return 'poor_experience_calendly'
      
      case 'technical_issues_education':
        return 'technical_issues_confirmation'
      
      case 'feature_education':
        return 'retail_syndication_confirmation'
      
      case 'review_optimization_calendly':
        return 'review_optimization_email_confirmation'
      
      case 'poor_experience_calendly':
        return 'poor_experience_email_confirmation'
      
      case 'review_optimization_email_confirmation':
      case 'poor_experience_email_confirmation':
      case 'retail_syndication_confirmation':
      case 'technical_issues_confirmation':
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
      <ProgressBar percentage={getProgressPercentage()} />
      {renderCurrentStep()}
    </div>
  )
}
