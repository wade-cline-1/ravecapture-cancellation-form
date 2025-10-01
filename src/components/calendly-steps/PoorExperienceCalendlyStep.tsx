'use client'

import { useState } from 'react'
import { Calendar, MessageCircle, User, CheckCircle, Heart } from 'lucide-react'

interface PoorExperienceCalendlyStepProps {
  onNext: (data?: any) => void
  data: any
}

export function PoorExperienceCalendlyStep({ onNext, data }: PoorExperienceCalendlyStepProps) {
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  const handleScheduleCall = async () => {
    setIsScheduling(true)
    
    // Open Wade's Calendly page for poor experience discussions
    window.open('https://calendly.com/wade-cline/discussionaboutcurrentplan', '_blank')
    
    // Simulate scheduling completion
    setTimeout(() => {
      setIsScheduling(false)
      setScheduled(true)
    }, 2000)
  }

  const handleSkip = () => {
    onNext({ calendlyScheduled: false })
  }

  const handleContinue = () => {
    onNext({ calendlyScheduled: true })
  }

  if (scheduled) {
    return (
      <div className="text-center p-8">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Scheduled!</h2>
          <p className="text-gray-600 mb-6">
            We've scheduled your experience improvement consultation. You'll receive a calendar invite shortly.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">What to expect:</h3>
          <ul className="text-sm text-green-800 text-left space-y-1">
            <li>• 30-minute consultation call</li>
            <li>• Deep dive into your specific concerns</li>
            <li>• Personalized solutions for your situation</li>
            <li>• Follow-up plan to ensure satisfaction</li>
          </ul>
        </div>
        
        <button 
          onClick={handleContinue}
          className="rc-button-primary"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Let's Make This Right
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We're truly sorry for your poor experience. Let's schedule a call to understand what went wrong and how we can make it better.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Listen & Learn</h3>
          </div>
          <p className="text-gray-600 text-sm">
            We want to hear about your experience in detail so we can understand what went wrong and prevent it from happening again.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Attention</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Get direct access to our customer success team who will work with you personally to resolve any issues.
          </p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-red-900 mb-3">What we'll discuss:</h3>
        <ul className="text-red-800 space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Detailed review of your specific concerns</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Root cause analysis of what went wrong</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Immediate steps to address your issues</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Long-term plan to ensure your success</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">💡</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-900">Our Commitment</h4>
            <p className="text-sm text-blue-700 mt-1">
              We take every customer concern seriously. This call is our opportunity to not just fix the immediate issue, 
              but to understand how we can serve you better going forward.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleScheduleCall}
          disabled={isScheduling}
          className="rc-button-primary flex-1 flex items-center justify-center"
        >
          {isScheduling ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Call
            </>
          )}
        </button>
        
        <button
          onClick={handleSkip}
          className="rc-button-secondary flex-1"
        >
          Skip for Now
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        We understand if you prefer not to schedule a call, but we'd still love to hear your feedback.
      </p>
    </div>
  )
}

