'use client'

import { useState } from 'react'
import { Store, XCircle, CheckCircle2 } from 'lucide-react'
import { FormData } from '../CancellationForm'

interface RetailSyndicationEducationStepProps {
  onNext: (data?: Partial<FormData>) => void
  data: FormData
  onTrackStep: (stepName: string, stepType: string, timeSpent?: number) => Promise<void>
}

export function RetailSyndicationEducationStep({ onNext, data, onTrackStep }: RetailSyndicationEducationStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSupportClick = async () => {
    setIsLoading(true)
    
    try {
      // Send email to support about retail syndication interest
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType: 'retail_syndication_interest',
          data: {
            userEmail: data.email,
            educationType: 'retail_syndication',
            additionalFeedback: data.additionalFeedback
          }
        })
      })

      if (response.ok) {
        setEmailSent(true)
        await onTrackStep('retail_syndication_education', 'support_contacted')
        onNext()
      } else {
        console.error('Failed to send email')
        // Still continue to confirmation screen even if email fails
        await onTrackStep('retail_syndication_education', 'support_contact_failed')
        onNext()
      }
    } catch (error) {
      console.error('Failed to send support email:', error)
      // Still continue to confirmation screen even if email fails
      await onTrackStep('retail_syndication_education', 'support_contact_failed')
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotInterested = async () => {
    setIsLoading(true)
    
    try {
      await onTrackStep('retail_syndication_education', 'education_dismissed')
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Store className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          About Retail Syndication
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          While we don't currently offer direct retail syndication, we have a solution that many merchants use successfully
        </p>
      </div>

      {/* Feature Information Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
        <div className="flex flex-col items-start space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Alternative Solution
          </span>
          <h3 className="text-lg font-bold text-gray-900">
            Manual Review Export Workflow
          </h3>
          <p className="text-sm text-gray-600">
            Many of our merchants have successfully implemented a workflow to share their product reviews with retail partners using our export features.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Export reviews in various formats
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Schedule regular exports (weekly/monthly)
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-500" />
              Share with retail partners for manual import
            </li>
          </ul>
          <p className="text-xs text-gray-600 italic">
            While this isn't automated syndication, it provides a workable solution for sharing your valuable reviews with retail partners.
          </p>
          <button
            onClick={handleSupportClick}
            disabled={isLoading || emailSent}
            className={`w-full mt-2 py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-center ${
              isLoading || emailSent 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {isLoading ? 'Sending...' : emailSent ? 'Email Sent!' : 'Talk to Support'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleNotInterested}
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          <XCircle className="h-5 w-5 mr-2 text-gray-400" />
          Not Interested
        </button>
      </div>
    </div>
  )
}
