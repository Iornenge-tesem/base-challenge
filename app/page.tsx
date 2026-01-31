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
        // Wait a bit for SDK to be injected by Base
        await new Promise(resolve => setTimeout(resolve, 100))

        // Try accessing from window first (SDK injected by Base)
        if (typeof window !== 'undefined') {
          console.log('Window object available')
          
          // Check for SDK on window object
          if ((window as any).farcaster?.actions?.ready) {
            await (window as any).farcaster.actions.ready()
            console.log('✅ SDK ready signal sent via window.farcaster')
            setSdkReady(true)
            return
          }
          
          // Fallback: try importing SDK
          try {
            const { sdk } = await import('@farcaster/miniapp-sdk')
            if (sdk?.actions?.ready) {
              await sdk.actions.ready()
              console.log('✅ SDK ready signal sent via import')
              setSdkReady(true)
              return
            }
          } catch (importError) {
            console.error('Import error:', importError)
          }
        }
        
        console.warn('⚠️ SDK not found - proceeding without ready signal')
      } catch (error) {
        console.error('❌ SDK initialization error:', error)
      }
      
      setSdkReady(true)
    }

    initializeSDK()
  }, [])

  useEffect(() => {
    // Redirect after SDK is ready
    if (sdkReady) {
      console.log('🔄 Redirecting to /challenges')
      router.push('/challenges')
    }
  }, [sdkReady, router])

  return null
}

