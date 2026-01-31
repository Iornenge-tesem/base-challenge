'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function Home() {
  useEffect(() => {
    try {
      const { sdk } = require('@farcaster/miniapp-sdk')
      sdk.actions.ready()
    } catch (error) {
      // SDK not available or error - app still works
      console.debug('MiniApp SDK not available')
    }
    redirect('/challenges')
  }, [])

  return null
}
