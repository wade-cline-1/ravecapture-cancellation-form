'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Wrench, Headphones } from 'lucide-react'

interface TechnicalIssuesConfirmationStepProps {
  onNext: (data?: any) => void
  data: any
}

export function TechnicalIssuesConfirmationStep({ onNext, data }: TechnicalIssuesConfirmationStepProps) {
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
          emailType: 'technical_issues_followup',
          data: {
            userEmail: data.email,
            educationType: 'technical_issues',
            specificIssues: data.specificIssues
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
        <Wrench className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Technical Support Information
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We've sent you detailed technical support information and immediate troubleshooting steps for your specific issues.
        </p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-orange-500 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Email Contents</h3>
            <ul className="text-orange-800 space-y-2">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>Immediate troubleshooting steps for your specific issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>Direct contact information for our technical support team</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>System requirements and compatibility information</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>Common solutions for reported technical issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>Escalation process for complex technical problems</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Wrench className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Fixes</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Step-by-step solutions for the most common technical issues, including browser compatibility, 
            API integration problems, and data synchronization issues.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Headphones className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Expert Support</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Direct access to our technical support team who can provide personalized assistance 
            for your specific technical challenges.
          </p>
        </div>
      </div>

      {data.specificIssues && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">🔧</span>
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">Your Specific Issues</h4>
              <p className="text-sm text-blue-700 mt-1">
                We've noted your specific technical concerns: <em>"{data.specificIssues}"</em>. 
                Our technical team has prepared targeted solutions for these issues.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Support Process</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">1.</span>
            <span>Try the troubleshooting steps in your email</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">2.</span>
            <span>Contact our technical support team if issues persist</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">3.</span>
            <span>Our team will work with you until the issues are resolved</span>
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

