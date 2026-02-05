'use client'

import { useEffect } from 'react'
import { useWalletAddress } from './useWalletAddress'

export function useAutoUpdateProfile() {
  const { address, userContext } = useWalletAddress()

  useEffect(() => {
    if (!address || !userContext?.user) return

    const updateProfile = async () => {
      try {
        // Extract display name and pfp from Farcaster context
        const displayName = userContext.user.displayName || userContext.user.username
        const pfpUrl = userContext.user.pfpUrl

        console.log('Auto-updating profile:', { address, displayName, pfpUrl })

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
          const error = await response.json()
          console.error('Failed to update profile:', error)
        } else {
          const result = await response.json()
          console.log('Profile auto-update success:', result)
        }
      } catch (error) {
        console.error('Error auto-updating profile:', error)
      }
    }

    // Call immediately when wallet connects
    updateProfile()

    // Also update on an interval in case they change their avatar while connected
    const interval = setInterval(updateProfile, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [address, userContext?.user?.displayName, userContext?.user?.pfpUrl, userContext?.user?.username])
}
