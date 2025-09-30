'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface ReviewOptimizationEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
  onTrackStep?: (stepName: string, stepType: string, timeSpent?: number) => void
}

export function ReviewOptimizationEducationStep({ onNext, data, onTrackStep }: ReviewOptimizationEducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    
    try {
      // Track education step completion
      if (onTrackStep) {
        onTrackStep('review_optimization_education', 'education', undefined)
      }
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's optimize your review collection
        </h2>
        <p className="text-gray-600">
          We have proven strategies to help you get more reviews
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Review Collection Optimization
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Targeted Review Requests</h4>
            <p className="text-sm text-gray-600">
              Send personalized review requests to customers who are most likely to leave positive reviews based on their interaction history.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">⏰ Optimal Timing</h4>
            <p className="text-sm text-gray-600">
              Our AI determines the best time to send review requests based on customer behavior patterns and purchase history.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📱 Multi-Channel Approach</h4>
            <p className="text-sm text-gray-600">
              Reach customers through email, SMS, and social media to maximize your review collection opportunities.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔄 Automated Follow-ups</h4>
            <p className="text-sm text-gray-600">
              Automatically follow up with customers who haven't left reviews yet, with personalized messages that increase response rates.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Success Story:</strong> "We increased our review volume by 340% in just 3 months using RaveCapture's optimization strategies." - Sarah M., E-commerce Store Owner
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`rc-button-primary ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'I\'m interested - let\'s talk'}
        </button>
      </div>
    </div>
  )
}
