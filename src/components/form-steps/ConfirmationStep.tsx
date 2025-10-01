'use client'

import { useEffect } from 'react'
import { FormData } from '../CancellationForm'

interface ConfirmationStepProps {
  data: FormData
}

export function ConfirmationStep({ data }: ConfirmationStepProps) {
  useEffect(() => {
    // Send appropriate emails based on retention decision
    const sendEmails = async () => {
      try {
        if (data.retentionAccepted === true) {
          // Send retention acceptance emails
          const retentionAcceptanceResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emailType: 'retention_acceptance',
              data: {
                userEmail: data.email,
                cancellationReasons: data.cancellationReasons,
                specificIssues: data.specificIssues,
                additionalFeedback: data.additionalFeedback
              }
            })
          })

          const retentionConfirmationResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emailType: 'retention_confirmation',
              data: {
                userEmail: data.email
              }
            })
          })

          if (retentionAcceptanceResponse.ok && retentionConfirmationResponse.ok) {
            console.log('Retention emails sent successfully')
          } else {
            console.error('Failed to send retention emails')
          }
        } else {
          // Send cancellation emails
          const confirmationResponse = await fetch('/api/send-email', {
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

          const notificationResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emailType: 'cancellation_notification',
              data: {
                userEmail: data.email,
                cancellationReasons: data.cancellationReasons,
                specificIssues: data.specificIssues,
                additionalFeedback: data.additionalFeedback
              }
            })
          })

          if (confirmationResponse.ok && notificationResponse.ok) {
            console.log('Cancellation emails sent successfully')
          } else {
            console.error('Failed to send cancellation emails')
          }
        }
      } catch (error) {
        console.error('Error sending emails:', error)
      }
    }

    sendEmails()
  }, [data])

  const isRetentionAccepted = data.retentionAccepted === true

  if (isRetentionAccepted) {
    return (
      <div className="text-center space-y-6">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Great Decision!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your 50% discount has been applied to your account. It will be reflected in your next billing cycle.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Thank you for staying with us. We're committed to making your experience better.
          </p>
        </div>
        <div>
          <a
            href="https://app.ravecapture.com/dashboard"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Your Subscription Has Been Canceled
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We're sad to see you go. Your subscription will remain active until the end of your current billing period. In the meantime, consider these off-boarding steps to make the transition as smooth as possible.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {/* Export Data Section */}
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Export Your Data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Don't forget to export your reviews and other important data before leaving.
                </p>
                <a
                  href="https://app.ravecapture.com/account_settings/export"
                  className="mt-2 inline-flex text-sm text-blue-600 hover:text-blue-800"
                >
                  Go to Export Page
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Code Cleanup Section */}
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Remove Integration Code</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you're migrating to another platform, make sure to remove any RaveCapture or TrustSpot code from your site to prevent conflicts.
                </p>
              </div>
            </div>
          </div>

          {/* Free Plan Section */}
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Taking a Break?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your account will automatically move to our free plan. You'll maintain access to basic features, and existing widgets will continue to work unless they're part of premium features.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-Send Section */}
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Pause Automated Emails</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you're using automated email campaigns, remember to turn off the Auto-Send functionality.
                </p>
                <a
                  href="https://app.ravecapture.com/campaigns"
                  className="mt-2 inline-flex text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage Campaigns
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <a
            href="https://support.ravecapture.com/en/"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Talk with Support
          </a>
          <a
            href="https://app.ravecapture.com/dashboard"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Account
          </a>
        </div>
      </div>
    </div>
  )
}
