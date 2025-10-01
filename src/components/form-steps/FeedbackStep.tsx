'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'
import { toCanonical } from '../../lib/database'

interface FeedbackStepProps {
  onNext: (data: Partial<FormData>) => void
  data: FormData
}

const cancellationReasons = [
  'Not Getting Enough Reviews',
  'Poor Experience',
  'Technical Issues',
  'Missing Features',
  'Too Expensive',
  'Not Seeing Enough Value', // Canonical: was "Found Better Alternative"
  'Only Needed Temporarily', // Canonical: was "No Longer Needed"
  'Something Else' // Canonical: was "Other"
]

const MISSING_FEATURES = [
  "Unable to integrate my reviews into Google Shopping Ads",
  "Cannot display reviews in Google Seller Ads", 
  "Lacks integration requirements with my store platform",
  "Can't customize my display widgets",
  "Doesn't offer Retail Syndication",
  "Something else"
]

export function FeedbackStep({ onNext, data }: FeedbackStepProps) {
  // Single-select reason (instead of array)
  const [selectedReason, setSelectedReason] = useState<string>(data.cancellationReasons?.[0] || '')
  const [email, setEmail] = useState(data.email || '')
  const [specificIssues, setSpecificIssues] = useState(data.specificIssues || '')
  const [additionalFeedback, setAdditionalFeedback] = useState(data.additionalFeedback || '')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason)
    
    // Clear features if "Missing Features" is deselected
    if (selectedReason === 'Missing Features' && reason !== 'Missing Features') {
      setSelectedFeatures([])
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      // If feature is already selected, remove it
      if (prev.includes(feature)) {
        return prev.filter(f => f !== feature)
      }

      // Handle "Something else" selection
      if (feature === "Something else") {
        return [...prev, feature]
      }

      // Get current regular features (excluding "Something else")
      const regularFeatures = prev.filter(f => f !== "Something else")
      const hasSomethingElse = prev.includes("Something else")

      // If trying to select a third regular feature, prevent it
      if (regularFeatures.length >= 2) {
        return prev
      }

      // Add the new feature while preserving both existing regular features and "Something else"
      const newFeatures = [...regularFeatures, feature]
      return hasSomethingElse ? [...newFeatures, "Something else"] : newFeatures
    })
  }

  const isFeatureDisabled = (feature: string) => {
    if (feature === "Something else") return false
    const regularFeatures = selectedFeatures.filter(f => f !== "Something else")
    return regularFeatures.length >= 2 && !selectedFeatures.includes(feature)
  }

  const handleSubmit = async () => {
    if (!email || !selectedReason) {
      return
    }

    // Validate "Something Else" requires additional feedback
    if (selectedReason === 'Something Else' && !additionalFeedback.trim()) {
      return
    }

    // Validate missing features selection
    if (selectedReason === 'Missing Features' && selectedFeatures.length === 0) {
      return
    }

    setIsLoading(true)
    
    try {
      // Apply reason mapping to canonical taxonomy
      const canonicalReason = toCanonical(selectedReason)
      console.log('🔄 Reason mapping:', selectedReason, '→', canonicalReason)
      
      onNext({
        email,
        cancellationReasons: [canonicalReason], // Use canonical reason
        specificIssues: specificIssues || undefined,
        additionalFeedback: additionalFeedback || undefined,
        ...(selectedFeatures.length > 0 && { selectedFeatures })
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && selectedReason && 
    (selectedReason !== 'Something Else' || additionalFeedback.trim()) &&
    (selectedReason !== 'Missing Features' || selectedFeatures.length > 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Help us understand why you're cancelling
        </h2>
        <p className="text-gray-600">
          Your feedback helps us improve our service
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are the main reasons for cancelling? <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cancellationReasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleReasonSelect(reason)}
                className={`rc-card-interactive text-left ${
                  selectedReason === reason ? 'rc-card-selected' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                    selectedReason === reason ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    {selectedReason === reason ? (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{reason}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Missing Features Section */}
        {selectedReason === 'Missing Features' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What features were you looking for? <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Select up to two features that apply</p>
            <div className="space-y-3">
              {MISSING_FEATURES.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleFeatureToggle(feature)}
                  disabled={isFeatureDisabled(feature)}
                  className={`rc-card-interactive text-left w-full ${
                    selectedFeatures.includes(feature) ? 'rc-card-selected' : ''
                  } ${
                    isFeatureDisabled(feature) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                      selectedFeatures.includes(feature) ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {selectedFeatures.includes(feature) ? (
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rc-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="specificIssues" className="block text-sm font-medium text-gray-700 mb-2">
            Can you tell us more about the specific issues you've experienced?
          </label>
          <textarea
            id="specificIssues"
            value={specificIssues}
            onChange={(e) => setSpecificIssues(e.target.value)}
            className="rc-input resize-none"
            rows={3}
            placeholder="Please describe any specific problems or issues..."
          />
        </div>

        <div>
          <label htmlFor="additionalFeedback" className="block text-sm font-medium text-gray-700 mb-2">
            Any additional feedback or suggestions?
          </label>
          <textarea
            id="additionalFeedback"
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            className="rc-input resize-none"
            rows={3}
            placeholder="We'd love to hear your thoughts on how we can improve..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`rc-button-primary ${
            !isFormValid || isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
