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
    // Temporarily disabled to diagnose white screen
    setCurrentUserProfile(null)
    setIsLoading(false)
  }, [])

  return {
    currentUserProfile,
    isLoading,
  }
}
