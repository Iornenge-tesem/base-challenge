'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export default function SDKInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      sdk.actions.ready()
      console.log('✅ SDK ready() called successfully')
    } catch (error) {
      console.log('Running outside Base app environment')
    }
  }, [])

  return <>{children}</>
}
