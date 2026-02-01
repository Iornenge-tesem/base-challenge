'use client'

import { useEffect, useState } from 'react'
import UserProfile from '@/components/UserProfile'
import StreakDisplay from '@/components/StreakDisplay'
import BackButton from '@/components/BackButton'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { useFarcasterUser } from '@/hooks/useFarcasterUser'
import ConnectWallet from '@/components/ConnectWallet'

export default function ProfilePage() {
  const { address, disconnectWallet } = useWalletAddress()
  const { user: farcasterUser } = useFarcasterUser()
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const loadStats = async () => {
      if (!address) return
      try {
        const response = await fetch(`/api/checkin?wallet_address=${address}`)
        if (response.ok) {
          const data = await response.json()
          setStreak(data.stats.current_streak || 0)
          setPoints(data.stats.total_bcp || 0)
        }
      } catch (error) {
        console.error('Error loading profile stats:', error)
      }
    }

    loadStats()
  }, [address])

  if (!address) {
    return (
      <main className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue">
        <div className="container mx-auto px-4 py-6 pb-20 space-y-6 max-w-2xl">
          <BackButton />
          <div className="text-center">
            <p className="text-primary-dark-blue dark:text-accent-light-gray mb-4">
              Connect your wallet to view your profile
            </p>
            <div className="flex justify-center">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </main>
    )
  }

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
          <div className="mt-4 flex justify-center">
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all duration-300"
            >
              Disconnect Wallet
            </button>
          </div>
        </header>

        <UserProfile
          address={address}
          username={farcasterUser?.username || ''}
          avatar={farcasterUser?.pfpUrl}
          showThemeToggle
        />

        <StreakDisplay
          streak={streak}
          points={points}
          address={address}
        />
      </div>
    </main>
  )
}
