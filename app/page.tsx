'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [sdkReady, setSdkReady] = useState(false)

  useEffect(() => {
    // Signal to Base that the mini app is ready
    try {
      const { sdk } = require('@farcaster/miniapp-sdk')
      sdk.actions.ready()
      console.log('SDK ready signal sent')
    } catch (error) {
      console.debug('MiniApp SDK not available or error:', error)
    }

    setSdkReady(true)
  }, [])

  useEffect(() => {
    // Redirect after SDK is ready
    if (sdkReady) {
      router.push('/challenges')
    }
  }, [sdkReady, router])

  return null
}

