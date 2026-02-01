'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true

    const callReady = async () => {
      try {
        // Ensure the SDK is fully available after mount
        await sdk.actions.ready()
        if (isMounted) {
          console.log('✅ SDK ready() called successfully')
        }
      } catch (error) {
        if (isMounted) {
          console.log('Running outside Base app environment')
        }
      }
    }

    // Defer to next tick to avoid race conditions
    setTimeout(() => {
      void callReady()
    }, 0)

    return () => {
      isMounted = false
    }
  }, [])

  return <>{children}</>
}
