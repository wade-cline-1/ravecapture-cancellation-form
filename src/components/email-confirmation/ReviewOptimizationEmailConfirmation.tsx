'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Clock, Calendar } from 'lucide-react'

interface ReviewOptimizationEmailConfirmationProps {
  onNext: (data?: any) => void
  data: any
}

export function ReviewOptimizationEmailConfirmation({ onNext, data }: ReviewOptimizationEmailConfirmationProps) {
  const [emailSent, setEmailSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Auto-send email when component mounts
    sendFollowUpEmail()
  }, [])

  const sendFollowUpEmail = async () => {
    setIsSending(true)
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType: 'review_optimization_followup',
          data: {
            userEmail: data.email,
            educationType: 'review_optimization',
            calendlyUrl: data.calendlyScheduled ? 'https://calendly.com/ravecapture/review-optimization' : undefined
          }
        })
      })

      if (response.ok) {
        setEmailSent(true)
      } else {
        console.error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Follow-up Email Sent
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We've sent you a detailed email with review optimization strategies and next steps.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-blue-500 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Email Contents</h3>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Proven strategies to increase review volume</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Best practices for review request timing</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Platform-specific optimization tips</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Template examples and messaging guides</span>
              </li>
              {data.calendlyScheduled && (
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Link to schedule your consultation call</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {data.calendlyScheduled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">Consultation Scheduled</h3>
          </div>
          <p className="text-green-800 text-sm">
            You've scheduled a consultation call. Check your email for the calendar invite and preparation details.
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Clock className="w-5 h-5 text-gray-500 mt-1" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">What's Next?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Check your email (including spam folder) for our detailed follow-up. The email contains actionable strategies 
              you can implement immediately to improve your review collection.
            </p>
          </div>
        </div>
      </div>

      {isSending && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Sending email...
          </div>
        </div>
      )}

      {emailSent && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-2" />
            Email sent successfully!
          </div>
        </div>
      )}

      <button 
        onClick={handleContinue}
        className="rc-button-primary w-full"
      >
        Continue
      </button>
    </div>
  )
}

