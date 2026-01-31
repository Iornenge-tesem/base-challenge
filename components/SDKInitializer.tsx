'use client'

import { useEffect } from 'react'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Multiple attempts to ensure SDK is ready
    let attempts = 0
    const maxAttempts = 5

    const tryInitSDK = () => {
      try {
        const { sdk } = require('@farcaster/miniapp-sdk')
        if (sdk && sdk.actions && sdk.actions.ready) {
          sdk.actions.ready()
          console.log('✅ SDK ready() called successfully')
          return true
        }
      } catch (error) {
        console.log('SDK not available (attempt ' + (attempts + 1) + ')')
      }
      return false
    }

    // Try immediately
    if (tryInitSDK()) return

    // Retry with delays if first attempt fails
    const interval = setInterval(() => {
      attempts++
      if (tryInitSDK() || attempts >= maxAttempts) {
        clearInterval(interval)
        if (attempts >= maxAttempts) {
          console.log('Running outside Base app environment')
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}
