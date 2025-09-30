'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Heart, MessageCircle } from 'lucide-react'

interface PoorExperienceEmailConfirmationProps {
  onNext: (data?: any) => void
  data: any
}

export function PoorExperienceEmailConfirmation({ onNext, data }: PoorExperienceEmailConfirmationProps) {
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
          emailType: 'poor_experience_followup',
          data: {
            userEmail: data.email,
            educationType: 'poor_experience',
            calendlyUrl: data.calendlyScheduled ? 'https://calendly.com/ravecapture/experience-review' : undefined
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
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          We're Here to Help
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We've sent you a personalized email with immediate steps to address your concerns and improve your experience.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-red-500 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Email Contents</h3>
            <ul className="text-red-800 space-y-2">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Immediate steps to resolve your specific issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Direct contact information for our support team</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Escalation process for urgent concerns</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Compensation or service recovery options</span>
              </li>
              {data.calendlyScheduled && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Link to schedule your experience review call</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {data.calendlyScheduled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-3">
            <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">Experience Review Scheduled</h3>
          </div>
          <p className="text-green-800 text-sm">
            You've scheduled an experience review call. Our team will personally address your concerns and work with you to find solutions.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">💬</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Our Commitment</h4>
            <p className="text-sm text-blue-700 mt-1">
              We take your feedback seriously and are committed to making things right. The email contains immediate 
              action items and direct contact information for our customer success team.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">What happens next?</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">1.</span>
            <span>Check your email for immediate action steps</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">2.</span>
            <span>Our support team will reach out within 24 hours</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">3.</span>
            <span>We'll work together to resolve your concerns</span>
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

