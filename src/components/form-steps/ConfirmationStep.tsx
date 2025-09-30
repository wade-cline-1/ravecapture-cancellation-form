'use client'

import { useEffect } from 'react'
import { FormData } from '../CancellationForm'

interface ConfirmationStepProps {
  data: FormData
}

export function ConfirmationStep({ data }: ConfirmationStepProps) {
  useEffect(() => {
    // Send confirmation email when component mounts
    const sendConfirmationEmail = async () => {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailType: 'cancellation_confirmation',
            data: {
              userEmail: data.email,
              cancellationReasons: data.cancellationReasons,
              specificIssues: data.specificIssues,
              additionalFeedback: data.additionalFeedback
            }
          })
        })

        if (response.ok) {
          console.log('Confirmation email sent successfully')
        } else {
          console.error('Failed to send confirmation email')
        }
      } catch (error) {
        console.error('Error sending confirmation email:', error)
      }
    }

    sendConfirmationEmail()
  }, [data])

  const isRetentionAccepted = data.retentionAccepted === true

  return (
    <div className="space-y-6">
      <div className="text-center">
        {isRetentionAccepted ? (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank you for staying with us!
            </h2>
            <p className="text-gray-600">
              Your 50% discount has been applied to your account
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cancellation has been processed
            </h2>
            <p className="text-gray-600">
              We're sorry to see you go
            </p>
          </>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h3>
        
        {isRetentionAccepted ? (
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Your 50% discount has been applied to your account for the next 12 months
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  You'll receive a confirmation email with your new billing details
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Our team will reach out to ensure you're getting the most value from RaveCapture
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Your account will be cancelled at the end of your current billing period
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  You'll receive a confirmation email with the cancellation details
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-gray-400 rounded-full mt-2"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  You can still access your account until the end of your billing period
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Thank you for your feedback. It helps us improve our service for other customers.
        </p>
      </div>
    </div>
  )
}
