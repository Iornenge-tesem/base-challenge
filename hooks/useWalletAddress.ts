'use client'

import { useAccount, useConnect } from 'wagmi'
import { useEffect, useState } from 'react'

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [isMounted, setIsMounted] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch Farcaster user data from SDK dynamically
  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        // Check if we're in browser
        if (typeof window === 'undefined') return
        
        // Dynamic import to avoid SSR issues
        const { sdk } = await import('@farcaster/miniapp-sdk')
        const context = await sdk.context
        setUserContext(context)
      } catch (error) {
        // Not in Farcaster context - this is normal
        setUserContext(null)
      }
    }

    if (isMounted) {
      // Small delay to ensure SDK is ready
      const timer = setTimeout(() => {
        fetchUserContext()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isMounted])

  const connectWallet = async () => {
    if (!isMounted) return
    const farcasterConnector = connectors.find(c => c.id === 'farcasterMiniApp')
    if (farcasterConnector) {
      connect({ connector: farcasterConnector })
      return
    }
    if (connectors[0]) {
      connect({ connector: connectors[0] })
    }
  }

  return {
    address: isMounted ? address : null,
    isConnected: isMounted ? isConnected : false,
    connectWallet,
    userContext,
  }
}
