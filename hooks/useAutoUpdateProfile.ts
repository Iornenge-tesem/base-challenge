'use client'

import { useEffect } from 'react'
import { useWalletAddress } from './useWalletAddress'

export function useAutoUpdateProfile() {
  const { address, userContext } = useWalletAddress()

  useEffect(() => {
    if (!address) return

    if (!userContext?.user) return

    const updateProfile = async () => {
      try {
        const displayName = userContext.user.displayName || userContext.user.username
        const pfpUrl = userContext.user.pfpUrl

        const response = await fetch('/api/update-participant-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            displayName,
            pfpUrl,
          }),
        })

        if (!response.ok) {
          const result = await response.json()
          console.error('Profile update failed:', result)
        }
      } catch (error) {
        console.error('Profile update error:', error)
      }
    }

    // Call immediately
    updateProfile()

    // Also update periodically
    const interval = setInterval(updateProfile, 60000)
    return () => clearInterval(interval)
  }, [address, userContext?.user?.displayName, userContext?.user?.pfpUrl, userContext?.user?.username])
}

