'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Call ready() as soon as possible
    try {
      const { sdk } = require('@farcaster/miniapp-sdk')
      sdk.actions.ready()
    } catch (error) {
      // SDK not available outside Base app
      console.log('Running outside Base app')
    }

    // Redirect to challenges after ready call
    router.push('/challenges')
  }, [router])

  return null
}


