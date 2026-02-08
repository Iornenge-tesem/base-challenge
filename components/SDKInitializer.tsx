'use client'

import { useEffect, useState } from 'react'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  const [hasCalledReady, setHasCalledReady] = useState(false)

  useEffect(() => {
    // Only call once
    if (hasCalledReady) return
    
    let isMounted = true

    const callReady = async () => {
      try {
        // Check if we're in a Farcaster context first
        if (typeof window === 'undefined') return
        
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        
        // Only call ready if we haven't already
        if (isMounted && !hasCalledReady) {
          await sdk.actions.ready()
          setHasCalledReady(true)
          console.log('✅ SDK ready() called successfully')
        }
      } catch (error) {
        // Silently handle - we're probably not in Base app environment
        console.log('Not in Base app environment or SDK error:', error)
      }
    }

    // Small delay to ensure everything is mounted
    const timer = setTimeout(() => {
      void callReady()
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [hasCalledReady])

  return <>{children}</>
}
