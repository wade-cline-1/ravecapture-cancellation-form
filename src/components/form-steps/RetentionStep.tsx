'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface RetentionStepProps {
  onNext: (data: Partial<FormData>) => void
  data: FormData
}

export function RetentionStep({ onNext, data }: RetentionStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAcceptRetention = async () => {
    setIsLoading(true)
    
    try {
      onNext({
        retentionAccepted: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeclineRetention = async () => {
    setIsLoading(true)
    
    try {
      onNext({
        retentionAccepted: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Before you go...
        </h2>
        <p className="text-gray-600">
          We'd love to keep you as a valued customer
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Special Retention Offer
          </h3>
          
          <p className="text-lg text-gray-700 mb-4">
            We're offering you a <strong>50% discount</strong> for the next <strong>12 months</strong> to give us another chance to prove our value.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-green-600 mb-2">50% OFF</div>
            <div className="text-sm text-gray-600">For 12 months</div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            This is our way of saying thank you for your feedback and giving us the opportunity to address any concerns you may have.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAcceptRetention}
          disabled={isLoading}
          className="rc-button-primary rc-button-success flex-1"
        >
          {isLoading ? 'Processing...' : 'Yes, I\'ll stay with 50% off'}
        </button>
        
        <button
          onClick={handleDeclineRetention}
          disabled={isLoading}
          className="rc-button-secondary flex-1"
        >
          {isLoading ? 'Processing...' : 'No, I still want to cancel'}
        </button>
      </div>
    </div>
  )
}
