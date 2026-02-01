'use client'

import { useEffect, useState } from 'react'
import UserProfile from '@/components/UserProfile'
import StreakDisplay from '@/components/StreakDisplay'
import BackButton from '@/components/BackButton'
import ShareButton from '@/components/ShareButton'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { useFarcasterUser } from '@/hooks/useFarcasterUser'
import ConnectWallet from '@/components/ConnectWallet'

export default function ProfilePage() {
  const { address } = useWalletAddress()
  const { user: farcasterUser } = useFarcasterUser()
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [inviteCount, setInviteCount] = useState(0)

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

    const loadInvites = async () => {
      if (!farcasterUser?.username) return
      try {
        const response = await fetch(`/api/referrals?username=${encodeURIComponent(farcasterUser.username)}`)
        if (response.ok) {
          const data = await response.json()
          setInviteCount(data.inviteCount || 0)
        }
      } catch (error) {
        console.error('Error loading invite count:', error)
      }
    }

    loadStats()
    loadInvites()
  }, [address, farcasterUser?.username])

  if (!address) {
    return (
      <main className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue">
        <div className="container mx-auto px-4 pt-2 pb-20 space-y-5 max-w-2xl">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white">
              Profile
            </h1>
          </div>
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
      <div className="container mx-auto px-4 pt-2 pb-20 space-y-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white">
              Profile
            </h1>
            <p className="text-sm text-primary-dark-blue dark:text-accent-light-gray text-center">
              Manage your preferences and view your stats
            </p>
          </div>
        </div>

        <UserProfile
          address={address}
          username={farcasterUser?.displayName || ''}
          avatar={farcasterUser?.pfpUrl}
          showThemeToggle
        />

        <StreakDisplay
          streak={streak}
          points={points}
          address={address}
        />

        {/* Invite Stats */}
        <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary-dark-blue dark:text-primary-white">
              Referrals
            </h3>
            <div className="bg-accent-green/10 dark:bg-accent-green/20 px-3 py-1 rounded-full">
              <span className="text-accent-green dark:text-accent-green font-bold">
                {inviteCount} invited
              </span>
            </div>
          </div>
          <p className="text-sm text-primary-dark-blue dark:text-accent-light-gray mb-4">
            Share your referral link and earn rewards when friends join!
          </p>
          <ShareButton 
            referralCode={farcasterUser?.username}
            text={`I'm on a ${streak}-day streak on Base Challenge! 🔥 Join me and start building your streak too!`}
            className="w-full justify-center"
          />
        </div>
      </div>
    </main>
  )
}
