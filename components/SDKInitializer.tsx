'use client'

import { useEffect, useState } from 'react'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initializeSDK = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        await sdk.actions.ready()
        if (isMounted) {
          setIsReady(true)
        }
      } catch (error) {
        // Not in Farcaster environment - that's OK, still render
        if (isMounted) {
          setIsReady(true)
        }
      }
    }

    // Delay initialization to ensure we're fully mounted
    const timer = setTimeout(() => {
      initializeSDK()
    }, 50)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [])

  // Always render children immediately - don't wait for SDK
  return <>{children}</>
}
