'use client'

import { useState } from 'react'
import { Code2, XCircle, CheckCircle2 } from 'lucide-react'
import { FormData } from '../CancellationForm'

interface CustomAPIEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
  onTrackStep: (stepName: string, stepType: string, timeSpent?: number) => Promise<void>
}

export function CustomAPIEducationStep({ onNext, data, onTrackStep }: CustomAPIEducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    
    try {
      await onTrackStep('custom_api_education', 'education_completed')
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAnyway = async () => {
    setIsLoading(true)
    
    try {
      await onTrackStep('custom_api_education', 'education_cancel')
      // Route directly to retention step
      onNext({ currentStep: 'retention' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Code2 className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Custom API Integration Available
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Build a fully customized integration with our powerful API
        </p>
      </div>

      {/* Feature Information Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Developer Solution
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Full Control Over Your Integration
          </h3>
          <p className="text-sm text-gray-600">
            Our RESTful API gives you complete flexibility to customize every aspect of your review collection and display workflow.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Customize order data flow
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Control review request timing
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Create custom widget displays
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Access comprehensive documentation
            </li>
          </ul>
          <a
            href="https://app.ravecapture.com/settings/integrations#api"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
          >
            Show me
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`rc-button-primary ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'I want to learn more'}
        </button>
        
        <button
          onClick={handleCancelAnyway}
          disabled={isLoading}
          className={`rc-button-secondary ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'Cancel Anyway'}
        </button>
      </div>
    </div>
  )
}
