'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, ShoppingBag, Star } from 'lucide-react'

interface RetailSyndicationConfirmationStepProps {
  onNext: (data?: any) => void
  data: any
}

export function RetailSyndicationConfirmationStep({ onNext, data }: RetailSyndicationConfirmationStepProps) {
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
          emailType: 'retail_syndication_followup',
          data: {
            userEmail: data.email,
            educationType: 'retail_syndication'
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
        <ShoppingBag className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Retail Syndication Information
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We've sent you detailed information about our retail syndication features and how they can help your business.
        </p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-purple-500 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Email Contents</h3>
            <ul className="text-purple-800 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Overview of retail syndication capabilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>How to set up retail partnerships</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Best practices for retail review collection</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Integration guides for popular retail platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Success stories from other businesses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Star className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Retail Partnerships</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Learn how to establish partnerships with retail locations to collect reviews from customers who visit multiple touchpoints.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-6 h-6 text-purple-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Multi-Channel Reviews</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Discover strategies for collecting reviews across multiple retail channels and platforms to maximize your review volume.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">📈</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Implementation Support</h4>
            <p className="text-sm text-blue-700 mt-1">
              Our team is ready to help you implement retail syndication features. The email includes contact information 
              for our integration specialists who can guide you through the setup process.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Next Steps</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">1.</span>
            <span>Review the retail syndication guide in your email</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">2.</span>
            <span>Identify potential retail partners in your area</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-500 mr-2">3.</span>
            <span>Contact our integration team for setup assistance</span>
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

