'use client'

import { useState } from 'react'

interface CheckInButtonProps {
  onCheckIn: () => Promise<void>
  hasCheckedInToday: boolean
  note?: string
}

export default function CheckInButton({ onCheckIn, hasCheckedInToday, note }: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onCheckIn()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-lg p-3 text-center border-2 border-primary-light-mode-blue dark:border-accent-green">
      {hasCheckedInToday ? (
        <div className="space-y-2">
          <div className="text-3xl">✅</div>
          <h3 className="text-base font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
            Checked In Today!
          </h3>
          <p className="text-xs text-primary-dark-blue dark:text-primary-white">
            Come back tomorrow to continue your streak
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-base font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
            Ready to Check In?
          </h3>
          <p className="text-xs text-primary-dark-blue dark:text-primary-white">
            Check in daily to build your streak and earn BCP
          </p>
          {note && (
            <p className="text-[11px] text-primary-dark-blue dark:text-accent-light-gray font-medium">
              {note}
            </p>
          )}
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-accent-green to-accent-green-dark hover:from-accent-green/90 hover:to-accent-green-dark/90 text-primary-dark-blue rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] w-full md:w-auto shadow-md"
          >
            {isLoading ? 'Checking In...' : 'Check In Now'}
          </button>
        </div>
      )}
    </div>
  )
}
