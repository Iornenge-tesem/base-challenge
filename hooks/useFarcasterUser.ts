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
    let isMounted = true
    
    const loadUserData = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        
        const miniAppStatus = await sdk.isInMiniApp()
        if (!isMounted) return
        
        if (miniAppStatus) {
          const context = await sdk.context
          if (!isMounted) return
          
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
        // Not in mini app or SDK error - that's OK
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user data')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Delay to ensure DOM is ready
    const timer = setTimeout(loadUserData, 100)
    
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  return { user, isLoading, error }
}
