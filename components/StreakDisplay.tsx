'use client'

import { useState } from 'react'

interface StreakDisplayProps {
  streak: number
  points: number
  address?: string | null
}

export default function StreakDisplay({ streak, points, address }: StreakDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareableImage = async () => {
    setIsGenerating(true)
    try {
      // This will generate a shareable image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, streak, points }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `base-challenge-streak-${streak}.png`
        a.click()
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Only show streak badge if user has 7+ days
  const showStreakBadge = streak >= 7;
  const weekStreak = Math.floor(streak / 7);

  return (
    <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-lg p-4 border-2 border-primary-light-mode-blue dark:border-accent-green">
      <div className={`grid ${showStreakBadge ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
        {showStreakBadge && (
          <div className="text-center p-4 bg-gradient-to-br from-accent-green/30 to-accent-green-dark/20 dark:from-accent-green/30 dark:to-accent-green-dark/20 rounded-xl border border-primary-light-mode-blue dark:border-accent-green/50">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent mb-1">
              {weekStreak}
            </div>
            <div className="text-sm text-primary-dark-blue dark:text-primary-white font-medium">
              Week Streak
            </div>
          </div>
        )}
        
        <div className="text-center p-4 bg-gradient-to-br from-accent-green/20 to-accent-green-dark/10 dark:from-accent-green/20 dark:to-accent-green-dark/10 rounded-xl border border-primary-light-mode-blue dark:border-accent-green/40">
          <div className="text-3xl mb-1">⭐</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent mb-1">
            {points}
          </div>
          <div className="text-sm text-primary-dark-blue dark:text-primary-white font-medium">
            Total BCP
          </div>
        </div>
      </div>

      {showStreakBadge && (
        <button
          onClick={generateShareableImage}
          disabled={isGenerating}
          className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-accent-green to-accent-green-dark hover:from-accent-green/90 hover:to-accent-green-dark/90 text-primary-dark-blue rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
        >
          {isGenerating ? 'Generating...' : '📸 Share Your Streak'}
        </button>
      )}
    </div>
  )
}
