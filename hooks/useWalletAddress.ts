'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useMiniKit } from '@coinbase/onchainkit/minikit'
import { useEffect, useState } from 'react'

export function useWalletAddress() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { context } = useMiniKit()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const userFid = context?.user?.fid

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

  const disconnectWallet = () => {
    disconnect()
  }

  return {
    address: isMounted ? address : null,
    isConnected: isMounted ? isConnected : false,
    connectWallet,
    disconnectWallet,
    userFid,
    userContext: context,
  }
}
