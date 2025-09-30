'use client'

import { CancellationForm } from '@/components/CancellationForm'

export default function Home() {
  return (
    <div className="rc-container">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="rc-card">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                We&apos;re sorry to see you go
              </h1>
              <p className="text-lg text-gray-600">
                Your feedback helps us improve our service for other customers
              </p>
            </div>
            
            <CancellationForm />
          </div>
        </div>
      </div>
    </div>
  )
}