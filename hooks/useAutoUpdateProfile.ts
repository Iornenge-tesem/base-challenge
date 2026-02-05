'use client'

import { useEffect } from 'react'
import { useWalletAddress } from './useWalletAddress'

export function useAutoUpdateProfile() {
  const { address, userContext } = useWalletAddress()

  useEffect(() => {
    console.log('[useAutoUpdateProfile] Checking - address:', address, 'userContext:', userContext)

    if (!address) {
      console.log('[useAutoUpdateProfile] No address, skipping')
      return
    }

    if (!userContext?.user) {
      console.log('[useAutoUpdateProfile] No userContext.user, context available:', !!userContext)
      return
    }

    const updateProfile = async () => {
      try {
        const displayName = userContext.user.displayName || userContext.user.username
        const pfpUrl = userContext.user.pfpUrl

        console.log('[useAutoUpdateProfile] User data from SDK:', {
          displayName: userContext.user.displayName,
          username: userContext.user.username,
          pfpUrl: userContext.user.pfpUrl,
          fid: userContext.user.fid,
        })

        console.log('[useAutoUpdateProfile] Sending to backend:', { address, displayName, pfpUrl })

        const response = await fetch('/api/update-participant-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            displayName,
            pfpUrl,
          }),
        })

        const result = await response.json()
        console.log('[useAutoUpdateProfile] Response:', result, 'status:', response.status)

        if (!response.ok) {
          console.error('[useAutoUpdateProfile] Failed:', result)
        }
      } catch (error) {
        console.error('[useAutoUpdateProfile] Error:', error)
      }
    }

    // Call immediately
    updateProfile()

    // Also update periodically
    const interval = setInterval(updateProfile, 60000)
    return () => clearInterval(interval)
  }, [address, userContext?.user?.displayName, userContext?.user?.pfpUrl, userContext?.user?.username])
}

