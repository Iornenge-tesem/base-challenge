'use client'

import { useEffect, useState } from 'react'
import UserProfile from '@/components/UserProfile'
import StreakDisplay from '@/components/StreakDisplay'
import BackButton from '@/components/BackButton'

export default function ProfilePage() {
  const mockAddress = '0x1234567890123456789012345678901234567890'
  const username = 'Demo User'
  const avatar = ''
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    setStreak(Number(localStorage.getItem('streak') || 0))
    setPoints(Number(localStorage.getItem('points') || 0))
  }, [])

  return (
    <main className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue">
      <div className="container mx-auto px-4 py-6 pb-20 space-y-6 max-w-2xl">
        <BackButton />
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white">
            Profile
          </h1>
          <p className="text-primary-dark-blue dark:text-accent-light-gray">
            Manage your preferences and view your stats
          </p>
        </header>

        <UserProfile
          address={mockAddress}
          username={username}
          avatar={avatar}
          showThemeToggle
        />

        <StreakDisplay
          streak={streak}
          points={points}
          address={mockAddress}
        />
      </div>
    </main>
  )
}
