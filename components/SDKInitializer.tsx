'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      // Only call ready if we're in a miniapp environment
      if (typeof window !== 'undefined' && sdk?.actions?.ready) {
        sdk.actions.ready()
        console.log('✅ SDK ready() called successfully')
      }
    } catch (error) {
      console.log('SDK initialization skipped:', error)
    }
  }, [])

  return <>{children}</>
}
