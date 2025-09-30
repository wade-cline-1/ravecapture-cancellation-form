'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface PoorExperienceEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
}

export function PoorExperienceEducationStep({ onNext, data }: PoorExperienceEducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    
    try {
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          We're committed to improving your experience
        </h2>
        <p className="text-gray-600">
          Let's work together to address your concerns
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Personal Support & Improvement Plan
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Dedicated Account Manager</h4>
            <p className="text-sm text-gray-600">
              You'll be assigned a dedicated account manager who will work directly with you to understand and address your specific needs.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📞 Priority Support</h4>
            <p className="text-sm text-gray-600">
              Get priority access to our support team with faster response times and dedicated assistance for your account.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔧 Custom Solutions</h4>
            <p className="text-sm text-gray-600">
              We'll work with you to create custom solutions that address your specific use case and business requirements.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📈 Performance Monitoring</h4>
            <p className="text-sm text-gray-600">
              Regular check-ins and performance monitoring to ensure you're getting the maximum value from our platform.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Our Promise:</strong> We're committed to making your experience better. If we can't improve your experience within 30 days, we'll provide a full refund.
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
          {isLoading ? 'Loading...' : 'Let\'s work together to improve this'}
        </button>
      </div>
    </div>
  )
}
