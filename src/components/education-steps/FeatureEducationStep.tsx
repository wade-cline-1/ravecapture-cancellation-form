'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface FeatureEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
}

export function FeatureEducationStep({ onNext, data }: FeatureEducationStepProps) {
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
          Let's explore the features you need
        </h2>
        <p className="text-gray-600">
          We have many features that might address your needs
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-500 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Advanced Features & Integrations
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🛒 Google Shopping Ads Integration</h4>
            <p className="text-sm text-gray-600">
              Automatically sync your product reviews to Google Shopping Ads to improve ad performance and click-through rates.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔗 Custom API Access</h4>
            <p className="text-sm text-gray-600">
              Full API access to integrate RaveCapture with your existing systems and workflows.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🏪 Retail Syndication</h4>
            <p className="text-sm text-gray-600">
              Distribute your reviews across multiple retail platforms including Amazon, Walmart, and more.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🏢 Google Business Integration</h4>
            <p className="text-sm text-gray-600">
              Seamlessly manage your Google Business Profile reviews alongside your other review platforms.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Custom Solutions:</strong> We can create custom integrations and features specifically for your business needs.
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
          {isLoading ? 'Loading...' : 'Show me these features'}
        </button>
      </div>
    </div>
  )
}
