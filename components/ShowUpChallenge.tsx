'use client'

import { useState, useEffect } from 'react'
import CheckInButton from './CheckInButton'
import StreakDisplay from './StreakDisplay'
import LeaderBoard from './LeaderBoard'
import OnboardingModal from './OnboardingModal'
import StreakDisplaySkeleton from './skeletons/StreakDisplaySkeleton'
import CheckInButtonSkeleton from './skeletons/CheckInButtonSkeleton'
import LeaderBoardSkeleton from './skeletons/LeaderBoardSkeleton'
import { useWalletAddress } from '@/hooks/useWalletAddress'
import { useFarcasterUser } from '@/hooks/useFarcasterUser'

export default function ShowUpChallenge() {
  // BCP schedule config (can be updated later from backend)
  const bcpSchedule = {
    dailyEarly: 1,
    dailyTarget: 0.2,
  }
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [checkInImageData, setCheckInImageData] = useState<{ shareUrl: string; imageUrl: string } | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)

  // Get wallet address
  const { address } = useWalletAddress()
  const { username: farcasterUsername, displayName: farcasterDisplayName, pfpUrl: farcasterPfpUrl } = useFarcasterUser()

  useEffect(() => {
    if (address) {
      setCurrentAddress(address)
    }
  }, [address])

  useEffect(() => {
    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
    
    // Load user data from API
    const loadUserData = async () => {
      if (!currentAddress) return
      
      try {
        const response = await fetch(`/api/checkin?wallet_address=${currentAddress}`)
        if (response.ok) {
          const data = await response.json()
          setHasCheckedInToday(data.hasCheckedInToday)
          setStreak(data.stats.current_streak || 0)
          setPoints(data.stats.total_bcp || 0)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [currentAddress])

  const closeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const handleCheckIn = async () => {
    if (!currentAddress) return

    try {
      // Call the real API to check in
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: currentAddress,
          challenge_id: 'show-up',
          farcaster_username: farcasterUsername,
          farcaster_display_name: farcasterDisplayName,
          farcaster_pfp_url: farcasterPfpUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.hasCheckedIn) {
          alert('You have already checked in today!')
        } else {
          alert(data.error || 'Failed to check in')
        }
        return
      }

      // Update state with new values from API
      const newStreak = data.stats.current_streak
      const newPoints = data.stats.total_bcp
      
      setStreak(newStreak)
      setPoints(newPoints)
      setHasCheckedInToday(true)

      // Auto-generate shareable image after check-in
      await generateCheckInImage(newStreak, newPoints)
    } catch (error) {
      console.error('Error checking in:', error)
      alert('Failed to check in. Please try again.')
    }
  }

  const generateCheckInImage = async (currentStreak: number, currentPoints: number) => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          address: currentAddress, 
          streak: currentStreak, 
          points: currentPoints,
          username: username,
          avatar: avatar
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCheckInImageData({
          shareUrl: data.shareUrl,
          imageUrl: data.imageUrl
        })
      }
    } catch (error) {
      console.error('Error generating check-in image:', error)
    }
  }

  const closeImageModal = () => {
    setCheckInImageData(null)
  }

  const handleShare = async () => {
    if (!checkInImageData?.shareUrl) return

    const shareText = `${username || 'A user'} showed up on Base today!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Base Challenge Check-In',
          text: shareText,
          url: checkInImageData.shareUrl,
        })
      } catch (error) {
        console.error('Share cancelled or failed:', error)
      }
      return
    }

    try {
      await navigator.clipboard.writeText(checkInImageData.shareUrl)
      alert('Share link copied to clipboard')
    } catch (error) {
      console.error('Failed to copy share link:', error)
    }
  }

  const handleDownload = () => {
    if (!checkInImageData?.imageUrl) return
    const a = document.createElement('a')
    a.href = checkInImageData.imageUrl
    a.download = `base-challenge-checkin-${Date.now()}.svg`
    a.click()
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}
      
      {/* Check-in Success Modal */}
      {checkInImageData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-primary-light-blue rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-accent-green">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-2">
                Check-In Successful!
              </h3>
              <p className="text-primary-dark-blue dark:text-accent-light-gray">
                +{bcpSchedule.dailyEarly} BCP earned
              </p>
            </div>

            {/* Generated Image Preview */}
            <div className="mb-4 rounded-lg overflow-hidden border-2 border-accent-green">
              <img 
                src={checkInImageData.imageUrl} 
                alt="Check-in achievement" 
                className="w-full h-auto"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="w-full bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue py-3 rounded-lg font-bold transition-all"
              >
                📤 Share
              </button>
              <button
                onClick={handleDownload}
                className="w-full bg-primary-light-mode-blue dark:bg-primary-dark-blue hover:bg-primary-dark-blue dark:hover:bg-primary-dark-blue/80 text-primary-dark-blue dark:text-primary-white py-3 rounded-lg font-bold transition-all"
              >
                📥 Download
              </button>
              <button
                onClick={closeImageModal}
                className="w-full bg-transparent text-primary-dark-blue dark:text-primary-white py-2 rounded-lg font-semibold hover:opacity-80 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-4 pb-12">
        {isLoading ? (
          <StreakDisplaySkeleton />
        ) : (
          <StreakDisplay 
            streak={streak} 
            points={points}
            address={currentAddress}
          />
        )}
        
        {isLoading ? (
          <CheckInButtonSkeleton />
        ) : (
          <CheckInButton 
            onCheckIn={handleCheckIn}
            hasCheckedInToday={hasCheckedInToday}
            note={`${bcpSchedule.dailyEarly} BCP/day (early users)`}
          />
        )}
        
        {isLoading ? (
          <LeaderBoardSkeleton />
        ) : (
          <LeaderBoard />
        )}
      </div>
    </>
  )
}
