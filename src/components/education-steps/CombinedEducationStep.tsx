'use client'

import { useState } from 'react'
import { Code2, MessageCircle, XCircle, CheckCircle2 } from 'lucide-react'
import { FormData } from '../CancellationForm'

interface CombinedEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
  onTrackStep: (stepName: string, stepType: string, timeSpent?: number) => Promise<void>
}

export function CombinedEducationStep({ onNext, data, onTrackStep }: CombinedEducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    
    try {
      await onTrackStep('combined_education', 'education_completed')
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAnyway = async () => {
    setIsLoading(true)
    
    try {
      await onTrackStep('combined_education', 'education_cancel')
      // Route directly to retention step
      onNext({ currentStep: 'retention' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center items-center space-x-2">
          <Code2 className="h-12 w-12 text-blue-500" />
          <MessageCircle className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Solutions Available for Your Integration Needs
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We offer solutions for both custom platform integration and Google Shopping review display
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Integration Column */}
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

        {/* Google Shopping Column */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
          <div className="flex flex-col items-start space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Available Feature
            </span>
            <h3 className="text-lg font-bold text-gray-900">
              Full Google Shopping Integration
            </h3>
            <p className="text-sm text-gray-600">
              Our platform fully supports Google Shopping review feeds and integration. Let us help you set this up and get the most out of this powerful feature.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                Automatic review feed generation
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                Google Merchant Center integration
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                Step-by-step setup guide
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
                Dedicated support team
              </li>
            </ul>
            <a
              href="https://support.ravecapture.com/en/articles/1587489-google-shopping-review-feed-requirements-and-setup-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center"
            >
              Talk to Support
            </a>
          </div>
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
