'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

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
    let isMounted = true
    
    const fetchCurrentUserProfile = async () => {
      try {
        // Wait for SDK to be ready first
        await sdk.actions.ready()
        
        const context = await sdk.context
        if (!isMounted) return
        
        if (context?.user) {
          setCurrentUserProfile({
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            username: context.user.username,
            fid: context.user.fid,
          })
        }
      } catch (error) {
        // Not in Farcaster environment
        if (isMounted) {
          setCurrentUserProfile(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Delay slightly to ensure DOM is ready
    const timer = setTimeout(fetchCurrentUserProfile, 100)
    
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  return {
    currentUserProfile,
    isLoading,
  }
}
