'use client'

import { useEffect, useState } from 'react'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const callReady = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        await sdk.actions.ready()
        if (isMounted) {
          console.log('✅ SDK ready() called successfully')
          setIsReady(true)
        }
      } catch (error) {
        if (isMounted) {
          console.log('Running outside Base app environment')
          setIsReady(true) // Still render the app
        }
      }
    }

    // Call immediately
    void callReady()

    return () => {
      isMounted = false
    }
  }, [])

  // Always render children - don't block on SDK ready
  return <>{children}</>
}
