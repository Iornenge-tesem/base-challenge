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
    // Temporarily disabled to diagnose white screen
    // Will re-enable once base app loads properly
    setUserContext(null)
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
