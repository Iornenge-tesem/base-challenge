'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'

export default function BackfillPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBackfill = async () => {
    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/backfill-farcaster', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to backfill')
      } else {
        setResult(data)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-12">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <BackButton />
        
        <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-4">
            Backfill Farcaster Data
          </h1>
          
          <p className="text-primary-dark-blue dark:text-accent-light-gray mb-6">
            This will fetch Farcaster usernames and avatars for all existing participants and update the leaderboard.
          </p>

          <button
            onClick={handleBackfill}
            disabled={isRunning}
            className="w-full bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? 'Running...' : 'Start Backfill'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400">
              <p className="font-semibold">{result.message}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>✅ Successful: {result.successCount}</p>
                <p>❌ Failed: {result.failureCount}</p>
                <p>📊 Total Processed: {result.totalProcessed}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
