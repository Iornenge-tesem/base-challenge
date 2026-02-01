'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

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
        // Check if SDK is available
        if (typeof window === 'undefined' || !sdk) {
          setIsLoading(false)
          return
        }

        const miniAppStatus = await Promise.race([
          sdk.isInMiniApp(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 2000)) // 2s timeout
        ])
        
        if (miniAppStatus) {
          const context = await Promise.race([
            sdk.context,
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Context timeout')), 2000))
          ]) as Awaited<ReturnType<typeof sdk.context>>
          
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
