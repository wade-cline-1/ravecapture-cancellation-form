'use client'

import { useState } from 'react'
import { FormData } from '../CancellationForm'

interface FuturePlansStepProps {
  onNext: (data: Partial<FormData>) => void
  data: FormData
}

export function FuturePlansStep({ onNext, data }: FuturePlansStepProps) {
  const [futurePlans, setFuturePlans] = useState(data.futurePlans || '')
  const [competitorInfo, setCompetitorInfo] = useState(data.competitorInfo || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      onNext({
        futurePlans: futurePlans || undefined,
        competitorInfo: competitorInfo || undefined
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Help us understand your next steps
        </h2>
        <p className="text-gray-600">
          This information helps us improve our service
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="futurePlans" className="block text-sm font-medium text-gray-700 mb-2">
            What are your plans for review management going forward?
          </label>
          <textarea
            id="futurePlans"
            value={futurePlans}
            onChange={(e) => setFuturePlans(e.target.value)}
            className="rc-input resize-none"
            rows={4}
            placeholder="Please share your plans for managing reviews in the future..."
          />
        </div>

        <div>
          <label htmlFor="competitorInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Are you switching to a different service? If so, which one?
          </label>
          <textarea
            id="competitorInfo"
            value={competitorInfo}
            onChange={(e) => setCompetitorInfo(e.target.value)}
            className="rc-input resize-none"
            rows={3}
            placeholder="Please let us know if you're switching to another service..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`rc-button-primary ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Complete Cancellation'}
        </button>
      </div>
    </div>
  )
}
