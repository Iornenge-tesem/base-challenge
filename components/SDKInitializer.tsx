'use client'

import { useEffect } from 'react'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize SDK as soon as component mounts
    const initSDK = () => {
      try {
        const { sdk } = require('@farcaster/miniapp-sdk')
        sdk.actions.ready()
        console.log('✅ Farcaster SDK ready signal sent')
      } catch (error) {
        console.log('Not running in Base app environment')
      }
    }

    initSDK()
  }, [])

  return <>{children}</>
}
