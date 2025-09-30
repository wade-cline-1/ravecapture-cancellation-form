'use client'

import { useState } from 'react'
import { Calendar, Clock, User, CheckCircle } from 'lucide-react'

interface ReviewOptimizationCalendlyStepProps {
  onNext: (data?: any) => void
  data: any
}

export function ReviewOptimizationCalendlyStep({ onNext, data }: ReviewOptimizationCalendlyStepProps) {
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  const handleScheduleCall = async () => {
    setIsScheduling(true)
    
    // Simulate Calendly integration
    // In a real implementation, this would:
    // 1. Open Calendly widget or redirect to Calendly page
    // 2. Handle the scheduling callback
    // 3. Store the scheduled appointment details
    
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
            We've scheduled your review optimization consultation. You'll receive a calendar invite shortly.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
          <ul className="text-sm text-blue-800 text-left space-y-1">
            <li>• 30-minute consultation call</li>
            <li>• Review of your current strategy</li>
            <li>• Custom recommendations for your business</li>
            <li>• Action plan to increase review volume</li>
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
        <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Let's Optimize Your Review Strategy
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Schedule a free consultation with our review optimization expert to discuss proven strategies for increasing your review volume.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">30-Minute Call</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Quick but comprehensive consultation to understand your current challenges and provide actionable solutions.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Expert Guidance</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Get personalized recommendations from our review optimization specialists who have helped hundreds of businesses.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-3">What we'll cover:</h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Analysis of your current review collection process</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Best practices for timing and messaging</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Platform-specific optimization strategies</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Custom action plan for your business</span>
          </li>
        </ul>
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
              Schedule Free Consultation
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
        You can always schedule this consultation later through your account dashboard.
      </p>
    </div>
  )
}

