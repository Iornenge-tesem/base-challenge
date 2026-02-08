'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initializeSDK = async () => {
      try {
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

    // Use requestAnimationFrame to ensure DOM is ready
    const frame = requestAnimationFrame(() => {
      initializeSDK()
    })

    return () => {
      isMounted = false
      cancelAnimationFrame(frame)
    }
  }, [])

  // Always render children - don't block on SDK
  return <>{children}</>
}
