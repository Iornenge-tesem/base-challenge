'use client'

import { useEffect, useState } from 'react'

export interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

export function useFarcasterUser() {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Dynamic import to avoid SSR crash - SDK accesses window on import
        const { sdk } = await import('@farcaster/miniapp-sdk')
        const miniAppStatus = await sdk.isInMiniApp()
        if (miniAppStatus) {
          const context = await sdk.context
          if (context?.user) {
            setUser({
              fid: context.user.fid,
              username: context.user.username,
              displayName: context.user.displayName,
              pfpUrl: context.user.pfpUrl,
            })
          }
        }
      } catch (err) {
        console.error('Error loading Farcaster user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  return { user, isLoading, error }
}
