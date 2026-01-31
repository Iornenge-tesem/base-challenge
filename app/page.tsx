'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    // Signal to Base that the mini app is ready
    const initializeSDK = async () => {
      try {
        // Try direct import first
        const { sdk } = await import('@farcaster/miniapp-sdk')
        
        if (sdk && sdk.actions && typeof sdk.actions.ready === 'function') {
          await sdk.actions.ready()
          console.log('✅ SDK ready signal sent successfully')
        } else {
          console.warn('⚠️ SDK or sdk.actions not properly initialized')
        }
      } catch (error) {
        console.error('❌ Failed to initialize SDK:', error)
        // Still continue even if SDK fails
      }
      
      setSdkReady(true)
    }

    initializeSDK()
  }, [])

  useEffect(() => {
    // Redirect after SDK is ready
    if (sdkReady) {
      console.log('Redirecting to /challenges')
      router.push('/challenges')
    }
  }, [sdkReady, router])

  return null
}

