'use client'

import { useAccount, useConnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [isMounted, setIsMounted] = useState(false)
  const [userContext, setUserContext] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch Farcaster user data from SDK
  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        const context = await sdk.context
        console.log('[useWalletAddress] Farcaster context:', context)
        setUserContext(context)
      } catch (error) {
        console.log('[useWalletAddress] Not in Farcaster context:', error)
        setUserContext(null)
      }
    }

    if (isMounted) {
      fetchUserContext()
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
