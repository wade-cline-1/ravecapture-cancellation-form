'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface TechnicalIssuesEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
  onTrackStep: (stepName: string, stepType: string, timeSpent?: number) => Promise<void>
}

export function TechnicalIssuesEducationStep({ onNext, data, onTrackStep }: TechnicalIssuesEducationStepProps) {
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
          Let's resolve your technical issues
        </h2>
        <p className="text-gray-600">
          Our technical team is here to help
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Technical Support & Resolution
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔧 Immediate Issue Resolution</h4>
            <p className="text-sm text-gray-600">
              Our technical team will work directly with you to identify and resolve any technical issues you're experiencing.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📞 Priority Technical Support</h4>
            <p className="text-sm text-gray-600">
              Get direct access to our senior technical team with faster response times and dedicated support for your account.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🛠️ Custom Integration Support</h4>
            <p className="text-sm text-gray-600">
              If you're experiencing integration issues, we'll provide hands-on support to ensure everything works seamlessly.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Performance Optimization</h4>
            <p className="text-sm text-gray-600">
              We'll analyze your setup and optimize performance to ensure you're getting the best possible experience.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Our Commitment:</strong> We'll work tirelessly to resolve your technical issues and ensure your platform works perfectly for your business.
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
          {isLoading ? 'Loading...' : 'Let\'s resolve these issues'}
        </button>
      </div>
    </div>
  )
}
