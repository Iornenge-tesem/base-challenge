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
    const fetchCurrentUserProfile = async () => {
      try {
        const context = await sdk.context
        const user = context.user

        setCurrentUserProfile({
          displayName: user.displayName,
          pfpUrl: user.pfpUrl,
          username: user.username,
          fid: user.fid,
        })
      } catch (error) {
        setCurrentUserProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUserProfile()
  }, [])

  return {
    currentUserProfile,
    isLoading,
  }
}
