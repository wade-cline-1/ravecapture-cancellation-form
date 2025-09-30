'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

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
  'Found Better Alternative',
  'No Longer Needed',
  'Other'
]

export function FeedbackStep({ onNext, data }: FeedbackStepProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>(data.cancellationReasons || [])
  const [email, setEmail] = useState(data.email || '')
  const [specificIssues, setSpecificIssues] = useState(data.specificIssues || '')
  const [additionalFeedback, setAdditionalFeedback] = useState(data.additionalFeedback || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    )
  }

  const handleSubmit = async () => {
    if (!email || selectedReasons.length === 0) {
      return
    }

    setIsLoading(true)
    
    try {
      onNext({
        email,
        cancellationReasons: selectedReasons,
        specificIssues: specificIssues || undefined,
        additionalFeedback: additionalFeedback || undefined
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && selectedReasons.length > 0

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
                onClick={() => handleReasonToggle(reason)}
                className={`rc-card-interactive text-left ${
                  selectedReasons.includes(reason) ? 'rc-card-selected' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
                    selectedReasons.includes(reason) ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    {selectedReasons.includes(reason) ? (
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{reason}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

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
