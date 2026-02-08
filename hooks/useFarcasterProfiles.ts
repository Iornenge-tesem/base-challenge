'use client'

import { useEffect, useState } from 'react'

export interface FarcasterProfile {
  displayName?: string
  pfpUrl?: string
  username?: string
  fid?: number
}

export function useFarcasterProfiles() {
  const [currentUserProfile, setCurrentUserProfile] = useState<FarcasterProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        // Check if we're in browser
        if (typeof window === 'undefined') {
          setIsLoading(false)
          return
        }
        
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        const context = await sdk.context
        const user = context.user

        if (user) {
          setCurrentUserProfile({
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
            username: user.username,
            fid: user.fid,
          })
        }
      } catch (error) {
        // Not in Farcaster context - this is normal
        setCurrentUserProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to ensure SDK is ready
    const timer = setTimeout(() => {
      fetchCurrentUserProfile()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  return {
    currentUserProfile,
    isLoading,
  }
}
